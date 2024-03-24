import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesEntity } from "./images.entity";

@Module({
  imports:[TypeOrmModule.forFeature([ImagesEntity])],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
