import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { CreateChatDto } from './create-chat.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepo: Repository<ChatMessage>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createChat(dto: CreateChatDto): Promise<ChatMessage> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const status = dto.sender === 'admin' ? 2 : 1;

    const chat = this.chatRepo.create({
      user,
      message: dto.message,
      status,
    });

    return this.chatRepo.save(chat);
  }

  async getUserMessages(userId: number): Promise<ChatMessage[]> {
    return this.chatRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
  }
}
