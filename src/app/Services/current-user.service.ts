import {Injectable} from '@angular/core';
import {AuthGuard} from "../Guards/auth.guard";
import {Role} from "../../Enums/Role";
import {UserDto} from "../../Dtos/UserDtos/UserDto";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService
{
  constructor(private authGuard: AuthGuard)
  {}

  get roles(): Role[]
  {
    let roles: string[] | string | undefined = this.authGuard.getJwtContent().role;
    if (roles === undefined)
      return [];
    if (typeof roles === 'string')
      roles = [roles];

    return roles.map((role: string) => Role.fromString(role));
  }

  get user(): UserDto
  {
    const jwt_content = this.authGuard.getJwtContent();

    return {
      id: Number(jwt_content.nameidentifier),
      email: jwt_content.emailaddress as string,
      roles: this.roles as Role[],
    }
  }
}
