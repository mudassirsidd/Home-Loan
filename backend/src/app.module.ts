import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BanksModule } from './banks/banks.module';
import { User } from './users/user.entity';
import { Bank } from './banks/bank.entity';
import { LoanModule } from './Loan/loan.module';
import { Loan } from './Loan/loan.entity';
import { EmiPayment } from './emi-payment/emi-payment.entity';
import{ EmiPaymentsModule } from './emi-payment/emi-payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'tipu0786',
      database: 'crud',
      entities: [User, Bank, Loan, EmiPayment],
      synchronize: true, // turn off in production!
      
    }),

    AuthModule,
    UsersModule,
    BanksModule,
    LoanModule,
    EmiPaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
