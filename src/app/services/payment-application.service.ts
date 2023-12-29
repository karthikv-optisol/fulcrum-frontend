import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentApplicationService {

  private drawListURL = Constant.BE_URL + 'api/project_management/module_draw_list';
  private createDrawURL = Constant.BE_URL + 'api/project_management/saveDrawAsDraft';
  private createRetentionURL = Constant.BE_URL + 'api/project_management/saveRetentionAsDraft';
  private getDrawsInfoURL = Constant.BE_URL + 'api/project_management/getDrawsInfo';
  private getRetDrawsInfoURL = Constant.BE_URL + 'api/project_management/getRetDrawsInfo';
  private getDrawActionTypeOptionsURL = Constant.BE_URL + 'api/project_management/getDrawActionType';
  private exportPrintDrawURL = Constant.BE_URL + 'api/project_management/exportPrintDraw';
  private exportPrintRetentionURL = Constant.BE_URL + 'api/project_management/exportPrintRetention';
  private deleteDrawURL = Constant.BE_URL + 'api/project_management/deleteDraw';
  private deleteRetentionURL = Constant.BE_URL + 'api/project_management/deleteRetention';
  private updateDrawURL = Constant.BE_URL + 'api/project_management/updateDraw';
  private updateRetentionURL = Constant.BE_URL + 'api/project_management/updateRetention';

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

  getDrawList(data: any) {
    return this.httpClient.post<any>(this.drawListURL, data, this.httpOptions);
  }

  createDraw(data: any) {
    return this.httpClient.post<any>(this.createDrawURL, data, this.httpOptions);
  }

  createRetention(data: any) {
    return this.httpClient.post<any>(this.createRetentionURL, data, this.httpOptions);
  }

  getDrawsInfo(data: any) {
    return this.httpClient.post<any>(this.getDrawsInfoURL, data, this.httpOptions);
  }

  // get Ret Draws Info
  getRetDrawsInfo(data: any) {
    return this.httpClient.post<any>(this.getRetDrawsInfoURL, data, this.httpOptions);
  }

  // Get Draw Action Type Options
  getDrawActionType(data: any) {
    return this.httpClient.post<any>(this.getDrawActionTypeOptionsURL, data, this.httpOptions);
  }

  // export Print Draw 
  exportPrintDraw(data: any) {
    return this.httpClient.post<any>(this.exportPrintDrawURL, data, this.httpOptions);
  }

  // export Print Draw 
  exportPrintRetention(data: any) {
    return this.httpClient.post<any>(this.exportPrintRetentionURL, data, this.httpOptions);
  }

  // delete draw
  deleteDraw(data)
  {
    return this.httpClient.post<any>(this.deleteDrawURL, data, this.httpOptions);
  }

  //delete retention
  deleteRetention(data)
  {
    return this.httpClient.post<any>(this.deleteRetentionURL, data, this.httpOptions);
  }

  //update draw
  updateDraw(data)
  {
    return this.httpClient.post<any>(this.updateDrawURL, data, this.httpOptions);
  }

  //update retention
  updateRetention(data)
  {
    return this.httpClient.post<any>(this.updateRetentionURL, data, this.httpOptions);
  }
}
