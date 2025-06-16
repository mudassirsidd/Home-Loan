import{ Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmiPaymentsController } from './emi-payments.controller';
import { EmiPaymentsService } from './emi-payments.service';
import { EmiPayment } from './emi-payment.entity';
import { User } from '../users/user.entity';
import { Loan } from '../Loan/loan.entity';
// src/emi-payments/emi-payments.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([EmiPayment, User, Loan])],
    controllers: [EmiPaymentsController],
    providers: [EmiPaymentsService],
  })
  export class EmiPaymentsModule {}
  