import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {ProductFilterComponent} from "../app/Components/product/product-filter/product-filter.component";

export class CustomRouteReuseStrategy implements RouteReuseStrategy
{
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // TODO: optimized it to delete the oldest route when no need anymore

  shouldDetach(route: ActivatedRouteSnapshot): boolean
  {
    if (route.routeConfig == undefined)
      return false;

    return route.routeConfig.component === ProductFilterComponent;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void
  {
    if (route.routeConfig == undefined)
      return;
    console.log('store', route.routeConfig.path);

    // @ts-ignore
    this.storedRoutes.set(route.routeConfig.path, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean
  {
    if (route.routeConfig == undefined)
      return false;
    // console.log('shouldAttach', route.routeConfig.path);

    /*if (route.routeConfig.component === HomeComponent)
    {
      this.storedRoutes.clear();
      return false;
      TODO: Perhaps it is not necessary to delete the stored routes.
    }*/


    // @ts-ignore
    return !!route.routeConfig && !!this.storedRoutes.get(route.routeConfig.path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null
  {
    if (route.routeConfig == undefined)
      return false;
    // console.log('retrieve', route.routeConfig.path);

    // @ts-ignore
    return this.storedRoutes.get(route.routeConfig.path) ?? null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
  {
    console.log('shouldReuseRoute', future.routeConfig?.path, curr.routeConfig?.path);

    // Basic check
    // if just change the id of the product, we don't want to reuse the route
    return future.routeConfig === curr.routeConfig;
  }

}
