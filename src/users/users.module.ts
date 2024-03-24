import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CodesEntity, HashesEntity, UsersEntity } from "./users.entity";

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity, HashesEntity, CodesEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
