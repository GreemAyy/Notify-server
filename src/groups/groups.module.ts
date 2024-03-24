import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccessesEntity, GroupsEntity } from "./groups.entity";

@Module({
  imports:[TypeOrmModule.forFeature([GroupsEntity, AccessesEntity])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
