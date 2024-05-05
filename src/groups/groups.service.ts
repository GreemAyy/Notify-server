import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupAccessesStatus, GroupsEntity } from "./groups.entity";
import { In, Repository } from "typeorm";
import { UpdateGroupInput } from "./groups.controller";
import { AccessesEntity } from "src/users/users.entity";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntity)
    private groupsRepository: Repository<GroupsEntity>,
    @InjectRepository(AccessesEntity)
    private accessesRepository: Repository<AccessesEntity>
  ) {}

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
}
