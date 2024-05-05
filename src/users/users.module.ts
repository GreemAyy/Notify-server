import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccessesEntity, CodesEntity, HashesEntity, UsersEntity } from "./users.entity";
import { GroupsService } from '../groups/groups.service';
import { GroupsEntity } from 'src/groups/groups.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity, HashesEntity, CodesEntity, AccessesEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
 