import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent
{
  loginForm: FormGroup;
  public showPassword: boolean = false;

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
