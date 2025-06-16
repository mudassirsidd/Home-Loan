import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { CreateLoanDto } from './create-loan.dto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async applyLoan(@Req() req: Request, @Body() data: CreateLoanDto) {
    const jwtUser = req.user as any;
    const user = new User();
    user.id = jwtUser.id;
    user.email = jwtUser.email;
    user.role = jwtUser.role;

    console.log('Data received for loan application:', data);
    console.log('User object for loan:', user);
    return this.loanService.applyLoan(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLoan(@Req() req: Request) {
    const user = req.user as User;
    return this.loanService.getLoanByUser(user.id);
  }

  // Admin-only: Get all loans
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllLoans(@Req() req: Request) {
    const user = req.user as User;

    if (user.role !== 'admin') {
      return { message: 'Access denied' };
    }

    return this.loanService.getAllLoans();
  }

  // Admin-only: Update loan status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateLoanStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('status') status: number,
  ) {
    const user = req.user as User;

    if (user.role !== 'admin') {
      return { message: 'Access denied' };
    }

    return this.loanService.updateLoanStatus(+id, status);
  }
}
