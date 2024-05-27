import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('/send')
  create(@Body('receiverId') receiverId: number, @Req() req) {
    return this.friendService.sendFriendRequest(receiverId, req.user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('my-pending')
  getMyPendingRequest(@Req() req) {
    return this.friendService.getMyPendingFriendRequest(req.user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  acceptFriendRequest(@Param('id') id: number) {
    return this.friendService.acceptFriendRequest(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/reject')
  rejectFriendRequest(@Body('receiverId') receiverId: number, @Req() req) {
    return this.friendService.rejectFriendRequest(receiverId, req.user.userId);
  }
}
