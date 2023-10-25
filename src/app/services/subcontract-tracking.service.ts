import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcontractTrackingService {

  private subcontractTrackingURL = Constant.BE_URL + "api/project_management/subcontract_list";
  private subcontractHeaderURL = Constant.BE_URL + "api/project_management/subcontract_item";
  private subContractUpdateURL = Constant.BE_URL + "api/project_management/subcontract_update";
  private subContractAttachmentURL = Constant.BE_URL + "api/project_management/subcontract_attachment";
  private subContractDocURL = Constant.BE_URL + "api/project_management/subcontract_document";
  private subcontractPreItemsURL = Constant.BE_URL + "api/project_management/subcontract_pre_items";
  private createSubcontractNotesURL = Constant.BE_URL + "api/project_management/create_subcontract_notes";
  private createSubcontractPrelimsURL = Constant.BE_URL + "api/project_management/create_subcontract_prelims";
  private additionalSubcontractDocsURL = Constant.BE_URL + "api/project_management/additional_subcontract_docs";
  private updateSubcontractPrelimsURL = Constant.BE_URL + "api/project_management/update_subcontract_prelims";
  private deleteAdditionalDocsURL = Constant.BE_URL + "api/project_management/delete_additional_docs";
  private exportPDFURL = Constant.BE_URL + "api/project_management/subcontract_export_pdf";
  private exportExcelURL = Constant.BE_URL + "api/project_management/subcontract_export_excel";
  private noticeURL = Constant.BE_URL + "api/project_management/subcontract_notify";
  private sendBackURL = Constant.BE_URL + "api/project_management/subcontract_sendback";
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

  subContractTrackList(data) {
    return this.httpClient.post<any>(this.subcontractTrackingURL, data, this.httpOptions);
  }

  subContractTrackheaders(data) {
    return this.httpClient.post<any>(this.subcontractHeaderURL, data, this.httpOptions);
  }

  // subContractUpdateURL
  subContractUpdate(data) {
    return this.httpClient.post<any>(this.subContractUpdateURL, data, this.httpOptions);
  }

  // subContractAttachmentURL
  subContractAttachment(data) {
    return this.httpClient.post<any>(this.subContractAttachmentURL, data, this.fileHttpOptions);
  }

  // subContractDoc
  subContractDocument(data) {
    return this.httpClient.post<any>(this.subContractDocURL, data, this.httpOptions);
  }

  // subcontrac tPreItems
  subContractPreItems(data) {
    return this.httpClient.post<any>(this.subcontractPreItemsURL, data, this.httpOptions);
  }

  // create Subcontract Notes
  createSubcontractNotes(data) {
    return this.httpClient.post<any>(this.createSubcontractNotesURL, data, this.httpOptions);
  }

  // create Subcontract Prelims
  createSubcontractPrelims(data) {
    return this.httpClient.post<any>(this.createSubcontractPrelimsURL, data, this.httpOptions);
  }

  // additionalSubcontractDocsURL
  additionalSubcontractDocs(data) {
    return this.httpClient.post<any>(this.additionalSubcontractDocsURL, data, this.httpOptions);
  }

  // update_subcontract_prelims
  updateSubcontractPrelims(data) {
    return this.httpClient.post<any>(this.updateSubcontractPrelimsURL, data, this.httpOptions);
  }
  // deleteAdditionalDocsURL
  deleteAdditionalDocs(data) {
    return this.httpClient.post<any>(this.deleteAdditionalDocsURL, data, this.httpOptions);
  }

  // export pdf url
  exportSubcontractPDF(data) {
    return this.httpClient.post<any>(this.exportPDFURL, data, this.httpOptions);
  }

  // exportExcelURL
  exportSubcontractExcel(data) {
    return this.httpClient.post<any>(this.exportExcelURL, data, this.httpOptions);
  }

  //subcontract notify 
  subcontractNotify(data) {
    return this.httpClient.post<any>(this.noticeURL, data, this.httpOptions);
  }

  // sendBack URL
  subcontractSendBack(data) {
    return this.httpClient.post<any>(this.sendBackURL, data, this.httpOptions);
  }
}
