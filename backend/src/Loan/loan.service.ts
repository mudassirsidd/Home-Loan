import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateLoanDto } from './create-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
  ) {}

 
  async applyLoan(user: User, data: CreateLoanDto) {
   
    // const existingLoan = await this.loanRepo.findOne({
    //   where: { user: { id: user.id } },
    //   relations: ['user'],
    // });

    // if (existingLoan) {
    //   throw new BadRequestException(
    //     'You have already submitted a loan application.',
    //   );
    // }

    const existingPendingLoan = await this.loanRepo.findOne({
      where: {
        user: { id: user.id },
        status: 0, // 0 means pending
      },
      relations: ['user'],
    });
  
    if (existingPendingLoan) {
      throw new BadRequestException(
        'You already have a pending loan. Please wait for approval before applying again.',
      );
    }

    console.log('Loan application data:', user);
    // Create and save new loan
    const loan = this.loanRepo.create({
      bank_name: data.bank_name,
      loanAmount: data.loanAmount,
      loanPurpose: data.loanPurpose,
      income: data.income,
      employmentStatus: data.employmentStatus,
      duration: data.duration,
      status: data.status ?? 0, // 0 = pending by default
      name: data.name, // New field for name
      date: data.date, // New field for date
      intrestRate: data.intrestRate, // New field for interest rate
      user,
    });

    console.log('Loan object before save:', loan);

    return this.loanRepo.save(loan);
  }

  // ✅ Get loan by user
  async getLoanByUser(userId: number) {
    return this.loanRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
      relations: ['user', 'emiPayments'],
      
    });
  }
  // ✅ Get loan by user ID

  // ✅ Admin: Get all loans
  async getAllLoans() {
    return this.loanRepo.find({
      relations: ['user'],
    });
  }

  // ✅ Admin: Update loan status
  async updateLoanStatus(loanId: number, status: number) {
    const loan = await this.loanRepo.findOne({ where: { id: loanId } });
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    loan.status = status;
    return this.loanRepo.save(loan);
  }
  
}
