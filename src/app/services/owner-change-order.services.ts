import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OwnerChangeOrderService {

    private COR_URL = Constant.BE_URL + "api/project_management/change_order";
    private COR_Info_URL = Constant.BE_URL + "api/project_management/change_order_info";
    private COR_OPTIONS_URL = Constant.BE_URL + "api/project_management/change_order_options";
    private COR_Attachment_URL = Constant.BE_URL + "api/project_management/change_order_attachments";
    private COR_Attachment_Remove_URL = Constant.BE_URL + "api/project_management/change_order_attachment_remove";
    private COR_Create_URL = Constant.BE_URL + "api/project_management/change_order_create";
    private COR_Update_URL = Constant.BE_URL + "api/project_management/change_order_update";
    private COR_RenderPDF_URL = Constant.BE_URL + "api/project_management/change_order_print_pdf";
    private COR_ViewPDF_URL = Constant.BE_URL + "api/project_management/change_order_view_pdf";
    private COR_CostCode_DEL_URL = Constant.BE_URL + "api/project_management/change_order_costcode_remove";

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

    getCORdata(data: any) {
        return this.httpClient.post<any>(this.COR_URL, data, this.httpOptions);
    }

    // COR_Info_URL
    getCORInfo(data: any) {
        return this.httpClient.post<any>(this.COR_Info_URL, data, this.httpOptions);
    }

    getCOROptions(data: any) {
        return this.httpClient.post<any>(this.COR_OPTIONS_URL, data, this.httpOptions);
    }

    setCORAttachments(data: any) {
        return this.httpClient.post<any>(this.COR_Attachment_URL, data, this.fileHttpOptions);
    }

    // COR_Attachment_Remove_URL
    CORAttachmentsRemove(data: any) {
        return this.httpClient.post<any>(this.COR_Attachment_Remove_URL, data, this.fileHttpOptions);
    }

    createCOR(data) {
        return this.httpClient.post<any>(this.COR_Create_URL, data, this.httpOptions);
    }
    // COR_Update_URL

    updateCOR(data) {
        return this.httpClient.post<any>(this.COR_Update_URL, data, this.httpOptions);
    }

    // COR_RenderPDF_URL
    renderPDF(data) {
        return this.httpClient.post<any>(this.COR_RenderPDF_URL, data, this.httpOptions);
    }

    // COR_ViewPDF_URL

    viewPDF(data)
    {
        return this.httpClient.post<any>(this.COR_ViewPDF_URL, data, this.httpOptions);
    }

    // COR_CostCode_DEL_URL
    ChangeCostCodeRemove(data) {
        return this.httpClient.post<any>(this.COR_CostCode_DEL_URL, data, this.httpOptions);
    }
}