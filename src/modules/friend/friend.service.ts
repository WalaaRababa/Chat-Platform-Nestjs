import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async sendFriendRequest(
    receiverId: number,
    requesterId: number,
  ): Promise<Friend> {
    try {
      if (requesterId == receiverId) {
        throw new HttpException(
          'You cannot send a friend request to yourself',
          HttpStatus.CONFLICT,
        );
      }
      const requester = await this.userRepository.findOneBy({
        userId: requesterId,
      });
      const receiver = await this.userRepository.findOneBy({
        userId: receiverId,
      });
      const friendShip = this.friendRepository.create({
        receiver,
        requester,
      });
      return await this.friendRepository.save(friendShip);
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
