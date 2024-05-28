import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { ConversationsService } from '../conversations/conversations.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private conversationService: ConversationsService,
  ) {}
  async createMessage(
    sender: User,
    receiver: User,
    content: string,
  ): Promise<Message> {
    try {
      const conversation =
        await this.conversationService.getConversationOrCreateConversation(
          sender,
          receiver,
        );
      const message = await this.messageRepository.create({
        content,
        user: sender,
        conversation,
      });
      return await this.messageRepository.save(message);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllMessagesByConversationId(
    conversationId: number,
  ): Promise<Message[]> {
    try {
      // const allMessages = await this.messageRepository.find({
      //   where: { conversation: { id: conversationId } },
      //   order: { timestamp: 'DESC' },
      // });
      const allMessages = await this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.conversation', 'conversation')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversationId = :conversationId', { conversationId })
        .orderBy('message.timestamp', 'DESC')
        .getMany();
      if (!allMessages) {
        throw new HttpException(
          {
            message: 'no messages in this conversation',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return allMessages;
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllMessages(): Promise<any> {
    try {
      const messages = this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .getMany();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }
}
