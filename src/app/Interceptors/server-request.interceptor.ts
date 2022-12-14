import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthGuard} from "../Guards/auth.guard";
import {api} from "../GlobalUsings";
import {MessageService} from "primeng/api";

@Injectable()
export class ServerRequestInterceptor implements HttpInterceptor
{
  constructor(private authGuard: AuthGuard,
              private messageService: MessageService)
  {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    if (!request.url.startsWith(api) || request.url.startsWith(`${api}/Auth/login`))
      return next.handle(request);

    // Can't
    if (this.authGuard.expirationDate < new Date())
    {
      this.messageService.add(
          {
            severity: 'error',
            summary: 'La session a expirée',
            detail: "Actualisez la page s'il vous plaît"
          });
      throw new Error("Token expired");
    }

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
