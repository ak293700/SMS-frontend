import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpClientWrapperService
{
  constructor(private http: HttpClient) { }

  public async get(url: string, responseType ?: string): Promise<HttpResponse<any>>
  {
    let response = this.http.get<HttpResponse<any>>(url,
      {responseType: responseType as 'json', observe: 'response'});

    return lastValueFrom(response)
      .catch(error => {
        return error;
      });
  }

  public async delete(url: string, responseType ?: string): Promise<HttpResponse<any>>
  {
    let response = this.http.delete<HttpResponse<any>>(url,
      {responseType: responseType as 'json', observe: 'response'});

    return lastValueFrom(response)
      .catch(error => {
        return error;
      });
  }

  public async post(url: string, body: any = null, responseType ?: string): Promise<HttpResponse<any>>
  {
    let response = this.http.post<HttpResponse<any>>(url, body,
      {responseType: responseType as 'json', observe: 'response'});

    return lastValueFrom(response)
      .catch(error => {
        return error;
      });
  }

  public async patch(url: string, body: any = null, responseType ?: string): Promise<HttpResponse<any>>
  {
    let response = this.http.patch<HttpResponse<any>>(url, body,
      {responseType: responseType as 'json', observe: 'response'});

    return lastValueFrom(response)
      .catch(error => {
        return error;
      });
  }
}
