import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksEntity } from "./tasks.entity";
import { UsersService } from "../users/users.service";
import { ImagesService } from "src/images/images.service";

export type CreateTaskInput = {task:TasksEntity, user_id:number, hash:string};
export type GetUsersLocalTasksInput = {
  user_id:number,
  date:number[],
};
export type GetGroupTasksInput = {
  group_id:number,
  date:number[]
}
export type DeleteInput = {id:number};
export type ChangeStatusInput = {id:number, status:number};
export type SearchInput = {text:string, id:number, groupId:number}
export type DeleteImagesInput = {id:number, images:number[]};
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private imagesService: ImagesService
  ){}

  @Post('create')
  async createTask(@Body() {task, user_id, hash}:CreateTaskInput){
    const haveAccess = this.usersService.checkAccess({id:user_id,hash});
    if(haveAccess){
      return {
        id: await this.tasksService.createTask(task),
        created: true
      };
    }else{
      return {"created": false}
    }
  }

  @Post('get-users-local-tasks')
  async getUsersLocalTasks(@Body() body:GetUsersLocalTasksInput){
      return await this.tasksService.getUserTasks(body);
  }

  @Post('get-group-tasks')
  async getGroupTasks(@Body() body: GetGroupTasksInput){
    return await this.tasksService.getGroupTasks(body)
  }

  @Post('delete')
  async deleteTask(@Body() body:DeleteInput){
    return {'deleted': await this.tasksService.deleteTask(body)}
  }

  @Post('change-status')
  async changeStatus(@Body() body:ChangeStatusInput){
    return {'changed':await this.tasksService.changeStatus(body)}
  }

  @Post('update')
  async updateTask(@Body() body: TasksEntity){
    return {'updated':await this.tasksService.updateTask(body)}
  }

  @Post('search')
  async searchTasks(@Body() body:SearchInput){
    return await this.tasksService.searchTasks(body)
  }

  @Get('single/:id')
  async getSingleTask(@Param('id') id:string){
    return {"task":(await this.tasksService.getSingle(+id))??null}
  }

  @Get('get-group-all/:id')
  async getGroupsAll(@Param('id') id:string){
    return await this.tasksService.getGroupsAll(+id);
  }

  @Post('/delete-images')
  async deleteImages(@Body() body: DeleteImagesInput){
    try{
      return {"deleted":await this.tasksService.deleteImages(body)};
    }catch(_){
      return {"deleted":false}
    }
  }
}
