import { Component, OnInit } from '@angular/core';
//import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
    //this.titleService.setTitle("Myfulcrum.com Construction Project Management Software");
   }

  ngOnInit(): void {
    
  }
  login() {
    this.router.navigate(['/login-form']);
  }
  register() {
    this.router.navigate(['/trialsignup']);
  }

}
