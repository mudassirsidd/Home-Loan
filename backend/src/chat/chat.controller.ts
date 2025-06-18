import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    const message = await this.chatService.createChat(createChatDto);
    return { success: true, message };
  }

  @Get(':userId')
  async getMessages(@Param('userId') userId: number) {
    const messages = await this.chatService.getUserMessages(userId);
    return { success: true, messages };
  }
}
