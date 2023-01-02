import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthGuard} from "./auth.guard";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate
{
  constructor(private authGuard: AuthGuard,
              private router: Router)
  {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this.authGuard.checkAuth())
      return this.router.parseUrl('/home');

    return true;
  }

}
