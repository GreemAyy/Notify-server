import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { ImagesModule } from './images/images.module';
import ormconfig from "./ormconfig";

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TasksModule, UsersModule, GroupsModule, ImagesModule]
})
export class AppModule {}
