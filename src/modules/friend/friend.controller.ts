import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body('receiverId') receiverId: number, @Req() req) {
    return this.friendService.sendFriendRequest(receiverId, req.user.userId);
  }
}
