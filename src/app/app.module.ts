import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {ButtonModule} from "primeng/button";
import {RoutingAppComponent} from './Components/routing-app/routing-app.component';
import {LoginPageComponent} from './Components/login-page/login-page.component';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {EditOneProductComponent} from './Components/product/edit-one-product/edit-one-product.component';
import {RouteReuseStrategy} from "@angular/router";
import {CustomRouteReuseStrategy} from "../utils/CustomRouteReuseStrategy";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {FilterFieldsComponent} from './Components/filter/filter-fields/filter-fields.component';
import {FilterTableComponent} from './Components/filter/filter-table/filter-table.component';
import {DiscountFilterComponent} from './Components/discount/discount-filter/discount-filter.component';
import {EditOneDiscountComponent} from './Components/discount/edit-one-discount/edit-one-discount.component';
import {EditOneBaseComponent} from './Components/edit-one-base/edit-one-base.component';
import {DialogModule} from "primeng/dialog";
import {EditableListComponent} from './Components/editable-list/editable-list.component';
import {ReferralComponent} from './Components/referral/referral.component';
import {CreateBundleComponent} from './Components/product/create-product/create-bundle/create-bundle.component';
import {StepsModule} from "primeng/steps";
import {
  ChooseBundleComposantComponent
} from './Components/product/create-product/create-bundle/choose-bundle-composant/choose-bundle-composant.component';
import {
  CreateBundleOtherFieldsComponent
} from './Components/product/create-product/create-bundle/create-bundle-other-fields/create-bundle-other-fields.component';

@NgModule({
  declarations: [
    RoutingAppComponent,
    LoginPageComponent,
    ProductFilterComponent,
    PrettierPipe,
    EditMultipleProductsComponent,
    EditOneProductComponent,
    FilterFieldsComponent,
    FilterTableComponent,
    DiscountFilterComponent,
    EditOneDiscountComponent,
    EditOneBaseComponent,
    EditableListComponent,
    ReferralComponent,
    CreateBundleComponent,
    ChooseBundleComposantComponent,
    CreateBundleOtherFieldsComponent
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
    ConfirmDialogModule,
    DialogModule,
    StepsModule
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
