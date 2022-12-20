import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {
    path: 'home', component: ReferralComponent, data: {
      rails: [
        {label: 'Produits', link: '/product/'},
        {label: 'Remises', link: '/discount/'},
        {label: 'Paramètres', link: '/settings'}
      ],
      backButton: {show: false}
    }
  },
  {
    path: 'product',
    children: [
      {
        path: '', component: ReferralComponent, data: {
          rails: [
            {label: 'Création', link: 'bundle'},
            {label: 'Modification', link: 'filter'}
          ],
          backButton: {link: '/home'}
        }
      },
      {path: 'bundle', component: CreateBundleComponent},
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
  {
    path: 'discount', children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'filter', component: DiscountFilterComponent},
      {
        path: 'edit', children: [
          {path: '', redirectTo: '/home', pathMatch: 'full'},
          {path: 'multiple', component: DiscountFilterComponent},
          {path: 'one', component: EditOneDiscountComponent},
        ]
      },
    ]
  },
  {path: 'setting', component: LoginPageComponent},
  {path: 'filter', component: FilterFieldsComponent},
  // {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
