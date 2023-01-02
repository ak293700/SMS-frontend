import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./Components/login-page/login-page.component";
import {ProductFilterComponent} from "./Components/product/product-filter/product-filter.component";
import {
  EditMultipleProductsComponent
} from "./Components/product/edit-multiple-products/edit-multiple-products.component";
import {EditOneProductComponent} from "./Components/product/edit-one-product/edit-one-product.component";
import {FilterFieldsComponent} from "./Components/filter/filter-fields/filter-fields.component";
import {DiscountFilterComponent} from "./Components/discount/discount-filter/discount-filter.component";
import {EditOneDiscountComponent} from "./Components/discount/edit-one-discount/edit-one-discount.component";
import {ReferralComponent} from "./Components/referral/referral.component";
import {CreateBundleComponent} from "./Components/product/create-product/create-bundle/create-bundle.component";
import {CreateDiscountComponent} from "./Components/discount/create-discount/create-discount.component";
import {SettingsComponent} from "./Components/settings/settings.component";
import {CreateDistributorComponent} from "./Components/distributor/create-distributor/create-distributor.component";
import {DistributorFilterComponent} from "./Components/distributor/distributor-filter/distributor-filter.component";
import {LoginGuard} from "./Guards/login.guard";
import {AuthGuard} from "./Guards/auth.guard";

const createOrUpdateRoute: Route = {
  path: '',
  component: ReferralComponent, data: {
    rails: [
      {label: 'Création', link: 'create'},
      {label: 'Modification', link: 'filter'}
    ],
    backButton: {link: '/home'}
  }
};

const homeRoute: Route = {
  path: 'home',
  component: ReferralComponent, data: {
    rails: [
      {label: 'Produits', link: '/product/'},
      {label: 'Remises', link: '/discount/'},
      {label: 'Distributeurs', link: '/distributor'},
      {label: 'Paramètres', link: '/settings'}
    ],
    backButton: {show: false}
  },
  canActivate: [AuthGuard]
};

const productRoute: Route = {
  path: 'product',
  children: [
    createOrUpdateRoute,
    {path: 'create', component: CreateBundleComponent},
    {path: 'filter', component: ProductFilterComponent},
    {
      path: 'edit', children: [
        {path: '', redirectTo: '/home', pathMatch: 'full'},
        {path: 'multiple', component: EditMultipleProductsComponent},
        {path: 'one', component: EditOneProductComponent},
      ]
    },
  ],
  canActivate: [AuthGuard]
};

const discountRoute: Route = {
  path: 'discount', children: [
    createOrUpdateRoute,
    {path: 'create', component: CreateDiscountComponent},
    {path: 'filter', component: DiscountFilterComponent},
    {
      path: 'edit', children: [
        {path: '', redirectTo: '/home', pathMatch: 'full'},
        {path: 'multiple', component: DiscountFilterComponent},
        {path: 'one', component: EditOneDiscountComponent},
      ]
    }
  ],
  canActivate: [AuthGuard]
};

const distributorRoute: Route = {
  path: 'distributor', children: [
    createOrUpdateRoute,
    {path: 'create', component: CreateDistributorComponent},
    {path: 'filter', component: DistributorFilterComponent},
    {
      path: 'edit', children: [
        {path: '', redirectTo: '/home', pathMatch: 'full'},
        {path: 'multiple', component: DiscountFilterComponent},
        {path: 'one', component: EditOneDiscountComponent},
      ]
    },
  ],
  canActivate: [AuthGuard]
};

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent, canActivate: [LoginGuard]},
  homeRoute,
  productRoute,
  discountRoute,
  distributorRoute,
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'filter', component: FilterFieldsComponent, canActivate: [AuthGuard]},
  // {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
