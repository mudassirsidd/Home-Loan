import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  message: string;

  @IsIn(['user', 'admin'])
  sender: 'user' | 'admin';
}
  