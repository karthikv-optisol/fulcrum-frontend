import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public usersData: any;
  constructor(private router: Router,) { }

  ngOnInit(): void {
    if (localStorage.getItem('users')) {
      this.usersData = JSON.parse(localStorage.getItem('users'));
    }
  }
  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('users');
    // localStorage.removeItem('token');
    // localStorage.removeItem('userid');
    // localStorage.removeItem('Arraysidemenu');
    //   localStorage.removeItem('currentlySelectedProjectId');
    localStorage.clear();
    localStorage.setItem('message', "1");
    this.router.navigate(['/login-form']);
}
get users() {
  if (localStorage.getItem('users')) {
    return JSON.parse(localStorage.getItem('users'));
  }
  
}
login()
  {
    this.router.navigate(['/login-form']);
  }
}
