import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./Components/login-page/login-page.component";
import {ProductFilterComponent} from "./Components/product/product-filter/product-filter.component";
import {
  EditMultipleProductsComponent
} from "./Components/product/edit-multiple-products/edit-multiple-products.component";
import {EditOneProductComponent} from "./Components/product/edit-one-product/edit-one-product.component";
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
import {
  FeatureModelFilterComponent
} from "./Components/feature-model/feature-model-filter/feature-model-filter.component";
import {
  EditOneFeatureModelComponent
} from "./Components/feature-model/edit-one-feature-model/edit-one-feature-model.component";
import {
  EditOneFeatureValueComponent
} from "./Components/feature-value/edit-one-feature-value/edit-one-feature-value.component";
import {
  CreateFeatureModelComponent
} from "./Components/feature-model/create-feature-model/create-feature-model.component";

// data.reuse <=> should the route be cached
// data.reuseRoutesFrom <=> from where the route can be reused

const createOrViewRoute: Route = {
  path: '',
  component: ReferralComponent, data: {
    rails: [
      {label: 'Créer', link: 'create'},
      {label: 'Voir', link: 'filter'}
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
      {label: 'Caractéristiques', link: '/featureModel/'},
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
    createOrViewRoute,
    {path: 'create', component: CreateBundleComponent},
    {path: 'filter', component: ProductFilterComponent, data: {reuse: true}},
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
  path: 'discount',
  children: [
    createOrViewRoute,
    {path: 'create', component: CreateDiscountComponent},
    {path: 'filter', component: DiscountFilterComponent, data: {reuse: true}},
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
  path: 'distributor',
  children: [
    createOrViewRoute,
    {path: 'create', component: CreateDistributorComponent},
    {path: 'filter', component: DistributorFilterComponent, data: {reuse: true}},
  ],
  canActivate: [AuthGuard]
};

const featureModelRoute: Route = {
  path: 'featureModel',
  children: [
    createOrViewRoute,
    {path: 'create', component: CreateFeatureModelComponent},
    {path: 'filter', component: FeatureModelFilterComponent, data: {reuse: true}},
    {
      path: 'edit',
      children: [
        {path: '', redirectTo: '/home', pathMatch: 'full'},
        {
          path: 'one',
          component: EditOneFeatureModelComponent,
          data: {
            reuse: true,
            reuseRoutesFrom: ['/featureValue/edit/one']
          }
        },
      ],
    },
  ],
  canActivate: [AuthGuard]
};

const featureValueRoute: Route = {
  path: 'featureValue',
  children: [
    createOrViewRoute,
    {
      path: 'edit',
      children: [
        {path: '', redirectTo: '/home', pathMatch: 'full'},
        {
          path: 'one',
          component: EditOneFeatureValueComponent,
        },
      ],
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
  featureModelRoute,
  featureValueRoute,
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule
{

}
