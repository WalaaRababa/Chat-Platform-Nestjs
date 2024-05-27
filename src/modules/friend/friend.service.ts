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
      // const friendShip = this.friendRepository.create({
      //   receiver: { userId: receiverId },
      //   requester: { userId: requesterId },
      // });
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
  async getMyPendingFriendRequest(requesterId: number): Promise<Friend[]> {
    try {
      const friendRequests = await this.friendRepository.find({
        where: { receiver: { userId: requesterId }, status: 'pending' },
        relations: ['requester'],
      });
      if (friendRequests) {
        return friendRequests;
      } else {
        throw new HttpException(
          'you do not have any request at this time',
          HttpStatus.BAD_REQUEST,
        );
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
  async acceptFriendRequest(id: number): Promise<any> {
    try {
      const friendRequest = await this.friendRepository.findOne({
        where: { id },
        relations: ['requester', 'receiver'],
      });
      console.log(friendRequest);
      if (friendRequest) {
        const { requester, receiver } = friendRequest;
        const senderWithFriends = await this.userRepository.findOne({
          where: { userId: requester.userId },
          relations: ['friends'],
        });
        const receiverWithFriends = await this.userRepository.findOne({
          where: { userId: receiver.userId },
          relations: ['friends'],
        });
        senderWithFriends.friends.push(receiver);
        receiverWithFriends.friends.push(requester);
        await this.userRepository.save(senderWithFriends);
        await this.userRepository.save(receiverWithFriends);
        await this.friendRepository.remove(friendRequest);
        return 'add to your friends successfully';
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
  async rejectFriendRequest(
    receiverId: number,
    requesterId: number,
  ): Promise<string> {
    try {
      const friendRequest = await this.friendRepository.findOne({
        where: {
          receiver: { userId: receiverId },
          requester: { userId: requesterId },
        },
      });
      if (friendRequest) {
        await this.friendRepository.delete(friendRequest);
        return 'rejected request successfully ';
      } else {
        throw new HttpException('no friend request', HttpStatus.BAD_REQUEST);
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
}
