import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity } from "./images.entity";
import { Repository } from "typeorm";
import * as path from 'path'
import * as asyncfs from 'fs/promises'

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImagesEntity)
    private imagesRepository:Repository<ImagesEntity>
  ) {}

  async addImage(name:string){
    let id = 0;
    try {
      id = (await this.imagesRepository.insert({name})).raw['insertId'];
    }catch (_){}
    return id
  }

  async getImageById(id:number){
    return await this.imagesRepository.findOneBy({id});
  }

  async deleteImage(id:number){
    const findImage = await this.imagesRepository.findOneBy({id});
    const pathTo = path.resolve(__dirname,'../../images', findImage.name);
    await asyncfs.rm(pathTo);
    await this.imagesRepository.delete({id})
  }

  generateName(){
    let name = "";
    for(let i = 0;i < 15;i++){
      name+=Math.round(Math.random()*10).toString();
    }
    return name;
  }
}
