// src/loan/loan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EmiPayment } from '../emi-payment/emi-payment.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bank_name: string;

  @Column('decimal')
  loanAmount: number;

  @Column()
  loanPurpose: string;

  @Column('decimal')
  income: number;

  @Column()
  employmentStatus: string;

  @Column('int')
  duration: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column()
  name: string; // New field for name

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date; // New field for date

  @Column()
  intrestRate: string; // New field for interest rate

  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @OneToMany(() => EmiPayment, (emi) => emi.loan)
  emiPayments: EmiPayment[];
}
