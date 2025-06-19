import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from '../users/user.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, User])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
