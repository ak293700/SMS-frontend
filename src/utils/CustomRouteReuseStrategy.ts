import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";

export class CustomRouteReuseStrategy implements RouteReuseStrategy
{
    private storedRoutes = new Map<string, DetachedRouteHandle>();
    private lastRoute: string = '';


    shouldDetach(route: ActivatedRouteSnapshot): boolean
    {
        console.log('shouldDetach');
        if (route.routeConfig == undefined || route.routeConfig.component == undefined)
            return false;

        // we save the route for after
        this.lastRoute = this.getResolvedUrl(route);
        const data = route.routeConfig.data as any;

        return data?.reuse === true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void
    {
        if (route.routeConfig == undefined || handle == null)
            return;

        this.storedRoutes.set(this.getResolvedUrl(route), handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean
    {
        console.log('shouldAttach');
        if (route.routeConfig == undefined)
            return false;

        // is the route we go is cache
        const wasRoutePreviouslyDetached = !!route.routeConfig
            && !!this.storedRoutes.get(this.getResolvedUrl(route));
        if (wasRoutePreviouslyDetached)
        {
            const reuseRoutesFrom = (route.data as any)?.reuseRoutesFrom as any;

            if (reuseRoutesFrom === undefined)
            {
                console.log('no policy');
                return true; // if no just return true
            }

            console.log('policy exist');

            // // check the policy allow to reuse the component

            console.log('lasRoute', this.lastRoute);
            const res: boolean = reuseRoutesFrom.includes(this.lastRoute);
            console.log('res', res);
            console.log(res !== true && res !== false);

            // if (res !== true && res !== false)
            //     throw new Error('reuseRoutesFrom must be an array of string or a boolean');

            return false;
            return true;
            return res;
        }

        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null
    {
        if (route.routeConfig == undefined)
            return null;

        console.log('retrieve', this.storedRoutes.get(this.getResolvedUrl(route)) ?? null);
        return this.storedRoutes.get(this.getResolvedUrl(route)) ?? null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
    {
        console.log('shouldReuseRoute');
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
