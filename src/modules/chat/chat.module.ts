import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { MessagesService } from './messages/messages.service';
import { ConversationsService } from './conversations/conversations.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), UserModule],
  providers: [MessagesService, ConversationsService],
  exports: [MessagesService, ConversationsService],
  controllers: [ChatController],
})
export class ChatModule {}
