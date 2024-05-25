import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password is too short. It should be at least 8 characters long.',
  })
  password: string;
  @IsNotEmpty()
  @IsString()
  username: string;
}
