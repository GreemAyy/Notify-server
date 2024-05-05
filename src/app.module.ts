import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { ImagesModule } from './images/images.module';
import { MessagesModule } from './messages/messages.module';
import ormconfig from "./ormconfig"; 

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig), 
    TasksModule, 
    UsersModule, 
    GroupsModule, 
    ImagesModule,
    MessagesModule
  ]
})
export class AppModule {}
