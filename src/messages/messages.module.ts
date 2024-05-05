import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './messages.entity';
import { MessageGetaway } from './messages.socket';
import { ImagesEntity } from 'src/images/images.entity';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports:[TypeOrmModule.forFeature([MessagesEntity, ImagesEntity])],
  controllers: [MessagesController],
  providers: [MessagesService,ImagesService,MessageGetaway]
})
export class MessagesModule {}
