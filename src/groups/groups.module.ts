import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsEntity } from "./groups.entity";
import { AccessesEntity, UsersEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[TypeOrmModule.forFeature([GroupsEntity, AccessesEntity])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
