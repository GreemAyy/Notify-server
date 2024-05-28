import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsEntity } from "./groups.entity";

export type UpdateGroupInput = {id:number, name:string, image_id:number};
export type InviteGroupInput = {group_id:number, user_id:number};
export type JoinGroupInput = {user_id:number, code: string};
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
  @Post("invite")
  async invite(@Body() body: InviteGroupInput){
    return {code: await this.groupsService.invite(body)}
  }
  @Post("join")
  async join(@Body() body: JoinGroupInput){
    const isJoin = await this.groupsService.join(body);
    console.log(isJoin);
    return {join: isJoin};
  } 
}
