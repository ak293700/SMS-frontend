import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {IListItem} from "../selectors/editable-list/editable-list.component";
import {AuthGuard} from "../../Guards/auth.guard";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent
{
  loginForm: FormGroup;
  public showPassword: boolean = false;

  suggestions: IdNameDto[] = [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'test3'},
    {id: 4, name: 'test4'},
    {id: 5, name: 'test5'},
    {id: 6, name: 'test6'},
    {id: 7, name: 'test7'},
  ];

  items: IListItem[] = [
    {id: 1, label: 'test1'},
    {id: 2, label: 'test2', additionalFields: {test: 'voici un test'}},
    {id: 3, label: 'test3'},
    {id: 4, label: 'test4'},
    {id: 5, label: 'test5'},
    {id: 6, label: 'test6'},
    {id: 7, label: 'test7'},
  ]

  additionalFields: { label: string, type: string, default?: any }[] = [
    {label: 'test', type: 'text', default: 'default'}
  ];


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authGuard: AuthGuard,
              private messageService: MessageService)
  {
    this.loginForm = this.formBuilder.group({
      'login': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  async logIn()
  {
    if (await (this.authGuard.init(this.loginForm.value.login, this.loginForm.value.password)))
      await this.router.navigate(['/home']);
    else
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Identifiant ou mot de passe incorrect'});
  }

  showHidePassword()
  {
    this.showPassword = !this.showPassword;
  }

}
