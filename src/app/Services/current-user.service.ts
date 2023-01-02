import {Injectable} from '@angular/core';
import {AuthGuard} from "../Guards/auth.guard";
import {Role} from "../../Enums/Role";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService
{
  constructor(private authGuard: AuthGuard)
  {}

  get roles(): Role[]
  {
    const jwt_content = this.authGuard.getJwtContent();
    if (jwt_content === undefined)
      throw new Error('The jwt content is undefined');
    console.log(jwt_content);

    return jwt_content.role.map((role: number) => Role[role]);
  }


}
