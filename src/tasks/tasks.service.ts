import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TasksEntity } from "./tasks.entity";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import type { ChangeStatusInput, DeleteImagesInput, DeleteInput, GetGroupTasksInput, GetUsersLocalTasksInput, SearchInput } from './tasks.controller';
import { ImagesEntity } from 'src/images/images.entity';
import * as path from 'path'
import * as asyncfs from 'fs/promises'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private tasksRepository: Repository<TasksEntity>,
    @InjectRepository(ImagesEntity)
    private imagesRepository: Repository<ImagesEntity>
  ){}

  async createTask(task: TasksEntity):Promise<number>{
    const add = await this.tasksRepository.insert(task);
    return add.raw?.['insertId']??0;
  }

  async getUserTasks({user_id, date}:GetUsersLocalTasksInput){
    const find = await this.tasksRepository.findBy({
      creator_id:user_id,
      group_id:0,
      day_from:  LessThanOrEqual(date[0]), 
      month_from:LessThanOrEqual(date[1]),
      year_from: LessThanOrEqual(date[2]),
      day_to:  MoreThanOrEqual(date[0]),
      month_to:MoreThanOrEqual(date[1]),
      year_to: MoreThanOrEqual(date[2])
    })
    return find;
  }

  async getGroupTasks({group_id, date}:GetGroupTasksInput){
    const find = await this.tasksRepository.findBy({
      group_id,
      day_from:  LessThanOrEqual(date[0]), 
      month_from:LessThanOrEqual(date[1]),
      year_from: LessThanOrEqual(date[2]),
      day_to:  MoreThanOrEqual(date[0]),
      month_to:MoreThanOrEqual(date[1]),
      year_to: MoreThanOrEqual(date[2]) 
    })
    return find;
  }

  async deleteTask({id}:DeleteInput){
    try{
      const task = await this.tasksRepository.findOneBy({id});
      if(task.images_id[0]!=0)
        await this.deleteImages({id, images: task.images_id})
      await this.tasksRepository.delete({id});
      return true
    }catch(_){
      return false;
    }
  }

  async changeStatus({id, status}:ChangeStatusInput){
    try{
      await this.tasksRepository.update({id},{status});
      return true
    }catch(_){
      return false
    }
  }

  async updateTask(task: TasksEntity){
    try{
      await this.tasksRepository.update({id:task.id}, task);
      return true
    }catch(_){
      return false
    }
  }

  async searchTasks({text, id, groupId}:SearchInput){
    console.log(text," ",id," ",groupId)
    if(text.length==0)
      return []
      let data = await this.tasksRepository.createQueryBuilder("tasks")
      .where(`tasks.title LIKE :text OR tasks.description LIKE :text and "tasks.group_id = :groupId" and ${groupId != 0 ? "tasks.creator_id > 0" : "tasks.creator_id = :id"}`, { text: `%${text}%`,groupId: groupId, id: id })
      .getMany();  
    console.log(data);
    return data
  }

  async getGroupsAll(id:number){
    return await this.tasksRepository.findBy({group_id:id});
  }

  async getSingle(id:number){
    return await this.tasksRepository.findOneBy({id});
  }

  async deleteImages(body: DeleteImagesInput){
    const task = await this.tasksRepository.findOneBy({id:body.id});
    task.images_id = task.images_id.filter(image => !(body.images.includes(image)));
    if(task.images_id.length==0)
      task.images_id=[0];
    await this.tasksRepository.update({id:body.id},{images_id:task.images_id});
    for(let image of body.images){
      const findImage = await this.imagesRepository.findOneBy({id:image});
      const pathTo = path.resolve(__dirname,'../../images', findImage.name);
      await asyncfs.rm(pathTo);
      await this.imagesRepository.delete({id:image})
    }
    return true;
  }
}
