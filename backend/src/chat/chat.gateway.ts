// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.chatService.createChat(data);

    // Emit to all clients (you can emit to specific user also)
    this.server.emit(`receive_message_${data.userId}`, savedMessage);
  }
}
