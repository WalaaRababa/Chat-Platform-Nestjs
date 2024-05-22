/* eslint-disable prettier/prettier */
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from '@nestjs/common';
@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req)
    {
return this.authservice.login(req.user)
    }
}

