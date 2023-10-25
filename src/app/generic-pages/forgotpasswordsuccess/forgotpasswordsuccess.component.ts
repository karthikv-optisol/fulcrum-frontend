import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-forgotpasswordsuccess',
  templateUrl: './forgotpasswordsuccess.component.html',
  styleUrls: ['./forgotpasswordsuccess.component.scss']
})
export class ForgotpasswordsuccessComponent implements OnInit {

  constructor(private router: Router,private titleService: Title,) {

    this.titleService.setTitle("Retrieve Your Account Password");
   }
  
  ngOnInit(): void {
    
  }
  login() {
    this.router.navigate(['/login-form']);
  }
  forgotpwd()
  {
    this.router.navigate(['/password-retrieval-form']);
  }
}
