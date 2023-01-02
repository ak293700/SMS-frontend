import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthGuard} from "./auth.guard";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate
{
  constructor(private authGuard: AuthGuard,
              private router: Router)
  {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {
    if (await this.authGuard.checkAuth())
      return this.router.parseUrl('/home');

    return true;
  }

}
