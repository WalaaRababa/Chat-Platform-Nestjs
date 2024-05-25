import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(
    createPostDto: Partial<CreatePostDto>,
    userId: number,
  ): Promise<Post> {
    try {
      const publisherPost = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['posts'],
      });

      console.log(publisherPost);

      const post = this.postRepository.create({
        content: createPostDto.content,
        img: createPostDto.img,
        user: { id: userId },
      });
      // publisherPost.posts.push(post);
      // await this.userRepository.save(publisherPost);
      return this.postRepository.save(post);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Error While Saving Post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
