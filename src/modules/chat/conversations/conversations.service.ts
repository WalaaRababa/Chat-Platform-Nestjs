import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}
  async getConversationOrCreateConversation(
    sender: User,
    receiver: User,
  ): Promise<Conversation> {
    try {
      let conversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoin('conversation.users', 'user1', 'user1.userId = :user1Id', {
          user1Id: sender.userId,
        })
        .innerJoin('conversation.users', 'user2', 'user2.userId = :user2Id', {
          user2Id: receiver.userId,
        })
        .getOne();
      if (!conversation) {
        conversation = this.conversationRepository.create({
          title: `${sender.username}& ${receiver.username}`,
          users: [sender, receiver],
        });
        await this.conversationRepository.save(conversation);
      }

      return conversation;
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
}
