import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  private meetingTypeURL = Constant.BE_URL + "api/project_management/meeting_type";
  private meetingListURL = Constant.BE_URL + "api/project_management/meeting_list";
  private meetingTypeCreateURL = Constant.BE_URL + "api/project_management/createMeetingType";
  private meetingTypeDeleteURL = Constant.BE_URL + "api/project_management/deleteMeetingType";
  private meetingViewURL = Constant.BE_URL + "api/project_management/meeting_view";
  private loadMeetingDialogURL = Constant.BE_URL + "api/project_management/loadCreateMeetingDialog";
  private importMeetingTypeListURL = Constant.BE_URL + "api/project_management/meeting_type_template";
  private meetingDiscussionViewURL = Constant.BE_URL + "api/project_management/meeting_discussion_view";
  private meetingAssigneeListURL = Constant.BE_URL + "api/project_management/meeting_assignee";
  private manageMeetingLocationsListURL = Constant.BE_URL + "api/project_management/meeting_location";
  private manageMeetingLocationsCreateURL = Constant.BE_URL + "api/project_management/meeting_location_create";
  private manageMeetingLocationsDeleteURL = Constant.BE_URL + "api/project_management/meeting_location_delete";
  private newDiscussionItemsURL = Constant.BE_URL + "api/project_management/meeting/importDiscussionItems";
  // private newmeetingidCreateURL = "../../../assets/JSON/meetingid-create.json";
  private newmeetingidCreateURL = Constant.BE_URL + "api/project_management/meeting/loadImportDiscussionOptionsWindow";
  private newCreateMeeting = Constant.BE_URL + "api/project_management/createMeeting";
  private editMeetingURL = Constant.BE_URL + "api/project_management/meeting/editMeetingItems";
  private getAllRolesOfProjectContactsURL = Constant.BE_URL + "api/project_management/meeting/email/projectContactsFilteredbyRole";
  private getContactForRoleURL = Constant.BE_URL + "api/project_management/meeting/email/addContactsWithRoleToSelectedList";
  private addMeetingAttendeesToListURL = Constant.BE_URL + "api/project_management/meeting/email/addMeetingAttendeesToList";
  private addProjectContactsToListURL = Constant.BE_URL + "api/project_management/meeting/email/addProjectContactsToList";
  private searchForUserCompanyContactsByCompanyTextOrContactTextURL = Constant.BE_URL + "api/project_management/meeting/email/searchForUserCompanyContactsByCompanyTextOrContactText";
  private createDiscussionItemURL = Constant.BE_URL + "api/project_management/meeting/createDiscussionItem";
  private editDiscussionItemURL = Constant.BE_URL + "api/project_management/meeting/editSingleDiscussionItem";
  private editDiscussionItemsURL = Constant.BE_URL + "api/project_management/meeting/editDiscussionItems";
  private DiscussionDropDownURL = Constant.BE_URL + "api/project_management/meeting/createDiscussionItemDropdowns";
  private sendEmailToSelectedRecipientsURL = Constant.BE_URL + "api/project_management/meeting/email/send-email";
  private createActionItemURL = Constant.BE_URL + "api/project_management/meeting/createActionItem";
  private deleteActionItemURL = Constant.BE_URL + "api/project_management/meeting/deleteActionItem";
  private saveCommentsURL = Constant.BE_URL + "api/project_management/meeting/createDiscussionItemComment";
  private deleteDiscussionItemCommentURL = Constant.BE_URL + "api/project_management/meeting/deleteDiscussionItemComment";
  private deleteDiscussionItemURL = Constant.BE_URL + "api/project_management/meeting/deleteDiscussionItem";
  private printMeetingURL = Constant.BE_URL + "api/project_management/meeting/printMeeting";
  private renderMeetingPDFURL = Constant.BE_URL + "api/project_management/render_meeting_pdf";
  private deleteMeetingItemURL = Constant.BE_URL + "api/project_management/meeting/deleteMeetingItem";
  
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

  loadMeetingTypes(): Observable<any> {
    let data = {
      projectId: this.pid
    };
    return this.httpClient
      .post<any>(this.meetingTypeURL, data, this.httpOptions);
  }

  loadMeetingList(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_type_id: inputData.meeting_type_id
    };
    return this.httpClient
      .post<any>(this.meetingListURL, data, this.httpOptions);
  }

  createMeetingType(inputData): Observable<any> {
    // let data = {
    //   projectId: this.pid,
    //   meeting_name: inputData.meeting_name
    // };
    return this.httpClient
      .post<any>(this.meetingTypeCreateURL, inputData, this.httpOptions);
  }

  deleteMeetingType(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      scenarioName: inputData.scenarioName,
      uniqueId: inputData.uniqueId
    };
    return this.httpClient
      .post<any>(this.meetingTypeDeleteURL, data, this.httpOptions);
  }

  getMeetingDetails(inputData: any): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_id: inputData.meeting_id,
      meeting_type_id: inputData.meeting_type_id
    };
    return this.httpClient
      .post<any>(this.meetingViewURL, data, this.httpOptions);
  }

  loadCreateMeetingDialog(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_type_id: inputData.meeting_type_id,
      user_company_id: this.user_company_id
    };
    return this.httpClient
      .post<any>(this.loadMeetingDialogURL, data, this.httpOptions);
  }

  importMeetingTypeList(): Observable<any> {
    let data = {
      projectId: this.pid
    };
    return this.httpClient
      .post<any>(this.importMeetingTypeListURL, data, this.httpOptions);
  }

  meetingDiscussionView(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_id: inputData.meeting_id,
      showAll: inputData.showAll,
      meeting_type_id: inputData.meeting_type_id
    };
    return this.httpClient
      .post<any>(this.meetingDiscussionViewURL, data, this.httpOptions);
  }

  meetingAssigneeList(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_id: inputData.meeting_id,
      meeting_type_id: inputData.meeting_type_id
    };
    return this.httpClient
      .post<any>(this.meetingAssigneeListURL, data, this.httpOptions);
  }

  manageMeetingLocationsList() {
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id
    };
    return this.httpClient
      .post<any>(this.manageMeetingLocationsListURL, data, this.httpOptions);
  }

  manageMeetingLocationsCreate(inputData: any) {
    let data = {
      projectId: this.pid,
      meeting_location: inputData.meeting_location,
      user_company_id: this.user_company_id
    };
    return this.httpClient
      .post<any>(this.manageMeetingLocationsCreateURL, data, this.httpOptions);
  }

  manageMeetingLocationsDelete(inputData: any) {
    let data = {
      projectId: this.pid,
      location_id: inputData.location_id,
      user_company_id: this.user_company_id
    };
    return this.httpClient
      .post<any>(this.manageMeetingLocationsDeleteURL, data, this.httpOptions);
  }
  /*meeting id*/
  meetingID(data: any) {
    return this.httpClient.post<any>(this.newmeetingidCreateURL, data, this.httpOptions);
  }

  //load discussion dropdown
  loadDiscussionDropdown(): Observable<any> {
    let data = {
      projectId: this.pid
    };
    return this.httpClient
      .post<any>(this.DiscussionDropDownURL, data, this.httpOptions);
  }

  // createDiscussionItemURL
  createDiscussionItem(data: any) {
    return this.httpClient
      .post<any>(this.createDiscussionItemURL, data, this.httpOptions);
  }

  // editDiscussionItemURL
  editDiscussionItem(data: any) {
    return this.httpClient
      .post<any>(this.editDiscussionItemURL, data, this.httpOptions);
  }
  //editDiscussionItemsURL
  editAllDiscussionItems(data: any) {
    return this.httpClient
      .post<any>(this.editDiscussionItemsURL, data, this.httpOptions);
  }

  //
  newDiscussionItems(data: any) {
    if (data) {
      let datas = {
        "meeting_id": data.meeting_id,
        "previous_meeting_id": data.prev_meetingid,
        "importType": data.importType,
        "projectId": this.pid,
        "currentlyActiveContactId": this.parseduser.currentlyActiveContactId,
        "currentlySelectedProjectId": this.pid,
        "currentlySelectedProjectUserCompanyId": this.parseduser.currentlySelectedProjectUserCompanyId
      }
      console.log("id", datas);
      return this.httpClient.post<any>(this.newDiscussionItemsURL, datas, this.httpOptions);
    } else {
      console.log("Not validated")
    }
  }
  //cfeate Meeting
  newMeetingDataSend(meetingdata: any) {
    return this.httpClient.post<any>(this.newCreateMeeting, meetingdata, this.httpOptions);
  }
  //edit meeting 
  editMeetingdatasend(meetingdata: any) {
    return this.httpClient.post<any>(this.editMeetingURL, meetingdata, this.httpOptions);
  }

  getAllRolesOfProjectContacts(): Observable<any> {
    let data = {
      projectId: this.pid,
    }
    return this.httpClient.post<any>(this.getAllRolesOfProjectContactsURL, data, this.httpOptions);
  }

  getContactForRole(roleId: number): Observable<any> {
    let data = {
      projectId: this.pid,
      role: roleId
    }

    return this.httpClient.post<any>(this.getContactForRoleURL, data, this.httpOptions);
  }

  addMeetingAttendeesToList(meeting_id: number): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_id
    }
    return this.httpClient.post<any>(this.addMeetingAttendeesToListURL, data, this.httpOptions);
  }

  addProjectContactsToList(meeting_type_id: number): Observable<any> {
    let data = {
      projectId: this.pid,
      meeting_type_id
    }
    return this.httpClient.post<any>(this.addProjectContactsToListURL, data, this.httpOptions);
  }

  searchForUserCompanyContactsByCompanyTextOrContactText() {
    let data = {
      projectId: this.pid,
    }
    return this.httpClient.post<any>(this.searchForUserCompanyContactsByCompanyTextOrContactTextURL, data, this.httpOptions);
  }

  sendEmailToSelectedRecipients(params: object) {
    let data = {
      projectId: this.pid,
      ...params
    }

    return this.httpClient.post<any>(this.sendEmailToSelectedRecipientsURL, data, this.httpOptions);

  }

  createActionItem(data: any) {
    return this.httpClient.post<any>(this.createActionItemURL, data, this.httpOptions);
  }

  deleteActionItem(data) {
    return this.httpClient.post<any>(this.deleteActionItemURL, data, this.httpOptions);
  }
  createActionComment(data: any) {
    return this.httpClient.post<any>(this.saveCommentsURL, data, this.httpOptions);
  }

  deleteDiscussionItemComment(data: any) {
    // deleteDiscussionItemCommentURL
    return this.httpClient.post<any>(this.deleteDiscussionItemCommentURL, data, this.httpOptions);
  }
  // deleteDiscussionItem
  deleteDiscussionItem(data:any) {
    return this.httpClient.post<any>(this.deleteDiscussionItemURL, data, this.httpOptions);
  }

  renderMeetingPDF(params) {
    let data = {
      projectId: this.pid,
      ...params
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });

    return this.httpClient.post<Blob>(this.renderMeetingPDFURL, data, {
      headers: headers,
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  printMeeting(params) {
    let data = {
      projectId: this.pid,
      ...params
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });

    return this.httpClient.post<Blob>(this.printMeetingURL, data, {
      // headers: headers,
      // responseType:  'arraybuffer',
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  deleteMeetingRecord(params){
    let data = {
      projectId: this.pid,
      ...params
    }
    return this.httpClient.post<any>(this.deleteMeetingItemURL, data, this.httpOptions);
  }

}
