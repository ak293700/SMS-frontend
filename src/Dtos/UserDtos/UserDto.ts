import {Role} from "../../Enums/Role";

export interface UserDto
{
  id: number;
  email: string;
  roles: Role[];
}
