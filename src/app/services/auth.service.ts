import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as Constant from './../constant/constant';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users = JSON.parse(localStorage.getItem('users'));
  projectId = this.users['projectId'];
  private url =  Constant.BE_URL+"api/punchList/getAllPunchList?projectId="+this.projectId;
  constructor(private http:HttpClient) { }
}
