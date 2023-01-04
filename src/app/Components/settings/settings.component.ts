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
import {PatchUserDto} from "../../../Dtos/UserDtos/PatchUserDto";
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
  }

  async ngOnInit(): Promise<void>
  {
    // We fetch the users
    await this.init();
  }

  async logOut()
  {
    this.authGuard.reset();
    await this.router.navigate(['/login']);
  }

  async init()
  {
    if (this.isAdmin())
    {
      const response = await this.http.get(`${api}/user`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);
      else
      {
        this.userStruct.users = response.body;
        this.initDummyStruct();
      }
    }
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
            .map((role: Role) => { return {id: role, label: Role.toString(role)}; }),
          password: '',
        };
      });
  }

  addUser()
  {
    // -1 <=> new user
    this.userStruct.dummy.push({id: -1, email: '', roles: [], password: ''});
  }

  deleteUser(index: number)
  {
    // console.log(index);
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

    toCreate.forEach((user: RegisterUserDto) => {
      if (user.password !== '' && user.email !== '')
        return;

      this.messageService.add({
        severity: 'error',
        summary: "Impossible d'enregistrer un nouvelle utilisateur",
        detail: "Le mot de passe ou l'email est vide"
      });

      throw new Error("Impossible d'enregistrer un nouvelle utilisateur");
    });

    // remove the to create and to delete
    const toPatch = this.userStruct.dummy
      .map((dummyUser: any) => {
        if (toDelete.findIndex((id: number) => id === dummyUser.id) !== -1)
          return false;

        const user = this.userStruct.users.find((user: UserDto) => user.id === dummyUser.id);
        if (!user)
          return false;

        // we check there is a change
        const newDummy = Operation.deepCopy(dummyUser);
        newDummy.roles = newDummy.roles.map((role: IListItem) => role.id);

        const changes = CheckingTools.detectChanges(newDummy, user);
        if ('password' in changes.diffObj && (changes.diffObj.password == undefined || changes.diffObj.password === ''))
        {
          delete changes.diffObj.password;
          changes.count--;
        }

        if (changes.count === 0)
          return false;

        changes.diffObj.id = dummyUser.id;
        return changes.diffObj;
      }).filter((x: any) => x !== false);

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

  async saveUsers()
  {
    const changes = this.buildChange();
    // console.log(changes);
    await this.registerNewUser(changes.toCreate);
    await this.deleteUsersDb(changes.toDelete);
    await this.patchUsers(changes.toPatch);

    await this.init();
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
    this.userStruct.passwordStruct.visible = false;
  }

  async registerNewUser(newUsers: RegisterUserDto[])
  {
    for (const newUser of newUsers)
    {
      const response = await this.http.post(`${api}/Auth/register`, newUser);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);
      else
        this.messageService.add({severity: 'success', summary: 'Utilisateur crée', detail: newUser.email});
    }
  }

  // Delete the users in the db
  async deleteUsersDb(usersId: number[])
  {
    if (usersId.length > 0)
      this.messageService.add({
        severity: 'warn',
        summary: 'Oups',
        detail: "Il n'est pas encore possible de supprimer des utilisateurs."
      });
  }

  async patchUsers(users: PatchUserDto[])
  {
    for (const user of users)
    {
      const response = await this.http.patch(`${api}/user`, user);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);
      else
      {
        const email = user.email ?? this.userStruct.dummy.find((dummy: any) => dummy.id === user.id)!.email;
        this.messageService.add({severity: 'success', summary: 'Utilisateur mis à jour', detail: email});
      }
    }
  }
}
