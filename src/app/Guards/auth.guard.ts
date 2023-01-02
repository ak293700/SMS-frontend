import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import jwtDecode from "jwt-decode";
import {Operation} from "../../utils/Operation";
import {api} from "../GlobalUsings";
import {HttpClientWrapperService} from "../Services/http-client-wrapper.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
  public static readonly identifierCookie: string = 'identifier';
  private session_token?: string; // The jwt token used to identify the user
  private jwt_content?: any; // The content of the jwt token


  constructor(private cookieService: CookieService,
              private router: Router,
              private http: HttpClientWrapperService)
  { }


  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>
  {
    if (!await this.checkAuth())
      return this.router.parseUrl('/login');

    return true;
  }

  async checkAuth(): Promise<boolean>
  {
    // If the user is not logged or the token expire in less than an hour
    if (this.session_token === undefined || this.willExpireSoon())
    {
      // And there is no cookie registered
      if (!this.cookieService.check(AuthGuard.identifierCookie))
        return false; // Can't be logged in

      // Else, we refresh the token
      await this.initFromCookie();

      // so => logged in => return true
    }

    // Logged in => return true
    return true;
  }

  // Init
  async init(email: string, password: string): Promise<boolean>
  {
    try
    {
      // A Jwt token
      let response =
        await this.http.post(`${api}/Auth/login`, {email: email, password: password});
      console.log(response);

      this.session_token = response.body as string;
    } catch (e)
    {
      return false;
    }

    this.buildJwtContent();

    // Use to register the identifier in the cookie
    this.cookieService.set
    (
      AuthGuard.identifierCookie,
      btoa(`${email}:${password}`),
      undefined,
      '/',
      undefined,
      true,
      'Strict'
    );

    return true;
  }

  // Init
  async initFromCookie(): Promise<boolean>
  {
    const cookie: string = atob(this.cookieService.get(AuthGuard.identifierCookie));

    const [email, password] = cookie.split(':');

    return await this.init(email, password);
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

  get expirationDate(): Date
  {
    if (this.jwt_content === undefined)
      throw new Error('The jwt content is undefined');

    return new Date(this.jwt_content.exp * 1000);
  }

  // return whether the token is expired or it will be soon
  willExpireSoon(): boolean
  {
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);

    return this.expirationDate < anHourAgo;
  }

  buildJwtContent()
  {
    if (this.session_token === undefined)
      throw new Error('The session token is undefined');

    this.jwt_content = jwtDecode(this.session_token);
  }
}
