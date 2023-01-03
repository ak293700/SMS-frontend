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
import {IListItem} from "../selectors/editable-list/editable-list.component";
import {CheckingTools} from "../../../utils/CheckingTools";
import {Operation} from "../../../utils/Operation";
import {PatchUserDto} from "../../../Dtos/UserDtos/PatchUserDto";

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
  // Use to add do the diff of the user and add

  userStruct: {
    currentUser: UserDto, users: UserDto[],
    dummy: { id: number, email: string, roles: IListItem[], password: string }[],
    passwordStruct: { visible: boolean }, selectedUserIndex: number
  } =
    {
      currentUser: {id: 0, email: '', roles: []},
      users: [],
      dummy: [],
      selectedUserIndex: 0,
      passwordStruct: {visible: false}
    }

  possibleRoles: IdNameDto[];

  constructor(private authGuard: AuthGuard,
              private currentUserService: CurrentUserService,
              private router: Router,
              private http: HttpClientWrapperService,
              private messageService: MessageService)
  {
    this.possibleRoles = Role.getValues();
    this.userStruct.currentUser = this.currentUserService.user;

    console.log(this.userStruct.currentUser);
    CheckingTools.f();
  }

  async ngOnInit(): Promise<void>
  {
    // We fetch the users
    if (this.isAdmin())
    {
      const response = await this.http.get(`${api}/user`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);

      this.userStruct.users = response.body;
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
    this.userStruct.dummy = this.userStruct.users
      .map((user: UserDto) => {
        return {
          id: user.id,
          email: user.email,
          roles: user.roles
            .map((role: Role) => {return {id: Number(Role[role]), label: role.toString()};}),
          password: '',
        };
      });

    console.log('dummy');
    console.log(this.userStruct.dummy);
  }

  addUser()
  {
    // -1 <=> new user
    this.userStruct.dummy.push({id: -1, email: '', roles: [], password: ''});
  }

  deleteUser(index: number)
  {
    console.log(index);
    this.userStruct.dummy.splice(index, 1);
  }

  buildChange(): { toCreate: RegisterUserDto[], toDelete: number[], toPatch: PatchUserDto[] }
  {
    // Filter the original with only the user still present
    const toDelete = this.userStruct.users
      .filter((user: UserDto) =>
        !this.userStruct.dummy.find((dummyUser: any) => user.id === dummyUser.id)
      ).map((user: UserDto) => user.id);

    const toCreate = this.userStruct.dummy
      .filter((dummyUser: any) =>
        !this.userStruct.users.find((user: UserDto) => user.id === dummyUser.id)
      ).map((dummyUser: any) => {
        return {
          email: dummyUser.email, password: dummyUser.password,
          roles: dummyUser.roles.map((role: IdNameDto) => role.id)
        };
      });

    // remove the to create and to delete
    const toPatch = this.userStruct.dummy.filter((dummyUser: any) => {
      if (toDelete.findIndex((id: number) => id === dummyUser.id) !== -1)
        return false;

      const user = this.userStruct.users.find((user: UserDto) => user.id === dummyUser.id);
      if (!user)
        return false;
      // we check there is a change
      if (user.email === dummyUser.email && Operation.detectChanges(user.roles, dummyUser.roles).count === 0
        && dummyUser.password === '')
        return false;

      return true;
    }).map((dummyUser: any) => { // We convert to patch
      return {
        id: dummyUser.id,
        email: dummyUser.email,
        roles: dummyUser.roles.map((role: IdNameDto) => role.id),
        password: dummyUser.password
      }
    });

    return {
      toCreate,
      toDelete,
      toPatch
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

  editPassword(index: number)
  {
    this.userStruct.passwordStruct.visible = true;
    this.userStruct.selectedUserIndex = index;
  }

  validPassword()
  {
    const password = this.userStruct.dummy[this.userStruct.selectedUserIndex].password;
    if (!CheckingTools.IsPasswordValid(password))
    {
      this.messageService.add({
        severity: 'error', summary: 'Mot de passe invalide',
        detail: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, ' +
          'un chiffre, un caractère spécial ainsi qu\'aucun espace.'
      });
      return;
    }

    this.userStruct.passwordStruct.visible = false;
  }

  cancelPassword()
  {
    this.userStruct.dummy[this.userStruct.selectedUserIndex].password = '';
  }
}
