import { IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;
  img?: string;
  // @IsNotEmpty()
  // user: User;
}
