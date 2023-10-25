import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../login/login.service';
import { Title } from '@angular/platform-browser';
// import { SidemenuComponent } from '../share/sidemenu/sidemenu.component';
// import { ShareService } from '../share/share.service';
@Component({
  selector: 'app-login1',
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.scss']
})
export class Login1Component implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  users: any = [];
  message: any = false;
  pid: string;
  Arraysidemenu: any = [];
  getprojectmanagementmodules: any;
  is_projectmanagement: any;
  constructor(private loginService: LoginService, private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,private titleService: Title
  ) {
    this.titleService.setTitle("Myfulcrum.com Construction Project Management Software");
    this.message = localStorage.getItem('message');
    // redirect to punch list page  if already logged in
    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
  });
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard'],
      { queryParams: { pid:this.pid } });
    }
    localStorage.clear();
  }

  ngOnInit(): void {
    
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
      // password: ['', [Validators.required, Validators.minLength(5),
      // Validators.maxLength(40)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    localStorage.removeItem('message');
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  forgotpwd()
  {
    this.router.navigate(['/password-retrieval-form']);
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loginService.loginUsingEmailPassword(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data['status']) {
            this.users = data['body'];
            this.Arraysidemenu = data['body']['sidemenu'];
            this.getprojectmanagementmodules = data['body']['getprojectmanagementmodules'];
            this.is_projectmanagement = data['body']['is_projectmanagement']; 
            // localStorage.setItem('is_projectmanagement', this.is_projectmanagement);
            // localStorage.setItem('getprojectmanagementmodules', JSON.stringify(this.getprojectmanagementmodules));
            // localStorage.setItem('Arraysidemenu', JSON.stringify(this.Arraysidemenu));
            localStorage.setItem('users', JSON.stringify(this.users));
            localStorage.setItem('token', this.users.token);            
            localStorage.setItem('userid', this.users.id);
            localStorage.setItem('currentlySelectedProjectId', this.users.currentlySelectedProjectId);
         
            localStorage.removeItem('message');
            this.router.navigate(['/dashboard'],
            { queryParams: { pid:btoa(this.users.currentlySelectedProjectId) 
            
            } }); //redirect to dashboard page after login 
          }
          else {
            localStorage.removeItem('message');
            this.error = data['body'];
            this.loading = false;
          }
        },
        error => {
          localStorage.removeItem('message');
          this.error = error;
          this.loading = false;
        });


  }

  
}
