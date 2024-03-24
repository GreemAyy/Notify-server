import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsEntity } from "./groups.entity";

export type UpdateGroupInput = {id:number, name:string, image_id:number};
@Controller('groups')
export class GroupsController {
  constructor(
    private groupsService: GroupsService
  ) {}
  @Post('/create')
  async createGroup(@Body() body: GroupsEntity){
    return await this.groupsService.createGroup(body);
  }

  @Get('/users/:id')
  async  getUsers(@Param('id') id:string){
    return await this.groupsService.getUsersGroups(+id);
  }

  @Get('single/:id')
  async getSingle(@Param('id') id:string){
    return await this.groupsService.getUsersGroups(+id);
  }

  @Post('update')
  async update(@Body() body: UpdateGroupInput){
    try{
      await this.groupsService.update(body);
      return {'updated':true};
    }catch(_){
      return {'updated': false};
    }
  }
}
