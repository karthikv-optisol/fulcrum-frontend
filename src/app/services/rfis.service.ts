import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RFIsService {
  // private meetingTypeURL = Constant.BE_URL + "api/project_management/meeting_type";
  private rfiListURL = Constant.BE_URL + "api/project_management/rfi_list";
  private rfiRecEmailListURL = Constant.BE_URL + "api/project_management/recipient-email-list-and-filter-roles";
  private importCostURL = Constant.BE_URL + "api/project_management/costCode-RfiPriority-RfiType-DropDownList";
  private rfiCreateURL = Constant.BE_URL + "api/project_management/create_rfi";
  private rfiUpdateURL = Constant.BE_URL + "api/project_management/update_rfi";
  private rfiCreateDraftURL = Constant.BE_URL + "api/project_management/create_draft_rfi";
  private rfiAttachmentURL = Constant.BE_URL + "api/project_management/upload_rfi_attachments";
  private rfiAttachmentUpdateURL = Constant.BE_URL + "api/project_management/update_rfi_attachment";
  private rfiAttachmentDeleteURL = Constant.BE_URL + "api/project_management/delete_rfi_attachment";
  private rfidAttachmentDeleteURL = Constant.BE_URL + "api/project_management/delete_rfid_attachment";
  private rfiInforURL = Constant.BE_URL + "api/project_management/rfi_info";
  private rfiDraftInforURL = Constant.BE_URL + "api/project_management/rfi_draft_info";
  private rfiDraftListURL = Constant.BE_URL + "api/project_management/rfi_draft_list";
  private rfiDraftUpdateURL = Constant.BE_URL + "api/project_management/update_draft_rfi";
  private rfiDraftDeleteURL = Constant.BE_URL + "api/project_management/delete_draft_rfi";
  private rfiResponseDeleteURL = Constant.BE_URL + "api/project_management/delete_rfi_response";
  private rfiPDFRenderURL = Constant.BE_URL + "api/project_management/rfi_render_pdf";

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
  selectedValue: any;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }

  // loadMeetingTypes(): Observable<any> {
  //   let data = {
  //     projectId: this.pid
  //   };
  //   return this.httpClient
  //     .post<any>(this.meetingTypeURL, data, this.httpOptions);
  // }
  CostCodeService() {
    let data = {
      projectId: this.pid
    };
    return this.httpClient
      .post<any>(this.importCostURL, data, this.httpOptions);
  }
  recipientEmailList() {
    let params = {
      projectId: this.pid,
      "moduleName": "RFI",
      "moduleid": ""
    }
    return this.httpClient.post<any>(this.rfiRecEmailListURL, params, this.httpOptions);
  }
  importRfiList() {
    let data = {
      projectId: this.pid
    };
    // console.log('id', data);
    return this.httpClient.post<any>(this.rfiListURL, data, this.httpOptions);
  }

  RfiDraftList(data:any)
  {
    return this.httpClient.post<any>(this.rfiDraftListURL, data, this.httpOptions);
  }

  uploadRFIAttachments(data:any)
  {
      return this.httpClient.post<any>(this.rfiAttachmentURL,data,this.fileHttpOptions);
  }

  rfiAttachmentUpdate(data:any)
  {
    // rfiAttachmentUpdateURL
    return this.httpClient.post<any>(this.rfiAttachmentUpdateURL,data,this.fileHttpOptions);
  }

  // rfidAttachmentDeleteURL
  rfidAttachmentDelete(data)
  {
    return this.httpClient.post<any>(this.rfidAttachmentDeleteURL,data,this.fileHttpOptions);
  }

  // rfiAttachmentDeleteURL
  rfiAttachmentDelete(data:any)
  {
    return this.httpClient.post<any>(this.rfiAttachmentDeleteURL,data,this.fileHttpOptions);
  }

  createRFI(data:any)
  {
    return this.httpClient.post<any>(this.rfiCreateURL, data, this.httpOptions);
  }

  // rfiUpdateURL
  updateRFI(data:any)
  {
    return this.httpClient.post<any>(this.rfiUpdateURL, data, this.httpOptions);
  }

  // rfiDraftUpdateURL
  updateRFIDraft(data:any)
  {
    return this.httpClient.post<any>(this.rfiDraftUpdateURL, data, this.httpOptions);
  }

  // rfiDraftDeleteURL
  deleteRFIDraft(data:any)
  {
    return this.httpClient.post<any>(this.rfiDraftDeleteURL, data, this.httpOptions);
  }

  getRFIInfo(data:any)
  {
    return this.httpClient.post<any>(this.rfiInforURL, data, this.httpOptions);
  }

  getRFIDraftInfo(data:any)
  {
    return this.httpClient.post<any>(this.rfiDraftInforURL, data, this.httpOptions);
  }

  createDraftRFI(data:any)
  {
    return this.httpClient.post<any>(this.rfiCreateDraftURL, data, this.httpOptions);
  }
  resetDropdown() {
    this.selectedValue = null; // or assign the initial/default value as needed
  }

  deleteResponse(data)
  {
    return this.httpClient.post<any>(this.rfiResponseDeleteURL, data, this.httpOptions);
  }

  //rfiPDFRenderURL
  rfiRenderPDF(data)
  {
    return this.httpClient.post<any>(this.rfiPDFRenderURL, data, this.httpOptions);
  }
}
