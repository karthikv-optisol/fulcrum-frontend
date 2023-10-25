import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trialsuccess',
  templateUrl: './trialsuccess.component.html',
  styleUrls: ['./trialsuccess.component.scss']
})
export class TrialsuccessComponent implements OnInit {

  constructor(private router: Router,private titleService: Title) {
    this.titleService.setTitle("SIGN UP SUCCESS- MyFulcrum.com");
   }
  

  ngOnInit(): void {
    
  }
  login() {
    this.router.navigate(['/login-form']);
  }

}
