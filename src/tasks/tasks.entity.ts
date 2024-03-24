import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class TasksEntity{
  @PrimaryGeneratedColumn({name:'id', type:'int'})
  id:number
  @Column({name:'day_from', type:'tinyint'})
  day_from:number
  @Column({name:'month_from', type:'tinyint'})
  month_from:number
  @Column({name:'year_from', type:'smallint'})
  year_from:number
  @Column({name:'day_to', type:'tinyint'})
  day_to:number
  @Column({name:'month_to', type:'tinyint'})
  month_to:number
  @Column({name:'year_to', type:'smallint'})
  year_to:number
  @Column({name:'hour_from', type:'tinyint'})
  hour_from:string
  @Column({name:'minute_from', type:'tinyint'})
  minute_from:string
  @Column({name:'hour_to', type:'tinyint'})
  hour_to:string
  @Column({name:'minute_to', type:'tinyint'})
  minute_to:string
  @Column({name:'title', type:'varchar',length:500})
  title:string
  @Column({name:'description', type:'text'})
  description:string
  @Column({name:'creator_id', type:'int'})
  creator_id:number
  @Column({name:'group_id', type:'int', default:0})
  group_id:number|0
  @Column({name:'images_id', type:'json'})
  images_id:Array<number>
  @Column({name:"status", type:'tinyint', default:0})
  status:0|1|number
}