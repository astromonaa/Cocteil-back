import { IUser } from "../types/types";

export interface IUserDto {
  id:number;
  role:string;
  email:string;
  isActivated:boolean
}


export class UserDto implements IUserDto {
  id:number;
  role:string;
  email:string;
  isActivated:boolean

  constructor(data:IUser){
    this.id = data.id
    this.role = data.role
    this.email = data.email
    this.isActivated = data.isActivated
  }
}