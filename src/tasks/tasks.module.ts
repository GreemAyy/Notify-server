import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskAccessesEntity, TasksEntity } from "./tasks.entity";
import { AccessesEntity, CodesEntity, HashesEntity, UsersEntity } from "../users/users.entity";
import { UsersService } from "../users/users.service";
import { TasksGetaway } from './tasks.socket';
import { ImagesService } from 'src/images/images.service';
import { ImagesEntity } from 'src/images/images.entity';

@Module({
  imports:[TypeOrmModule.forFeature([
    TasksEntity, 
    UsersEntity, 
    HashesEntity, 
    CodesEntity, 
    ImagesEntity, 
    AccessesEntity, 
    TaskAccessesEntity
  ])],
  controllers: [TasksController],
  providers: [TasksService, UsersService, ImagesService, TasksGetaway]
})
export class TasksModule {}
