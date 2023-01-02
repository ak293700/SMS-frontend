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
    return this.authGuard.getJwtContent()
      .role
      .map((role: number) => Role[role]);
  }

  get user(): UserDto
  {
    const jwt_content = this.authGuard.getJwtContent();

    return {
      id: Number(jwt_content.nameidentifier),
      email: jwt_content.emailAddress as string,
      roles: this.roles as Role[],
    }
  }
}
