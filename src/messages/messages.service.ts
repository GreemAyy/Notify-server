import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity } from './messages.entity';
import { Between, LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { GetAfterIdInput, GetUntilInput } from './messages.controller';
import { DeleteMessageInput } from './messages.socket';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity)
        private messagesRepository: Repository<MessagesEntity>
    ){}

    private limit = 30;

    async getSingleMessage(id:number){
        return await this.messagesRepository.findOneBy({id});
    }

    async createMessage(message: MessagesEntity){
        return (await this.messagesRepository.insert(message)).raw['insertId'] as number;
    }

    async updateMessage(message: MessagesEntity){
        try{
            await this.messagesRepository.update({id:message.id}, message);
            return true;
        }catch(_){
            return false;
        }
    }

    async getMessagesAfterId(body: GetAfterIdInput){
        const messages = await this.messagesRepository.find({
                take: this.limit,
                order:{
                    id:'DESC'
                },
                where:{
                    id:body.message_id!=0?MoreThan(body.message_id):MoreThan(0),
                    group_id:body.group_id
                }
            });
        return {messages}
    }

    async getMessagesBeforeId(body: GetAfterIdInput){
        const messages = await this.messagesRepository.find({
                take: this.limit,
                order:{
                    id:'DESC'
                },
                where:{
                    id:LessThan(body.message_id),
                    group_id:body.group_id
                }
            });
        return {
            messages:messages, 
            have_more: Boolean((await this.messagesRepository.countBy({
                group_id: body.group_id,
                id: LessThan(body.message_id)
            })) - messages.length)
        }
    }

    async getUntil(body: GetUntilInput){
        const messages = await this.messagesRepository.find({
            take: this.limit,
            order:{
                id:'DESC'
            },
            where:{
                id:Between(body.until_message_id, body.from_message_id),
                group_id:body.group_id
            }
        });
        return {messages}
    }

    async deleteMessage(body: DeleteMessageInput){
        try{
            await this.messagesRepository.delete({
                group_id:body.group_id,
                id:body.message_id
            })
            return true;
        }catch(_){
            return false;
        }
    }
}
