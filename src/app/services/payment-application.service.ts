import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentApplicationService {

  private PaymentListURL = Constant.BE_URL + 'api/project_management/module_draw_list';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  fileHttpOptions = {
    headers: new HttpHeaders()
  }

  parseduser = JSON.parse(localStorage.getItem('users'));
  projectId = this.parseduser.projectId;
  id = this.parseduser.id;

  user_company_id = this.parseduser.user_company_id;
  primary_contact_id = this.parseduser.primary_contact_id;

  role_id = this.parseduser.role_id;
  currentlySelectedProjectId = this.parseduser.currentlySelectedProjectId;
  currentlySelectedProjectName = this.parseduser.currentlySelectedProjectName;
  currentlySelectedProjectUserCompanyId =
    this.parseduser.currentlySelectedProjectUserCompanyId;
  currentlyActiveContactId = this.parseduser.currentlyActiveContactId;
  pid: any;
  userRole = JSON.parse(localStorage.getItem('users'));

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }

  getDrawList(data:any)
  {
    return this.httpClient.post<any>(this.PaymentListURL, data, this.httpOptions);
  }


}
