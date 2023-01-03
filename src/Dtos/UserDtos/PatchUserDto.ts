import {Role} from "../../Enums/Role";

export interface PatchUserDto
{
  id: number;
  email?: string;
  roles?: Role[];
  password?: string;
}
