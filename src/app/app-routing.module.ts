import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./Components/login-page/login-page.component";
import {HomeComponent} from "./Components/home/home.component";
import {ProductFilterComponent} from "./Components/product-filter/product-filter.component";

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'home', component: HomeComponent},
  {
    path: 'product', children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'filter', component: ProductFilterComponent},
    ]
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
