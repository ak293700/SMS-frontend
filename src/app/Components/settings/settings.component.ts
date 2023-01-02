import {Component, OnInit} from '@angular/core';
import {AuthGuard} from "../../Guards/auth.guard";
import {Router} from "@angular/router";
import {Role} from "../../../Enums/Role";
import {HttpClientWrapperService} from "../../Services/http-client-wrapper.service";
import {UserDto} from "../../../Dtos/UserDtos/UserDto";
import {api} from "../../GlobalUsings";
import {HttpTools} from "../../../utils/HttpTools";
import {MessageService} from "primeng/api";
import {MessageServiceTools} from "../../../utils/MessageServiceTools";
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {CurrentUserService} from "../../Services/current-user.service";
import {Operation} from "../../../utils/Operation";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    '../../../styles/button.css',
    '../../../styles/main-color-background.css',
    './settings.component.css'
  ]
})
export class SettingsComponent implements OnInit
{
  users: UserDto[] = [];

  // Use to add do the diff of the user and add
  dummyUsers: any[] = [];

  possibleRoles: IdNameDto[];

  constructor(private authGuard: AuthGuard,
              private currentUser: CurrentUserService,
              private router: Router,
              private http: HttpClientWrapperService,
              private messageService: MessageService)
  {
    // this.possibleRoles = Object.keys(Role).map(key => ({id: Role[key], name: Role.toString(Role[key])}));
    this.possibleRoles = [];
    const roles = Object.keys(Role);
    const middle = Math.ceil(roles.length / 2);
    for (let i = 0; i < middle; i++)
    {
      this.possibleRoles.push({id: Number(roles[i]), name: roles[i + middle]});
    }
  }

  async ngOnInit(): Promise<void>
  {
    // We fetch the users
    if (this.isAdmin())
    {
      const response = await this.http.get(`${api}/user`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);

      this.users = response.body;
      this.initDummyStruct();
    }
  }

  async logOut()
  {
    this.authGuard.reset();
    await this.router.navigate(['/login']);
  }

  isAdmin()
  {
    return this.currentUser.roles.includes(Role.Admin);
  }

  initDummyStruct()
  {
    console.log('this.users', this.users);
    this.dummyUsers = Operation.deepCopy(this.users);
    console.log('this.dummyUsers', this.dummyUsers);
  }
}
