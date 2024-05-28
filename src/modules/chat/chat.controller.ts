/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
    constructor(private readonly messageService: MessagesService, private readonly userServicer: UserService) { }
    @UseGuards(AuthGuard('jwt'))
    @Post('send-message')
    async sendMessage(@Body('receiverId') receiverId: number, @Body('content') content: string, @Req() req) {
        const sender = await this.userServicer.findOne(req.user.userId)
        const receiver = await this.userServicer.findOne(receiverId)
        return this.messageService.createMessage(sender, receiver, content)
    }
    @Get(':id/messages')
    getAllMessageInConversation(@Param('id') conversationId:number)
    {
        return this.messageService.getAllMessagesByConversationId(conversationId)
    }
    @Get()
    getAllMessageI()
    {
        return this.messageService.getAllMessages()
    }
}
