import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthGuard} from "../Guards/auth.guard";
import {api} from "../GlobalUsings";

@Injectable()
export class ServerRequestInterceptor implements HttpInterceptor
{
  constructor(private authGuard: AuthGuard)
  {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    if (!request.url.startsWith(api))
      return next.handle(request);

    request = request.clone({
      setHeaders: {
        // We add the token to the request
        Authorization: `Bearer ${this.authGuard.sessionToken}`
      }
    });

    // log the generated url
    return next.handle(request);
  }

  /*private async _intercept(request: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<unknown>>
  {
    // If it is a request to the server, and we are logged in (we have a token)
    if (!request.url.startsWith(api) || !await this.authGuard.checkAuth())
      return lastValueFrom(next.handle(request));

    // If the token is about to expire, we re fetch it
    if (this.authGuard.willExpireSoon())
      await this.aut

    request = request.clone({
      setHeaders: {
        // We add the token to the request
        Authorization: `Bearer ${this.authGuard.sessionToken}`
      }
    });

    // log the generated url
    return lastValueFrom(next.handle(request));
  }*/
}
