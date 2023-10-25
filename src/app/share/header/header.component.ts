import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public usersData: any; 
  constructor( private router: Router,) { }
  
  ngOnInit(): void {
    if (localStorage.getItem('users')) 
    { 
      this.usersData = JSON.parse(localStorage.getItem('users')); 
    } 
  }

  get users() {
    if (localStorage.getItem('users')) {
    // console.log(localStorage.getItem('users'));
      return JSON.parse(localStorage.getItem('users'));
    }
    
  }
  logout() {
    localStorage.clear();
    localStorage.setItem('message', "1");
    this.router.navigate(['/login-form']);
}
supportpage() {
  this.router.navigate(['/help']);
}

}
