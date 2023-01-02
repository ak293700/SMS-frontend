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
    // If it is a request to the server, and we are logged in (we have a token)
    if (!request.url.startsWith(api) || !this.authGuard.checkAuth())
      return next.handle(request);

    console.log('intercepted');
    request = request.clone({
      setHeaders: {
        // We add the token to the request
        Authorization: `Bearer ${this.authGuard.sessionToken}`
      }
    });

    // log the generated url
    return next.handle(request);
  }
}
