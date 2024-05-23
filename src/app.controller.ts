/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, HttpStatus, Post, UseGuards ,Request} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './modules/user/dto/create-user.dto';
import { AuthService } from './modules/auth/auth.service';
import { UserService } from './modules/user/user.service';
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,   private readonly userService: UserService,
    private readonly authservice: AuthService,) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return await this.authservice.login({
        email: createUserDto.email,
        password: createUserDto.password,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log(req.user);
    
    return this.authservice.login(req.user);
  }
}
