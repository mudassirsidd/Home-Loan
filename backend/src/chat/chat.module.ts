import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, User])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
