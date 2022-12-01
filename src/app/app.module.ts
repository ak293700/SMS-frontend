import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {ButtonModule} from "primeng/button";
import {RoutingAppComponent} from './Components/routing-app/routing-app.component';
import {LoginPageComponent} from './Components/login-page/login-page.component';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './Components/home/home.component';
import {ProductFilterComponent} from './Components/product-filter/product-filter.component';
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {SliderModule} from "primeng/slider";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [
    RoutingAppComponent,
    LoginPageComponent,
    HomeComponent,
    ProductFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    FormsModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    InputNumberModule,
    CheckboxModule,
    SliderModule,
    CalendarModule
  ],
  providers: [],
  bootstrap: [RoutingAppComponent]
})
export class AppModule { }
