import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Constant from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url =  Constant.BE_URL+"api/common/loginUsingPasswordGuid";
  private loginformurl =  Constant.BE_URL+"api/common/loginUsingEmailPassword";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  loginUsingPasswordGuid(email,passwordGuId,projectId): Observable<any> {

    let data = {
      email: email,
      passwordGuId: passwordGuId, 
      projectId: projectId
    };
  
    return this.httpClient.post<any>(this.url, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }

  loginUsingEmailPassword(email,password): Observable<any> {

    let data = {
      email: email,
      password: password, 
    };
  
    return this.httpClient.post<any>(this.loginformurl, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }
  loggedIn()
  {
    return !!localStorage.getItem('token');
  }
}
