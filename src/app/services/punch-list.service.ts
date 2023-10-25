import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Constant from '../constant/constant';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PunchListService {
  users:string|null = JSON.parse(localStorage.getItem('users'));
  projectId = '';
  url= '';
  pid: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*', })
  };
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { 

    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
    });
  }

  getServicePunchLists(offset,limit,search,pid): Observable<any> {
    if(this.users)
  {
    
     this.projectId = this.users['projectId'];
   
     this.url =  Constant.BE_URL+"api/punchList/getAllPunchList?projectId="+ pid+"&offset="+offset+"&limit="+limit+"&search="+search;
  
  
  }
    return this.httpClient.get<any>(this.url, this.httpOptions)
    .pipe(
      map(data => { return data; })
    );
  }

  showPunchitem(punch_id): Observable<any> {
    if(this.users)
  {
    
    
    this.projectId = this.pid;
     this.url =  Constant.BE_URL+"api/punchList/showpunchitemAttach";
     let data = {
      punch_id: punch_id,
      projectId:this.projectId,
    };
    return this.httpClient.post<any>(this.url, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  
  }
   
  }
  loggedIn()
  {
    
    return !!localStorage.getItem('token');
  }
}
