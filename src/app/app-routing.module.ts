import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./Components/login-page/login-page.component";
import {HomeComponent} from "./Components/home/home.component";
import {ProductFilterComponent} from "./Components/product/product-filter/product-filter.component";
import {
  EditMultipleProductsComponent
} from "./Components/product/edit-multiple-products/edit-multiple-products.component";
import {EditOneProductComponent} from "./Components/product/edit-one/edit-one-product.component";
import {FilterFieldsComponent} from "./Components/filter/filter-fieds/filter-fields.component";

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'home', component: HomeComponent},
  {
    path: 'product', children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'filter', component: ProductFilterComponent},
      {
        path: 'edit', children: [
          {path: '', redirectTo: '/home', pathMatch: 'full'},
          {path: 'multiple', component: EditMultipleProductsComponent},
          {path: 'one', component: EditOneProductComponent},
        ]
      },
    ]
  },
  {path: 'discount', component: HomeComponent},
  {path: 'setting', component: HomeComponent},
  {path: 'filter', component: FilterFieldsComponent},
  // {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
