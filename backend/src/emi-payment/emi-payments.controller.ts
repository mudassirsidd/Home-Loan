import { Controller, Post, Body, Get, Param, Patch } from "@nestjs/common";
import { EmiPaymentsService } from "./emi-payments.service";

// src/emi-payments/emi-payments.controller.ts
@Controller('emi-payments')
export class EmiPaymentsController {

  constructor(private readonly emiService: EmiPaymentsService)
  {}

  @Post('pay')
  payEmi(@Body() body: { userId: number; loanId: number; amount: number }) {
    return this.emiService.payEmi(body.userId, body.loanId, body.amount);
  }

  @Get(':userId')
  getUserPayments(@Param('userId') userId: number) {
    return this.emiService.getUserEmiPayments(+userId);
  }

  @Get('history/:loanId')
  async getEmiHistory(@Param('loanId') loanId: number) {
    return this.emiService.getEmiHistory(loanId);
  }


}
