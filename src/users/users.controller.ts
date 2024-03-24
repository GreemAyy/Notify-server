import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

export type AuthInput = { email:string, password:string }
export type LogInput = AuthInput & { code:string };
export type CheckInput = {id:number, hash:string};
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}
  @Post('/auth') 
  async create(@Body() body:AuthInput){
    try {
      return await this.usersService.auth(body);
    }catch (_){
      return {auth:false}
    }
  }
  @Post('/log')
  async log(@Body() body:LogInput){
    try {
      return await this.usersService.log(body);
    }catch (_){
      return {"access":false};
    }
  }

  @Post('/check')
  async check(@Body() body:CheckInput){
  
    try {
      return await this.usersService.checkAccess(body);
    }catch (_){
      return {"access":false};
    }
  }
}
