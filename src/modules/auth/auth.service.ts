/* eslint-disable prettier/prettier */
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(private userService: UserService,private jwtService:JwtService) { }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)     
        console.log(user);
        if (user) {
            const passwordMatch = await bcrypt.compare(password,user.password)
            console.log(passwordMatch);
            if (passwordMatch) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                console.log(result);
                return result;
            }
        }
            
            return null

        }
    
login(user:any)
{
const payload={user:user.email,sub:user.userId};
return {
    access_token: this.jwtService.sign(payload),
  };
}
}




