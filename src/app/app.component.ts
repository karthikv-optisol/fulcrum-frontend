import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fulcrum-frontend';
  showHeader: boolean = true;
  stylesLoaded: boolean = false;
  user: boolean = false;
  timeoutId;
  userInactive: Subject<any> = new Subject();
  constructor(
    private titleService: Title, private router: Router, public modalService: NgbModal) {
    if (localStorage.getItem('users')) {
      this.checkTimeOut();
      this.userInactive.subscribe((message) => {
      
        this.modalService.dismissAll(message)
        
        localStorage.clear();
        this.router.navigate(['/login-form']);
      }
      );
    }


  }
  @HostListener('document:keypress', ['$event'])
  keyPress(event: KeyboardEvent): void {
    if (localStorage.getItem('users')) {
      clearTimeout(this.timeoutId);
      this.checkTimeOut();
    }
  }
  checkTimeOut() {

    this.timeoutId = setTimeout(
      //3,600,000 -> 1 hr

      () => this.userInactive.next("User has been inactive for 1hour"), 3600000
    );


  }
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    if (localStorage.getItem('users')) {

      clearTimeout(this.timeoutId);

      this.checkTimeOut();
    }

  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {

    if (localStorage.getItem('users')) {
      clearTimeout(this.timeoutId);

      this.checkTimeOut();
    }
  }
  @HostListener('document:mousemove', ['$event'])
  onMousMove(event) {
    if (localStorage.getItem('users')) {

      clearTimeout(this.timeoutId);

      this.checkTimeOut();
    }
  }

  // @HostListener('document:keydown')
  // @HostListener('document:mousemove')
  // checkUserActivity() {

  //   clearTimeout(this.timeoutId);

  //   this.checkTimeOut();
  // }
  ngAfterViewChecked() {
    this.stylesLoaded = true;
  }
  ngOnInit() {
    // listenging to routing navigation event
    if (localStorage.getItem('users')) {
      this.user = true;
      this.router.events.subscribe(event => this.modifyHeader(event));
    }
  }

  modifyHeader(location) {

    if (this.router.url.indexOf('/dashboard') > -1 || this.router.url.indexOf('/project-management/punch_list') > -1 ||

      this.router.url.indexOf('/modules-file-manager-file-browser') > -1 ||
      this.router.url.indexOf('/project-management/modules-gc-budget-form') > -1 ||
      this.router.url.indexOf('/modules-report-form') > -1 || this.router.url.indexOf('/my_account_setting') > -1 || this.router.url.indexOf('/global_admin') > -1) {
      this.showHeader = true;
    } else {
      this.showHeader = false;
    }



  }

  get users() {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }

  }
}
