import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";

export class CustomRouteReuseStrategy implements RouteReuseStrategy
{
    private storedRoutes = new Map<string, DetachedRouteHandle>();
    private lastRoute: string = '';

    shouldDetach(route: ActivatedRouteSnapshot): boolean
    {
        if (route.routeConfig == undefined || route.routeConfig.component == undefined)
            return false;

        // we save the route for after
        this.lastRoute = this.getResolvedUrl(route);

        const data = route.routeConfig.data as any;
        return data?.reuse === true || false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void
    {
        if (route.routeConfig == undefined || handle == null)
            return;

        this.storedRoutes.set(this.getResolvedUrl(route), handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean
    {
        const curr_url = this.getResolvedUrl(route);
        if (route.routeConfig == undefined)
            return false;

        // is the route we go is cache
        const isRouteCached = this.storedRoutes.has(curr_url);

        // if the route is cached, need to test that we can use it from where we are from
        if (isRouteCached)
        {
            const reuseRoutesFrom = (route.data as any)?.reuseRoutesFrom as any;

            // the way the router call this is weird
            // it will call multiple times for one navigation
            // navigate from /a -> /b will call shouldAttach for /a and /a only then call shouldAttach for /a and /b
            // so lastRoute is /a => return false but the second call return true
            // this difference in the return create bug in future navigation
            if (reuseRoutesFrom === undefined || curr_url === this.lastRoute)
                return true; // if no just return true

            // check the policy allow to reuse the component
            return reuseRoutesFrom.includes(this.lastRoute);
        }

        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null
    {
        if (route.routeConfig == undefined)
            return null;

        return this.storedRoutes.get(this.getResolvedUrl(route)) ?? null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean
    {
        // Basic check
        // if just a param in the url change we don't want to reload the page6
        return future.routeConfig === curr.routeConfig;
    }

    private getResolvedUrl(route: ActivatedRouteSnapshot): string
    {
        return route.pathFromRoot
            .map(v => v.url
                .map(segment => segment.toString())
                .join('/')
            )
            .join('/');
    }
}
