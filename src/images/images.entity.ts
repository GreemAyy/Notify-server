import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class ImagesEntity{
  @PrimaryGeneratedColumn({name:'id', type:'int'})
  id:number
  @Column({name:"name",type:"varchar",length:50})
  name:string
}