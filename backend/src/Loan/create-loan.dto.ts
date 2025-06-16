import { IsString, IsNumber, IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  bank_name: string;

  @IsNumber()
  loanAmount: number;

  @IsString()
  loanPurpose: string;

  @IsNumber()
  income: number;

  @IsString()
  employmentStatus: string;

  @IsNumber()
  duration: number;


  @IsOptional()
  @IsIn([0, 1, 2])
  status?: number;

  @IsNotEmpty()
  @IsString()
  name: string; // New field for name

  @IsNotEmpty()
  date: Date; // New field for date

  @IsNotEmpty()
  @IsString()
  intrestRate: string; // New field for interest rate
  
}


  