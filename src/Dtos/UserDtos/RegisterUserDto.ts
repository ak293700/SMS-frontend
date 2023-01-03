import {Role} from "../../Enums/Role";

export interface RegisterUserDto
{
  email: string;
  password: string;
  roles: Role[];
}
