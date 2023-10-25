import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PunchListService } from './../services/punch-list.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private punchservice: PunchListService
) { }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
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
