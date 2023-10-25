import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Constant from '../constant/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GlobalAdminService {
  pid: any;
  private ggetSoftwareModuleListDataURL =
  Constant.BE_URL + 'api/globaladmin/getSoftwareModuleListData';
  private getManageUserDataURL =
  Constant.BE_URL + 'api/globaladmin/getManageUserData';

  private getCompanyUsersData =
  Constant.BE_URL + 'api/globaladmin/getCompanyUsersData';

  private updateDeleteCompanyUsersDataSoftModule =
  Constant.BE_URL + 'api/globaladmin/updateDeleteCompanyUsersDataSoftModule';

  

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
  constructor(
    private route: ActivatedRoute, 
    private httpClient: HttpClient) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
   }

   
   getSoftwareModuleListData(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
    };

    return this.httpClient
      .post<any>(this.ggetSoftwareModuleListDataURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getCompanySoftwareModuleListData(param: any): Observable<any> {
    let data = {
      user_company_id: param.id,
      id: param.id,
    };

    return this.httpClient
      .post<any>(this.getCompanyUsersData, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
   
  getManageUserData(param: any): Observable<any> {
    let data = {
      projectId: this.pid,
      id: param.id,
    };

    return this.httpClient
      .post<any>(this.getManageUserDataURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //  is_disabled: param.is_disabled,
  getupdateDeleteCompanyUsersDataSoftModule(param: any): Observable<any> {
    let data = {
      id: param.company_id,
      company: param.user_company_name,
      employer_identification_number: param.employer_identification_number,
      construction_license_number: param.construction_license_number,
      construction_license_number_expiration_date: param.construction_license_number_expiration_date,
      paying_customer_flag: param.paying_customer_flag,
      user_company_id: param.company_id,
      software_module_id: param.software_modules,
    };

    console.log("dataservices", data);
    // los
    

    return this.httpClient
      .post<any>(this.updateDeleteCompanyUsersDataSoftModule, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

}
