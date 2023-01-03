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
import {RegisterUserDto} from "../../../Dtos/UserDtos/RegisterUserDto";

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
  currentUser: UserDto;

  users: UserDto[] = [];

  // Use to add do the diff of the user and add
  dummyUsers: any[] = [];

  possibleRoles: IdNameDto[];

  constructor(private authGuard: AuthGuard,
              private currentUserService: CurrentUserService,
              private router: Router,
              private http: HttpClientWrapperService,
              private messageService: MessageService)
  {
    this.possibleRoles = [];
    const roles = Object.keys(Role);
    const middle = Math.ceil(roles.length / 2);
    for (let i = 0; i < middle; i++)
      this.possibleRoles.push({id: Number(roles[i]), name: roles[i + middle]});

    this.currentUser = this.currentUserService.user;

    console.log(this.currentUser);
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
    return this.currentUserService.roles.includes(Role.Admin);
  }

  initDummyStruct()
  {
    this.dummyUsers = this.users
      .map((user: UserDto) => {
        return {
          id: user.id,
          email: user.email,
          roles: user.roles
            .map((role: Role) => {return {id: Role[role], label: role};})
        };
      });

    console.log(this.dummyUsers);
  }

  addUser()
  {
    // -1 <=> new user
    this.dummyUsers.push({id: -1, label: '', roles: []})
  }

  deleteUser(index: number)
  {
    console.log(index);
    this.dummyUsers.splice(index, 1);
  }

  buildChange(): { toCreate: RegisterUserDto[], toDelete: number[], toPatch: UserDto[] }
  {
    // Filter the original with only the user still present
    const toDelete = this.users
      .filter((user: UserDto) =>
        !this.dummyUsers.find((dummyUser: any) => user.id === dummyUser.id)
      ).map((user: UserDto) => user.id);

    const toCreate = this.dummyUsers
      .filter((dummyUser: any) =>
        !this.users.find((user: UserDto) => user.id === dummyUser.id)
      ).map((dummyUser: any) => {
        return {email: dummyUser.email, roles: dummyUser.roles.map((role: IdNameDto) => role.id)}
      });

    return {
      toCreate,
      toDelete,
      toPatch: []
    }
  }

  resetUsers()
  {
    this.initDummyStruct();
  }

  saveUsers()
  {
    const changes = this.buildChange();
    console.log(changes);
  }
}
