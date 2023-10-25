import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHeaders,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private router: Router,) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes("login"))
      return next.handle(request);

    let token = localStorage.getItem('token');
    let headers = null;
    if (request.url.includes("modules-file-manager-file-uploader-ajax") || request.url.includes("updateSignatureData")
    ) {
      //console.log("iff");
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
      });
    }
    else if (request.url.includes("upload_rfi_attachments")
      || request.url.includes("subcontract_attachment")
      || request.url.includes("change_order_attachments")
    ) {
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data'
      });
    }
    else {
      //console.log("else");
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
    }


    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer '+token,
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'application/json'
    // });

    const url = `${request.url}`;
    const newRequest = request.clone({ headers, url });

    return next.handle(newRequest);


  }
}
