/* eslint-disable prettier/prettier */
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class AuthService {
    constructor(private userService: UserService,private jwtService:JwtService) { }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                console.log(result);
                return result;
            }
            throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED)
        }
        throw new HttpException('NOT FOUND', HttpStatus.UNAUTHORIZED)
    }
login(user:any)
{
const payload={user:user.email,sub:user.id};
return {
    access_token: this.jwtService.sign(payload),
  };
}
}




