import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CodesEntity, HashesEntity, UsersEntity } from "./users.entity";
import { Repository } from "typeorm";
import { sendMail } from "../email/sendMail";
import type { LogInput, AuthInput, CheckInput } from "./users.controller";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository:Repository<UsersEntity>,
    @InjectRepository(HashesEntity)
    private hashesRepository:Repository<HashesEntity>,
    @InjectRepository(CodesEntity)
    private codesRepository:Repository<CodesEntity>
  ) {}

  async log({email, code, password}:LogInput){
    const checkCode = await this.codesRepository.findOneBy({email});
    let access = false;
    if(checkCode && checkCode.code == code){
      const isCreated = await this.checkUserAlreadyCreated(email);
      if(!isCreated){
        const create = await this.create({email, password});
        console.log(create)
      }
      const hash = this.generateHash(24);
      const user = await this.usersRepository.findOneBy({email})
      await this.setHash(user.id, hash);
      access = true;
      return { access, id:user.id, hash }
    }else
     return {access};
  }
  async auth({email, password}: AuthInput){
    const isCreated = await this.checkUserAlreadyCreated(email);
    let auth = true;
    console.log(isCreated)
    if(isCreated){
      const currentUser = await this.usersRepository.findOneBy({email})
      if(currentUser.password != password)
        auth = false;
    }
    if(auth){
      const code = this.generateAuthCode(4);
      const isCodeInclude = !!((await this.codesRepository.findBy({email:email})).length);
      if(isCodeInclude)
        await this.codesRepository.update({email},{code})
      else
        await this.codesRepository.insert({email, code})
      const sendMail = await this.sendAuthMail(email, code);
      if(!sendMail)
        auth = false;
    }
    return {auth}
  }

  async checkAccess({id,hash}:CheckInput){
    let access = false;
    let usersHash = await this.hashesRepository.findOneBy({id});
    if(usersHash != null && usersHash.hash == hash)
      access = true;
    return {access};
  }
  private async setHash(id:number, _hash:string){
    const hash = await this.hashesRepository.findOneBy({user_id:id})
    if(hash)
      await this.hashesRepository.update({user_id:id},{hash:_hash})
    else
      await this.hashesRepository.insert({hash:_hash,user_id:id})
  }

  private async sendAuthMail(email:string,code:string){
     return await sendMail({
       from:'z4032@yandex.ru',
       to:email,
       subject:"Notify auth code.",
       text:`Your Notify auth code: ${code}`})
  }

  private generateHash(length:number){
    let hash = '';
    const symbols:string = '1234567890qwertyuiopasdfghjklzxcvbnm';
    for(let i = 0;i< length;i++){
      hash+=symbols[Math.floor(Math.random()*symbols.length)]
    }
    return hash
  }

  private generateAuthCode(length:number){
    let code = '';
    for (let i = 0; i < length; i++){
      code+=Math.round(Math.random()*10).toString();
    }
    return code;
  }

  private async create({email, password}: AuthInput){
    const isCreated = await this.checkUserAlreadyCreated(email);
    if(!isCreated){
      await this.usersRepository.insert({ email, password, name:'-' });
      return true
    }
    return false;
  }

  private async checkUserAlreadyCreated(email:string) : Promise<boolean> {
    return Boolean((await this.usersRepository.findBy({ email })).length);
  }
}
