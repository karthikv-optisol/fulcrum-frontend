import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    //private punchservice: PunchListService
) { }
  canActivate(): boolean {
    //if (this.punchservice.loggedIn()) {
      if (localStorage.getItem('token')) {
        // logged in so return true
        return true;
    }
    else{
      // not logged in so redirect to login page with the return url
    this.router.navigate(['/login-form']);
    return false;

    }

    
}
  
}
