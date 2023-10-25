
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Constant from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private checkEmailExisturl =  Constant.BE_URL+"api/common/checkEmailExist";
  private checkUserExisturl =  Constant.BE_URL+"api/common/checkUserExist";
  private registerurl =  Constant.BE_URL+"api/common/register";
  private forgotpwdurl =  Constant.BE_URL+"api/common/forgotpassword";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  checkEmailExist(email): Observable<any> {

    let data = {
      email: email
    };
  
    return this.httpClient.post<any>(this.checkEmailExisturl, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }
  register(first_name,last_name,email,company,zip): Observable<any> {


    let data = {
      first_name: first_name, 
      last_name: last_name, 
      email: email,
      company: company, 
      zip: zip, 
    };
  
    return this.httpClient.post<any>(this.registerurl, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }

  forgotpassword(email): Observable<any> {


    let data = {
      email: email,
    };
  
    return this.httpClient.post<any>(this.forgotpwdurl, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }

  checkUserExist(email): Observable<any> {


    let data = {
      email: email,
    };
  
    return this.httpClient.post<any>(this.checkUserExisturl, data, this.httpOptions)
    .pipe(
      map(data => { return data; }) 
    );
  }
}
