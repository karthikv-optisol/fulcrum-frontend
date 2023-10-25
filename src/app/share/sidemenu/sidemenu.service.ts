import { map } from 'rxjs/operators';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import * as Constant from '../../constant/constant';
import { Observable } from 'rxjs';import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  private projectlisturl=  Constant.BE_URL+"api/navigation/projectList";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  projectId: number;
  user_id: number;
  user_company_id: number;
  primary_contact_id: number;
  constructor(private httpClient: HttpClient) { }

  navigationprojectlist(users): Observable<any> {
    let users_data = JSON.parse( users);
   this.projectId=users_data.currentlySelectedProjectId;
   this.user_company_id=users_data.user_company_id;
   this.user_id=users_data.id;
   this.primary_contact_id=users_data.currentlyActiveContactId;
    let data = {
      projectId: this.projectId,
      user_company_id: this.user_company_id,
      user_id: this.user_id,
      primary_contact_id: this.primary_contact_id,
  };

  return this.httpClient.post<any>(this.projectlisturl, data, this.httpOptions)
  .pipe(
    map(data => { return data; }) 
  );
  }
}
