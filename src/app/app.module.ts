import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {ButtonModule} from "primeng/button";
import {RoutingAppComponent} from './Components/routing-app/routing-app.component';
import {LoginPageComponent} from './Components/login-page/login-page.component';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './Components/home/home.component';
import {ProductFilterComponent} from './Components/product/product-filter/product-filter.component';
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {SliderModule} from "primeng/slider";
import {CalendarModule} from "primeng/calendar";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";
import {HttpClientModule} from "@angular/common/http";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ContextMenuModule} from "primeng/contextmenu";
import {ToastModule} from "primeng/toast";
import {PrettierPipe} from './Pipes/prettier.pipe';
import {
  EditMultipleProductsComponent
} from './Components/product/edit-multiple-products/edit-multiple-products.component';
import {EditOneProductComponent} from './Components/product/edit-one/edit-one-product.component';
import {RouteReuseStrategy} from "@angular/router";
import {CustomRouteReuseStrategy} from "../utils/CustomRouteReuseStrategy";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@NgModule({
  declarations: [
    RoutingAppComponent,
    LoginPageComponent,
    HomeComponent,
    ProductFilterComponent,
    PrettierPipe,
    EditMultipleProductsComponent,
    EditOneProductComponent
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
    CalendarModule,
    TriStateCheckboxModule,
    HttpClientModule,
    AutoCompleteModule,
    ContextMenuModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [RoutingAppComponent]
})
export class AppModule {}
