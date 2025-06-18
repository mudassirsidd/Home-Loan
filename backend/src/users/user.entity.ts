import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Loan } from '../Loan/loan.entity';
import { EmiPayment } from '../emi-payment/emi-payment.entity';
import { ChatMessage } from '../chat/chat-message.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];

  // src/users/user.entity.ts
@OneToMany(() => EmiPayment, (emi) => emi.user)
emiPayments: EmiPayment[];

@OneToMany(() => ChatMessage, (chat) => chat.user)
messages: ChatMessage[];


}
