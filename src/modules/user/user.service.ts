/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { Post } from '../post/entities/post.entity';
import { Friend } from '../friend/friend.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository:Repository<Post>,
    @InjectRepository(Friend) private friendRepository:Repository<Friend>,

  ) { }
  async create(createUserDto: Partial<CreateUserDto>): Promise<User> {
    try {
      const existingEmail = await this.findByEmail(createUserDto.email)
      console.log(existingEmail);
      if (existingEmail) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          message: 'email Already Existing',
        }, HttpStatus.CONFLICT, {
        })
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds)
      const user = await this.userRepository.create({
        email: createUserDto.email.toLocaleLowerCase(),
        password: hashedPassword,
        username: createUserDto.username,
        posts: [],
        sentFriendRequests: [],
        receivedFriendRequests: [],
      })
      return await this.userRepository.save(user)
    }
    catch (error) {
      console.log(error);

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ email })
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({relations:['posts','sentFriendRequests','receivedFriendRequests']})
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user=await this.userRepository.findOne({
        where: {userId:id},
        relations: ['sentFriendRequests', 'receivedFriendRequests'],
      });
            if (user) { return user }
      throw new HttpException('no user has this id', HttpStatus.BAD_REQUEST)
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async countUser(): Promise<number> {
    try {
      const countOfUser = await this.userRepository.count()
      if (countOfUser) { return countOfUser }
      throw new HttpException('no user yet', HttpStatus.BAD_REQUEST)
    } catch (error) {
      throw error
    }
  }
}
