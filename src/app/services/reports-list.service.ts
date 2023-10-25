import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from '../constant/constant';
import { Observable } from 'rxjs';
import { saveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ReportsListService {
  private reportsurl = Constant.BE_URL + "api/reports/modules-report-form";
  private generatereporturl = Constant.BE_URL + "api/reports/modules-report-generate";
  private deletetempurl = Constant.BE_URL + "api/reports/Delete-Temp-Path";
  private meetingtypes = Constant.BE_URL + "api/reports/MeetingTypes";
  private vendorurl = Constant.BE_URL + "api/reports/loadSelectedReportCompany";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

  };
  parseduser = JSON.parse(localStorage.getItem('users'));
  projectId = this.parseduser.projectId;
  id = this.parseduser.id;

  user_company_id = this.parseduser.user_company_id;
  primary_contact_id = this.parseduser.primary_contact_id;

  role_id = this.parseduser.role_id;
  currentlySelectedProjectId = this.parseduser.currentlySelectedProjectId;
  currentlySelectedProjectName = this.parseduser.currentlySelectedProjectName;
  currentlySelectedProjectUserCompanyId = this.parseduser.currentlySelectedProjectUserCompanyId;
  currentlyActiveContactId = this.parseduser.currentlyActiveContactId;
  methodCall = 'loadFiles';

  postidList = '';
  getidList = '';
  postisTrash = 'no';
  getisTrash = ''; postdir = '';

  getdir = '';

  userRole = JSON.parse(localStorage.getItem('users'));
  pid: string;


  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {

    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
    });
  }

  DeleteTempPath(tempFileName): Observable<any> {
    
    let data = {
      projectId: this.pid,
      tempFileName:tempFileName
    };
    return this.httpClient.post<any>(this.deletetempurl, data, this.httpOptions)
    .pipe(
      map(data => { return data; })
    );
  }
  ReportsandOptions(): Observable<any> {
    //console.log(this.userRole);

    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id:this.primary_contact_id,
      currentlySelectedProjectId : this.pid,
      currentlySelectedProjectUserCompanyId:this.currentlySelectedProjectUserCompanyId,

      currentlyActiveContactId: this.currentlyActiveContactId,
      userRole: this.userRole.userRole
    };

    return this.httpClient.post<any>(this.reportsurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  loadMeetingsByMeetingTypeId(meeting_type_id)
  { let data = {
    projectId: this.pid,
    meeting_type_id: meeting_type_id,
    
  };

  return this.httpClient.post<any>(this.meetingtypes, data, this.httpOptions)
    .pipe(
      map(data => { return data; })
    );

  }
  loadSelectedReportCompany(vendor_id)
  { let data = {
    projectId: this.pid,
    vendor_id: vendor_id,
    user_company_id: this.user_company_id,  currentlySelectedProjectUserCompanyId:this.currentlySelectedProjectUserCompanyId,
  };

  return this.httpClient.post<any>(this.vendorurl, data, this.httpOptions)
    .pipe(
      map(data => { return data; })
    );

  }
  GenerateReport(grouprowval,groupco,generalco,inotes,subtotal,vendor_id,qb_customer,cc_id,vendor,filteropt,ch_potential ,meeting_type_id,ddl_meeting_id,dateDCR,crntNotes,crntSubtotal,crntBgt_val_only,costCodeAlias,view_option,coshowcostcode,coshowreject,cot,codesp,Reportoption,search,offset,limit,sbs,sbo,ReportType,report_view,projectName,date,date1): Observable<any> {
    if(codesp == true){
      codesp = 'true';
    }
    else{
      codesp ='false';
    }
    // if(ReportType == 'Weekly Job')
    // {
    //   date='08/21/2017';
    //   date1='08/27/2017';
    // }
    let data = {
      grouprowval:grouprowval,
      groupco:groupco,generalco:generalco,inotes:inotes,subtotal:subtotal,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id:this.primary_contact_id,
      currentlySelectedProjectId : this.pid,
      currentlySelectedProjectUserCompanyId:this.currentlySelectedProjectUserCompanyId,

      currentlyActiveContactId: this.currentlyActiveContactId,
      userRole: this.userRole.userRole,
      sbs:sbs,
      sbo:sbo,
      ReportType:ReportType,
      report_view:report_view,
      projectName:projectName,
      date:date,
      date1:date1,
      offset:offset, limit:limit,
      search:search,
      Reportoption:Reportoption,
      codesp:codesp,
      cot:cot,
      coshowreject:coshowreject,
      coshowcostcode:coshowcostcode,
      view_option:view_option,
      crntNotes:crntNotes,
      crntSubtotal:crntSubtotal,
      crntBgt_val_only:crntBgt_val_only,
      costCodeAlias:costCodeAlias,  dateDCR:dateDCR,
      meeting_type_id:meeting_type_id,
      meeting_id:ddl_meeting_id,
      filteropt:filteropt,
      checkpotential:ch_potential,

      vendor_id:vendor_id,
      qb_customer:qb_customer,
      cc_id:cc_id,
      vendor:vendor,
    };

    return this.httpClient.post<any>(this.generatereporturl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  base64ToArrayBuffer(base64: any): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  GenerateReportPDF(grouprowval,groupco,generalco,inotes,subtotal,vendor_id,qb_customer,cc_id,vendor,filteropt,ch_potential ,meeting_type_id,ddl_meeting_id,dateDCR,crntNotes,crntSubtotal,crntBgt_val_only,costCodeAlias,view_option,coshowcostcode,coshowreject,cot,codesp,Reportoption,search,offset,limit,sbs,sbo,ReportType,report_view,projectName,date,date1): Observable<Blob> {
    if(codesp == true){
      codesp = 'true';
    }
    else{
      codesp ='false';
    }
    
    // if(ReportType == 'Weekly Manpower')
    // {
    //   date='08/20/2018';
    //   date1='08/26/2018';
    // }
    let data = {
      grouprowval:grouprowval,
      groupco:groupco,generalco:generalco,inotes:inotes,subtotal:subtotal,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id:this.primary_contact_id,
      currentlySelectedProjectId : this.pid,
      currentlySelectedProjectUserCompanyId:this.currentlySelectedProjectUserCompanyId,

      currentlyActiveContactId: this.currentlyActiveContactId,
      userRole: this.userRole.userRole,
      sbs:sbs,
      sbo:sbo,
      ReportType:ReportType,
      report_view:report_view,
      projectName:projectName,
      date:date,
      date1:date1,
      offset:'', 
      limit:'',
      search:search,
      Reportoption:Reportoption,
      codesp:codesp,
      cot:cot,
      coshowreject:coshowreject,
      coshowcostcode:coshowcostcode,
      view_option:view_option,
      crntNotes:crntNotes,
      crntSubtotal:crntSubtotal,
      crntBgt_val_only:crntBgt_val_only,
      costCodeAlias:costCodeAlias,
      dateDCR:dateDCR, meeting_type_id:meeting_type_id,
      meeting_id:ddl_meeting_id,
      filteropt:filteropt,
      checkpotential:ch_potential, vendor_id:vendor_id,
      qb_customer:qb_customer,
      cc_id:cc_id,
      vendor:vendor,
    };

    return this.httpClient.post<any>(this.generatereporturl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
}


