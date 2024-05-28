import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupAccessesStatus, GroupsEntity, InviteGroupCodesEntity } from "./groups.entity";
import { In, Repository } from "typeorm";
import { InviteGroupInput, JoinGroupInput, UpdateGroupInput } from "./groups.controller";
import { AccessesEntity } from "src/users/users.entity";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntity)
    private groupsRepository: Repository<GroupsEntity>,
    @InjectRepository(AccessesEntity)
    private accessesRepository: Repository<AccessesEntity>,
    @InjectRepository(InviteGroupCodesEntity)
    private inviteCodesRepository: Repository<InviteGroupCodesEntity>
  ) {}

  #INVITE_CODE_LENGTH = 10;

  async getUsersGroups(user_id:number){
    const usersAccesses = await this.accessesRepository.findBy({user_id});
    return await this.groupsRepository.findBy({
      id: In(usersAccesses.map(i => i.group_id))
    });
  }
  async createGroup(group: GroupsEntity){
    try {
      const create = await this.groupsRepository.insert(group);
      const id = create.raw?.['insertId']??0
      if(id>0){
        await this.accessesRepository.insert({
          user_id:group.creator_id,
          group_id:id,
          status:GroupAccessesStatus.Creator,
        });
        return { created:true, id }
      }else
        return {created:false}
    }catch (_) { return {created:false} }
  }
  async getSingle(id:number){
    return await this.groupsRepository.findOneBy({id});
  }
  async update({id, name, image_id}:UpdateGroupInput){
    this.groupsRepository.update({id},{name, image_id});
  }
  async invite({user_id, group_id}:InviteGroupInput){
    const maybeInviteCode = await this.inviteCodesRepository.findOneBy({group_id});
    if(maybeInviteCode) return maybeInviteCode.code;
    const isUserInGroup = this.accessesRepository.existsBy({group_id, user_id})
    if(isUserInGroup){
      const newCode = this.generateInviteCode(this.#INVITE_CODE_LENGTH);
      await this.inviteCodesRepository.insert({group_id, code: newCode});
      return newCode;
    }
    return String(0)
  }
  async join(body: JoinGroupInput){
    const code = body.code.split('-');
    if(code[1].length!=10||code.length!=2) return false;
    const isUserAlreadyInGroup = await this.accessesRepository.existsBy({group_id:+code[0], user_id:body.user_id})
    if(isUserAlreadyInGroup) return true;
    const isCodeCorrect = this.inviteCodesRepository.existsBy({group_id: +code[0], code:code[1]});
    if(isCodeCorrect){
      await this.accessesRepository.insert({
        user_id:body.user_id,
        group_id:+code[0],
        status:GroupAccessesStatus.Default,
      });
      return true;
    }
    return false;
  }

  private generateInviteCode(length:number){
    let total = "";
    for(let i = 0; i < length; i++){
      total+=Math.floor(Math.random()*9);
    }
    return total;
  }
}
