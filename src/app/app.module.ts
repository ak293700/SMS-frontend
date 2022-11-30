import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {ButtonModule} from "primeng/button";
import {RoutingAppComponent} from './Components/routing-app/routing-app.component';
import {LoginPageComponent} from './Components/login-page/login-page.component';
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    RoutingAppComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [RoutingAppComponent]
})
export class AppModule { }
