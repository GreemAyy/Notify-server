import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type MediaItem = {type:"photo"|"file"|"task", id:number};

@Entity('messages')
export class MessagesEntity{
    @PrimaryGeneratedColumn({name:"id", type:'int'})
    id:number
    @Column({name:"creator_id", type:"int"})
    creator_id:number
    @Column({name:"group_id", type:"int"})
    group_id:number
    @Column({name:"text", type:"text"})
    text:string
    @Column({name:"media", type:"json"})
    media:MediaItem[]
    @Column({name:"reply_to", type:"int"})
    reply_to:number
    @Column({name:"create_at", type:"varchar", length:16})
    create_at:string
}
//15:22-01/04/2024