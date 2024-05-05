import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { Response } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from 'path'
import * as asyncfs from 'fs/promises'

@Controller('images')
export class ImagesController {
  constructor(
    private imagesService:ImagesService
  ) {}


  @Post('/load-single')
  @UseInterceptors(FileInterceptor('file'))
  //@ts-ignore
  async loadSingle(@UploadedFile() file:Express.Multer.File, @Body() body:any){
    if(!file) return {id:null};
    const name = this.imagesService.generateName();
    const fileExpansion = file.originalname.split('.').at(-1);
    const fileName = `${name}.${fileExpansion}`;
    const pathTo = path.resolve(__dirname,'../../images',fileName);
    const addId = await this.imagesService.addImage(fileName);
    if(addId>0){
      await asyncfs.writeFile(pathTo,file.buffer);
      return {added:true, id:addId}
    }else
      return {added:false}
  }

  @Get('/:id')
  async getImage(@Param('id') id:string, @Res() res:Response){
    const imageData = await this.imagesService.getImageById(+id);
    res.sendFile(path.resolve(__dirname,'../../images/',imageData.name));
  }

  @Get('/delete/:id')
  async deleteImage(@Param('id') id:string){
    try{
      await this.imagesService.deleteImage(+id);
      return {"deleted":true};
    }catch(_){
      return {"deleted":true};
    }
  }
}
