import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users:any = [];
  email:any = '';
  passwordGuId:any = '';
  projectId:any = '';
  

  constructor(private loginService: LoginService,private route: ActivatedRoute,private router:Router) 
  { 

    // redirect to punch list page  if already logged in
if (localStorage.getItem('token')) {
  this.router.navigate(['/project-management/punch_list']);
}
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.params.email;
    this.passwordGuId = this.route.snapshot.params.passwordGuId;
    this.projectId = this.route.snapshot.params.projectId;
    if(this.email && this.passwordGuId && this.projectId){
      this.loginUsingPasswordGuid();
    }
  }

  loginUsingPasswordGuid(): void {
    this.loginService.loginUsingPasswordGuid(this.email,this.passwordGuId,this.projectId)
    .pipe(first())
    .subscribe(
      data => {
        if (data['status']) {
          this.users = data['body'];
          localStorage.setItem('users', JSON.stringify(this.users));
          localStorage.setItem('token', this.users.token);
          
         this.router.navigate(['/project-management/punch_list']); //redirect to punch list page after login (Task1)
        } 
      }
    );
  }
}
