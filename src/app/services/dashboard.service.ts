import { Injectable } from '@angular/core';
import { map, timeout } from 'rxjs/operators';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import * as Constant from '../constant/constant';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardurl =  Constant.BE_URL+"api/dashboard/dashboard";
  private ViewOpenSubmittalurl =  Constant.BE_URL+"api/dashboard/ViewOpenSubmittal";
  private Viewallopenrfiurl=  Constant.BE_URL+"api/dashboard/ViewOpenRFI";
  private load_openSubmitalurl=  Constant.BE_URL+"api/dashboard/load_openSubmital";
  private load_openRFIurl=  Constant.BE_URL+"api/dashboard/load_openRFI";
  private Viewallusersurl =  Constant.BE_URL+"api/dashboard/ViewUsers";
  private load_userurl=  Constant.BE_URL+"api/dashboard/load_user";
  private closedsubmitaldataurl=  Constant.BE_URL+"api/dashboard/closedsubmitaldata";
  private closedrfidataurl=  Constant.BE_URL+"api/dashboard/ClosedRFI";
  private signupindexurl=  Constant.BE_URL+"api/dashboard/signupIndex";
  private projectmonthlyurl=  Constant.BE_URL+"api/dashboard/projectIndex";
  private customerHealthReporturl=  Constant.BE_URL+"api/dashboard/customerHealthReport";
  // DCR CHARTS CHANGES
  private dcrcharturl=  Constant.BE_URL+"api/dashboard/dcrReport";
  // DCR CHARTS CHANGES
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  currentlySelectedProjectId= localStorage.getItem('currentlySelectedProjectId');
   userRole = JSON.parse(localStorage.getItem('users'));
   pid: string;
  constructor(private route: ActivatedRoute,private httpClient: HttpClient) { 

    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
  });
  }
  
  closedsubmitaldata(period,is_viewall): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
      is_viewall:is_viewall,
  };

  return this.httpClient.post<any>(this.closedsubmitaldataurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
 
  // DCR CHARTS CHANGES
  dcrchart(period): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.dcrcharturl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  // DCR CHARTS CHANGES
  closedrfidata(period,is_viewall): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
      is_viewall:is_viewall,
  };

  return this.httpClient.post<any>(this.closedrfidataurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  ViewOpenSubmittal(user_id): Observable<any> {
    
    let data = {
     // user_id: user_id,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.ViewOpenSubmittalurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  load_openRFI(project_id): Observable<any> {
    
    let data = {
      project_id: project_id,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.load_openRFIurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  load_user(company_id): Observable<any> {
    
    let data = {
      company_id: company_id,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.load_userurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  load_openSubmital(project_id): Observable<any> {
    
    let data = {
      project_id: project_id,
      projectId:this.pid
  };

  return this.httpClient.post<any>(this.load_openSubmitalurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  Viewallopenrfi(user_id): Observable<any> {
    
    let data = {
     // user_id: user_id,
      projectId:this.pid
  };

  return this.httpClient.post<any>(this.Viewallopenrfiurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  Viewallusers(user_id): Observable<any> {
    
    let data = {
      //user_id: user_id,
      projectId:this.pid
  };

  return this.httpClient.post<any>(this.Viewallusersurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  getdashboarddetails(user_id): Observable<any> {
   
    let data = {
     // user_id: user_id,
      projectId:this.pid,
      userRole:this.userRole.userRole
  };

  return this.httpClient.post<any>(this.dashboardurl, data, this.httpOptions)
  .pipe(
    //timeout(5000),
    map(data => { return data; }) 
  );
  }

  signupindex(period): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.signupindexurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }

  projectmonthly(period): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
  };

  return this.httpClient.post<any>(this.projectmonthlyurl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
  customerHealthReport(period,customertype): Observable<any> {
    
    let data = {
      period: period,
      projectId:this.pid,
      type:customertype
  };

  return this.httpClient.post<any>(this.customerHealthReporturl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
}
