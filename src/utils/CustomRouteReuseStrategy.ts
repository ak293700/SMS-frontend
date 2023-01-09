import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {ProductFilterComponent} from "../app/Components/product/product-filter/product-filter.component";
import {DiscountFilterComponent} from "../app/Components/discount/discount-filter/discount-filter.component";
import {
  FeatureModelFilterComponent
} from "../app/Components/feature-model/feature-model-filter/feature-model-filter.component";

export class CustomRouteReuseStrategy implements RouteReuseStrategy
{
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // TODO: optimized it to delete the oldest route when no need anymore

  shouldDetach(route: ActivatedRouteSnapshot): boolean
  {
    if (route.routeConfig == undefined || route.routeConfig.component == undefined)
      return false;

    const store = [ProductFilterComponent, DiscountFilterComponent, FeatureModelFilterComponent];
    return store.includes(route.routeConfig.component);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void
  {
    if (route.routeConfig == undefined || handle == null)
      return;

    this.storedRoutes.set(this.getResolvedUrl(route), handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean
  {
    if (route.routeConfig == undefined)
      return false;

    return !!route.routeConfig && !!this.storedRoutes.get(this.getResolvedUrl(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null
  {
    if (route.routeConfig == undefined)
      return false;

    return this.storedRoutes.get(this.getResolvedUrl(route)) ?? null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
  {
    // Basic check
    // if just change the params of the product, we don't want to reuse the route
    return future.routeConfig === curr.routeConfig;
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string
  {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

}
