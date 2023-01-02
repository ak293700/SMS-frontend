import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Operation} from "../../utils/Operation";
import {api} from "../GlobalUsings";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
  public static readonly identifierCookie: string = 'identifier';
  private session_token?: string;
  private jwt_content?: any;


  constructor(private cookieService: CookieService,
              private router: Router)
  { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (!this.checkAuth())
      return this.router.parseUrl('/login');

    return true;
  }

  checkAuth(): boolean
  {
    // If the user is not logged in
    if (this.session_token === undefined)
    {
      // And there is no cookie registered
      if (!this.cookieService.check(AuthGuard.identifierCookie))
        return false; // Can't be logged in

      // Else, we can get the cookie
      // And we can get the token from the server
      this.session_token = this.cookieService.get(AuthGuard.identifierCookie); // TODO: get the token from the server

      // so => logged in => return true
    }

    // Logged in => return true
    return true;
  }

  async init(email: string, password: string): Promise<boolean>
  {
    console.log(email, password);

    try
    {
      // A Jwt token
      let response =
        await axios.post(`${api}/Auth/login`, {email: email, password: password});

      this.session_token = response.data as string;
    } catch (e)
    {

      return false;
    }

    console.log(this.session_token);
    this.jwt_content = jwtDecode(this.session_token!);
    console.log(this.jwt_content);

    // Use to register the identifier in the cookie
    this.cookieService.set(AuthGuard.identifierCookie, btoa(`${email}:${password}`), undefined, '/');

    return true;
  }

  reset()
  {
    this.session_token = undefined;
    this.jwt_content = undefined;
    this.cookieService.delete(AuthGuard.identifierCookie, '/');
  }

  get sessionToken(): string | undefined
  {
    return Operation.deepCopy(this.session_token);
  }

  get expirationDate(): Date | undefined
  {
    if (this.jwt_content === undefined)
      return undefined;

    return new Date(this.jwt_content.exp * 1000);
  }

}
