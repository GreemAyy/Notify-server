import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('codes')
export class CodesEntity{
  @PrimaryGeneratedColumn({name:"id",type:'int'})
  id:number
  @Column({name:'email', type:'varchar',length:150})
  email:string
  @Column({name:'code', type:'varchar',length:4})
  code:string
}

@Entity('users')
export class UsersEntity{
  @PrimaryGeneratedColumn({name:"id",type:'int'})
  id:number
  @Column({name:'name', type:'varchar', length:100, default:'-'})
  name:string
  @Column({name:'email', type:'varchar',length:150})
  email:string
  @Column({name:'password', type:'varchar',length:50})
  password:string
}

@Entity('hashes')
export class HashesEntity{
  @PrimaryGeneratedColumn({name:'id',type:'int'})
  id:number
  @Column({name:"user_id", type:'int'})
  user_id:number
  @Column({name:"hash", type:'varchar',length:24})
  hash:string
}