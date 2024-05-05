import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesEntity } from './messages.entity';
import { MessagesService } from './messages.service';
import { DeleteMessageInput } from './messages.socket';
import { ImagesService } from 'src/images/images.service';

export type GetAfterIdInput = {group_id:number, message_id:number};
export type GetUntilInput = {group_id:number, from_message_id:number, until_message_id: number};

@Controller('messages')
export class MessagesController {
    constructor(
        private messagesService: MessagesService,
        private imagesService: ImagesService
    ){}
    
    @Post('create')
    async createMessage(@Body() message: MessagesEntity){
        console.log(message);
        return {"id":(await this.messagesService.createMessage(message))??0};
    }

    @Post('update')
    async updateMessage(@Body() message: MessagesEntity){
        console.log(message);
        return {"updated":await this.messagesService.updateMessage(message)};
    }

    @Get('single/:id')
    async getSingle(@Param('id') id: string){
        return {"message":(await this.messagesService.getSingleMessage(+id))??null};
    }

    @Post('get-after-id')
    async getMessagesAfterId(@Body() body: GetAfterIdInput){
        return await this.messagesService.getMessagesAfterId(body)
    }

    @Post('get-before-id')
    async getMessagesBeforeId(@Body() body: GetAfterIdInput){
        return await this.messagesService.getMessagesBeforeId(body)
    }

    @Post('delete')
    async deleteMessage(@Body() body: DeleteMessageInput){
        const message = await this.messagesService.getSingleMessage(body.message_id);
        for(const media of message.media){
            if(media.type=='photo'){
                await this.imagesService.deleteImage(media.id)
            }
        }
        return {"deleted":await this.messagesService.deleteMessage(body)}
    }

    @Post('get-until')
    async getUntil(@Body() body:GetUntilInput){
        return await this.messagesService.getUntil(body);
    }
}
 