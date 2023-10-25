import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import * as Constant from '../constant/constant';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
@Injectable({
  providedIn: 'root',
})
export class MyAccountSettingsService {
  private changeEmailAddressURL =
    Constant.BE_URL + 'api/myaccountsettings/changeEmailAddress';
  private changePasswordURL =
    Constant.BE_URL + 'api/myaccountsettings/changePassword';
  private getMobileNetworkCarriersURL =
    Constant.BE_URL + 'api/myaccountsettings/getMobileNetworkCarriers';
  private changeLoginInfoURL =
    Constant.BE_URL + 'api/myaccountsettings/changeLoginInfo';
  private changeAccountInfoURL =
    Constant.BE_URL + 'api/myaccountsettings/changeAccountInfo';
  private getAccountInfoURL =
    Constant.BE_URL + 'api/myaccountsettings/getAccountInfo';
  private getSignImageDateURL =
    Constant.BE_URL + 'api/myaccountsettings/getSignImageDate';
  private updateSignatureDataURL =
    Constant.BE_URL + 'api/myaccountsettings/updateSignatureData';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
 
  private httpOptions_upload = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  }
  pid: any;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }
  changeEmailAddress(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      email: param.email,
      password: param.password,
      currentemail: param.currentemail,
      confirmemail: param.confirmemail,
    };

    return this.httpClient
      .post<any>(this.changeEmailAddressURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  changePassword(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      email: param.email,
      password: param.password,
      currentpassword: param.currentpassword,
      confirmpassword: param.confirmpassword,
    };

    return this.httpClient
      .post<any>(this.changePasswordURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  changeLoginInfo(param: any): Observable<any> {
    var mobile_phone_number =
      param.mobile_phone_area_code +
      param.mobile_phone_prefix +
      param.mobile_phone_last_number;

    let data = {
      projectId: this.pid,
      id: param.id,
      email: param.email,
      alerts: param.alerts,
      cell_phone_carrier: param.cell_phone_carrier,
      screen_name: param.screen_name,
      mobile_phone_number: mobile_phone_number,
    };

    return this.httpClient
      .post<any>(this.changeLoginInfoURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  changeAccountInfo(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
      email: param.email,
      password: param.password,
      first_name: param.first_name,
      last_name: param.last_name,
      address_line_1: param.address_line_1,
      address_line_2: param.address_line_2,
      address_line_3: param.address_line_3,
      address_city: param.address_city,
      address_state: param.address_state,
      address_zip: param.address_zip,
      address_country: param.address_country,
      website: param.website,
      title: param.title,
      company_name: param.company_name,
    };

    return this.httpClient
      .post<any>(this.changeAccountInfoURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getMobileNetworkCarriers(): Observable<any> {
    let data = {
      projectId: this.pid,
    };

    return this.httpClient
      .get<any>(this.getMobileNetworkCarriersURL, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAccountInfoFormValue(param): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
    };

    return this.httpClient
      .post<any>(this.getAccountInfoURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getSignImageDate(param): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
    };

    return this.httpClient
      .post<any>(this.getSignImageDateURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateSignatureData(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
      image_data: param.image_data,
      type: param.type,
    };

    return this.httpClient
      .post<any>(this.updateSignatureDataURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  public uploadfile(virtual_file_path: any, id: any, type: any,contact_id:any) {

    let data = {
      id: id,
      image_data: virtual_file_path,
      type: type,
      contact_id: contact_id,
    };
    return this.httpClient
      .post(this.updateSignatureDataURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  
}
