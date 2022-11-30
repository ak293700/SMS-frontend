import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent
{
  loginForm: FormGroup;
  public showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder)
  {
    this.loginForm = this.formBuilder.group({
      'login': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  logIn()
  {
    console.log(this.loginForm.value);
  }

  showHidePassword()
  {
    this.showPassword = !this.showPassword;
  }

}
