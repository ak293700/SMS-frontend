import {Role} from "../../Enums/Role";

export interface RegisterUserDto
{
  email: string;
  roles: Role[];
}
