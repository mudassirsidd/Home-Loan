import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmiPayment } from './emi-payment.entity';
import { User } from '../users/user.entity';
import { Loan } from '../Loan/loan.entity';
@Injectable()
export class EmiPaymentsService {
  constructor(
    @InjectRepository(EmiPayment)
    private readonly emiRepo: Repository<EmiPayment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    @InjectRepository(EmiPayment)
    private readonly emiPaymentRepository: Repository<EmiPayment>,
  ) {}

  async payEmi(userId: number, loanId: number, amount: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const loan = await this.loanRepo.findOneBy({ id: loanId });
    

    if (!user || !loan) throw new NotFoundException('User or Loan not found');

    const payment = this.emiRepo.create({
      amount,
      status: 'paid', // Initial status can be 'pending'
      user,
      loan,
    });

    return this.emiRepo.save(payment);
  }

  async getUserEmiPayments(userId: number) {
    return this.emiRepo.find({
      where: { user: { id: userId } },
      order: { paymentDate: 'DESC' },
    });
  }

  async getEmiHistory(loanId: number): Promise<EmiPayment[]> {
    return this.emiPaymentRepository.find({
      where: { loan: { id: loanId } },
      order: { paymentDate: 'ASC' },
      relations: ['loan'],
    });
  }
  async approveEmiPayment(emiId: number) {

    const payment = await this.emiRepo.findOne({ where: { emiId: emiId } });
    if (!payment) throw new NotFoundException('EMI Payment not found');
  
    payment.status = 'paid';
   
    return this.emiRepo.save(payment);
  }
    // async getPendingEmiPayments(userId: number): Promise<EmiPayment[]> {
    //     console.log('Fetching pending EMI payments for user:', userId);
    //     return this.emiRepo.find({
    //     where: { user: { id: userId }, status: 'pending' },
    //     order: { paymentDate: 'DESC' },
    //     });
    // }
    async getEmiPayment(emiId: number): Promise<EmiPayment> {
      const payment = await this.emiRepo.findOne({ where: { emiId: emiId } });
      if (!payment) throw new NotFoundException('EMI Payment not found');
      return payment;
    }
}
