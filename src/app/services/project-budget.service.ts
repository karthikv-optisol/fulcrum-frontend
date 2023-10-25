import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from './../constant/constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProjectBudgetService {
  private projectbudgeturl=  Constant.BE_URL+"api/project_management/modules-gc-budget-form";
  private loadcostcodesurl=  Constant.BE_URL+"api/project_management/loadcostcodes";
  private loadimportbiddersdropdown=  Constant.BE_URL+"api/project_management/loadimportbiddersdropdown";
  private loadimportbiddersurl=  Constant.BE_URL+"api/project_management/loadimportbidders";
  private importselectedbiddersurl=  Constant.BE_URL+"api/project_management/importselectedbidders";
  private loadRequestBudgetNumberURL=  Constant.BE_URL+"api/project_management/loadrequestbudgetnumber";
  private loadUploadFilesByCompanyURL=  Constant.BE_URL+"api/project_management/loaduploadfilesbycompany";
  private updateSubcontractorBidDocumentFileUploaderURL=  Constant.BE_URL+"api/project_management/updatesubcontractorbiddocumentfileuploader";
  private updateBidderListReportURL=  Constant.BE_URL+"api/project_management/updatebidderlistreport";
  private getSubcontractorBidStatusURL=  Constant.BE_URL+"api/project_management/getsubcontractorbidstatus";
  private updateEmailBiddersListURL=  Constant.BE_URL+"api/project_management/updateemailbidderslist";
  private loadmastercodeurl=  Constant.BE_URL+"api/project_management/managegccostCodesdialog";
  private updateCostDivisionURL = Constant.BE_URL+"api/project_management/updateCostCodeDivision";
  private deleteCostDivisionURL = Constant.BE_URL+"api/project_management/deleteCostCodeDivision";
  private updateCostCodeDividerURL = Constant.BE_URL+"api/project_management/updateCostCodeDivider";
  private createCostCodeURL = Constant.BE_URL+"api/project_management/createCostCode";
  private createCostCodeDivisionURL = Constant.BE_URL+"api/project_management/createCostCodeDivision";
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
  loadImportCostCodesIntoBudgetDialog(importFromProjectId): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'loadImportCostCodesIntoBudgetDialog',
      importFromProjectId: importFromProjectId,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  loadManageMasterCodeListDialog(importFromProjectId): Observable<any> {
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      CurrentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
        cost_code_type_id:importFromProjectId
    };

    return this.httpClient
      .post<any>(this.loadmastercodeurl, data, this.httpOptions)
      // .pipe(
      //   map((data) => {
      //     return data;
      //   })
      // );
  }

  
  updateCostCodeDivision(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      CurrentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
        cost_code_type_id:inputData.cost_code_type_id,
        division_number: inputData.division_number,
        attribute_subgroup_name: inputData.attribute_subgroup_name,
        newValue: inputData.newValue,
        attributeName: inputData.attributeName,
        uniqueId: inputData.uniqueId
    };

    return this.httpClient
      .post<any>(this.updateCostDivisionURL, data, this.httpOptions)
  }

  deleteCodeDivision(inputData): Observable<any> {
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      CurrentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
        cost_code_type_id:inputData.cost_code_type_id,
        division_number: inputData.division_number,
        attribute_subgroup_name: inputData.attribute_subgroup_name,
        uniqueId: inputData.uniqueId
    };

    return this.httpClient
      .post<any>(this.deleteCostDivisionURL, data, this.httpOptions)
  }

  updateCostCodeDivider(inputData){
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      divider_id: inputData.divider_id
    };

    return this.httpClient
      .post<any>(this.updateCostCodeDividerURL, data, this.httpOptions)
  }

  createCostCodeDivision(inputData){
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      cost_code_type_id: inputData.cost_code_type_id,
      division_number:inputData.division_number,
      division_code_heading:inputData.division_code_heading,
      division:inputData.division,
      division_abbreviation:inputData.division_abbreviation
    };

    return this.httpClient
      .post<any>(this.createCostCodeDivisionURL, data, this.httpOptions)
  }

  createCostCode(inputData){
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      cost_code_division_id:inputData.cost_code_division_id,
      cost_code:inputData.cost_code,
      cost_code_description:inputData.cost_code_description,
      cost_code_description_abbreviation: inputData.cost_code_description_abbreviation
    };

    return this.httpClient
      .post<any>(this.createCostCodeURL, data, this.httpOptions)
  }

  getMasterCodeList(getjson: any): Observable<any> {
      return this.httpClient.get(getjson)
  }

  updateIsSubtotal(is_subtotal): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updateIsSubtotal',
      importFromProjectId: -1,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      is_subtotal: is_subtotal,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  loadSubmittalDelayDATA(budget_id, cost_code_id): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'SubmittaldelayDatas',
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      cost_code_id: cost_code_id,
      budget_id: budget_id,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  loadSubcontractCODATA(cost_code_id,project_id,budget_id,subcontract_id): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'SubcontractChangeOrderDatas',
      user_company_id: this.user_company_id,
      // currentlySelectedProjectUserCompanyId:
      //   this.currentlySelectedProjectUserCompanyId,
      cost_code_id: cost_code_id,
      budget_id: budget_id,subcontract_id:subcontract_id
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateNotes(budget_id, newValue): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updateNotes',
      importFromProjectId: -1,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      newValue: newValue,
      budget_id: budget_id,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updatePurchasingTarget(budget_id, newValue): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updatePurchasingTarget',
      importFromProjectId: -1,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      newValue: newValue,
      budget_id: budget_id,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  LoadimportCostCodesIntoBudget(method, csvCostCodeIds): Observable<any> {
    let data = {
      projectId: this.pid,
      method: method,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      csvCostCodeIds: csvCostCodeIds,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateAttributes(
    budget_id,
    newValue,
    attributeSubgroupName
  ): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updateAttributes',
      importFromProjectId: -1,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      newValue: newValue,
      budget_id: budget_id,
      attributeSubgroupName: attributeSubgroupName,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateAllIsDcrFlag(project_id, updateData): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updateAllIsDcrFlag',
      user_company_id: this.user_company_id,
      updateData: updateData,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  deleteGcBudgetLineItem(uniqueId): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'deleteGcBudgetLineItem',
      user_company_id: this.user_company_id,
      uniqueId: uniqueId,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  updateIsDcrFlag(id, updateData): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'updateIsDcrFlag',
      user_company_id: this.user_company_id,
      updateData: updateData,
      attributeId: id,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  NotesData(budget_id): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'NotesData',
      importFromProjectId: -1,
      user_company_id: this.user_company_id,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
      budget_id: budget_id,
    };

    return this.httpClient
      .post<any>(this.loadcostcodesurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  FetchProjectBudgetDetails(
    order_by_attribute,
    order_by_direction,
    scheduledValuesOnly,
    needsBuyOutOnly,
    needsSubValue
  ): Observable<any> {
    if (scheduledValuesOnly == '' || scheduledValuesOnly == undefined) {
      scheduledValuesOnly = false;
    }
    if (needsBuyOutOnly == '' || needsBuyOutOnly == undefined) {
      needsBuyOutOnly = false;
    }
    if (needsSubValue == '' || needsSubValue == undefined) {
      needsSubValue = false;
    }
    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,

      currentlyActiveContactId: this.currentlyActiveContactId,
      userRole: this.userRole.userRole,
      order_by_attribute: order_by_attribute,
      order_by_direction: order_by_direction,
      scheduledValuesOnly: scheduledValuesOnly,
      needsBuyOutOnly: needsBuyOutOnly,
      needsSubValue: needsSubValue,
      is_subtotal: '',
    };

    return this.httpClient
      .post<any>(this.projectbudgeturl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  loadImportBiddersDropDown(): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'loadImportBiddersDropDown',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.loadimportbiddersdropdown, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  loadRequestBudgetNumber(): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'loadRequestBudgetNumber',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.loadRequestBudgetNumberURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  loadUploadFilesByCompany(): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'loadUploadFilesByCompany',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.loadUploadFilesByCompanyURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  loadImportBiddersSelect(
    import_type: any,
    select_project_id: any
  ): Observable<any> {
    let data = {
      projectId: this.pid,
      import_type: import_type,
      select_project_id: select_project_id,
      method: 'loadImportBidders',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.loadimportbiddersurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  importSelectedBidders(arrCheckedBidders: any): Observable<any> {
    let data = {
      projectId: this.pid,
      arrCheckedBidders: arrCheckedBidders,
      method: 'importSelectedBidders',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.importselectedbiddersurl, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateSubcontractorBidDocumentFileUploader(
    gc_budget_line_item_id: any,
    subcontractor_bid_id: any
  ): Observable<any> {
    let data = {
      projectId: this.pid,
      gc_budget_line_item_id: gc_budget_line_item_id,
      subcontractor_bid_id: subcontractor_bid_id,
      method: 'updateSubcontractorBidDocumentFileUploader',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(
        this.updateSubcontractorBidDocumentFileUploaderURL,
        data,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getSubcontractorBidStatus(): Observable<any> {
    let data = {
      projectId: this.pid,
      method: 'getSubcontractorBidStatus',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.getSubcontractorBidStatusURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateBidderListReport(ddlStatus: any, ddlSortBy: any): Observable<any> {
    let data = {
      projectId: this.pid,
      ddlStatus: ddlStatus,
      ddlSortBy: ddlSortBy,
      method: 'updateBidderListReport',
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.currentlySelectedProjectId,
      currentlySelectedProjectUserCompanyId:
        this.currentlySelectedProjectUserCompanyId,
    };
    return this.httpClient
      .post<any>(this.updateBidderListReportURL, data, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateEmailBiddersList(ddlStatus:any): Observable<any> 
  {
   let data = {
     projectId: this.pid,
     ddlStatus: ddlStatus,
     method:'updateBidderListReport',
     user_company_id: this.user_company_id,
     currentlySelectedProjectId : this.currentlySelectedProjectId,
     currentlySelectedProjectUserCompanyId:this.currentlySelectedProjectUserCompanyId,
   };
   return this.httpClient.post<any>(this.updateEmailBiddersListURL, data, this.httpOptions)
     .pipe(
       map(data => { return data; })
     );
  }

}
