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
