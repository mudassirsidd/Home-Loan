// src/emi-payments/emi-payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Loan } from 'src/Loan/loan.entity';

@Entity()
export class EmiPayment {
  @PrimaryGeneratedColumn()
  emiId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['paid', 'failed', 'pending'], default: 'pending' })
  status: 'paid' | 'failed' | 'pending';

  @CreateDateColumn()
  paymentDate: Date;

  @ManyToOne(() => User, (user) => user.emiPayments, { eager: true })
  user: User;

  @ManyToOne(() => Loan, (loan) => loan.emiPayments, { eager: true })
  loan: Loan;
}
