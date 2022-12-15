import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {IListItem} from "../editable-list/editable-list.component";

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
    {id: 3, name: 'test3'}
  ];

  items: IListItem[] = [
    {id: 1, label: 'test1'},
    {id: 2, label: 'test2', additionalFields: {test: 'voici un test'}},
  ]

  additionalFields: { label: string, type: string, default?: any }[] = [
    {label: 'test', type: 'text', default: 'default'}
  ];


  constructor(private formBuilder: FormBuilder,
              private router: Router)
  {
    this.loginForm = this.formBuilder.group({
      'login': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  logIn()
  {
    console.log(this.loginForm.value);
    this.router.navigate(['home']);
  }

  showHidePassword()
  {
    this.showPassword = !this.showPassword;
  }

}
