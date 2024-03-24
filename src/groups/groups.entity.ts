import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum GroupAccessesStatus {
  Default,
  Creator
}

@Entity('groups')
export class GroupsEntity{
  @PrimaryGeneratedColumn({name:'id', type:'int'})
  id:number
  @Column({name: "name",type:"varchar",length:100})
  name:string
  @Column({name:'creator_id', type:'int'})
  creator_id:number
  @Column({name:"image_id", type:"int",default:0})
  image_id:number
}

@Entity('accesses')
export class AccessesEntity{
  @PrimaryGeneratedColumn({name:'id', type:'int'})
  id:number
  @Column({name:'user_id', type:'int'})
  user_id:number
  @Column({name:'group_id', type:'int'})
  group_id:number
  @Column({name:'status', type:'int', default:0})
  status:number
}