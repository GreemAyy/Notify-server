import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsEntity, InviteGroupCodesEntity } from "./groups.entity";
import { AccessesEntity, UsersEntity } from 'src/users/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GroupsEntity, AccessesEntity, InviteGroupCodesEntity])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
