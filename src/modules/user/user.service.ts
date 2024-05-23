/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log(createUserDto);
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
      const hashedPassword = await bcrypt.hash(createUserDto.email, saltOrRounds)
      const user = await this.userRepository.create({
        email: createUserDto.email.toLocaleLowerCase(),
        password: hashedPassword,
        username:createUserDto.username
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
      console.log(email);
      
      return await this.userRepository.findOneBy({ email })
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

findAll() {
  return `This action returns all user`;
}

findOne(id: number) {
  return `This action returns a #${id} user`;
}

update(id: number, updateUserDto: UpdateUserDto) {
  return `This action updates a #${id} user`;
}

remove(id: number) {
  return `This action removes a #${id} user`;
}
}
