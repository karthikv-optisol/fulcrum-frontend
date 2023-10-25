import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../share/helpers/match.validators';
import { RegisterService } from '../../services/register.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupTrail: FormGroup;
  submitted = false;
  showerror = false;
  error = '';
  showemailexistserror = false;
  public cap_orginal: string;
  constructor(private router: Router,private titleService: Title,private formBuilder: FormBuilder,private RegisterService: RegisterService, private loader: LoaderService) {
    this.titleService.setTitle("SIGN UP FOR FREE- MyFulcrum.com");
    let random  = Math.floor((Math.random() * 10000) + 1);
    this.cap_orginal = random.toString();
   }

  ngOnInit(): void {
    
   
    this.signupTrail = this.formBuilder.group({
      first_name: ['',[ Validators.required, Validators.maxLength(50),]],
      last_name: ['', [Validators.required,Validators.maxLength(50),]],
      email: ['', [Validators.required, Validators.email]],
      company:['', Validators.required],
      cap_match: ['', [Validators.required]],
      cap_org: ['',[Validators.required]],
      zip: ['', [Validators.required, Validators.maxLength(6)]],
    }, {
      validator: MustMatch('cap_org', 'cap_match')
  });
  }
  login() {
    this.router.navigate(['/login-form']);
  }
  // convenience getter for easy access to form fields 
  get f() { return this.signupTrail.controls; }
  captch()
  {
    let random    = Math.floor((Math.random() * 10000) + 1);
    this.cap_orginal = random.toString();
  }
  checkemailExists(event: any){
    this.RegisterService.checkEmailExist(event.target.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data['status']) {
            
            if(data['body']  == 1)
            {
              this.showemailexistserror = true;
            }
            else{
              this.showemailexistserror = false;
            }
           this.error = '';
          }
          else {
            this.error = data['body']['email'];
          }
        },
        error => {
          this.error = error;
        });
  }
  onSubmit() {
    
    this.submitted = true;
    this.loader.show();
    // stop here if form is invalid
    if (this.signupTrail.invalid) {
      this.loader.hide();
      this.showerror = true;
      window.setTimeout(()=>{
        this.showerror = false;
      }, 1500);
      return;
    }
    this.RegisterService.register(this.f.first_name.value,this.f.last_name.value,this.f.email.value,this.f.company.value,this.f.zip.value)
    .pipe(first())
    .subscribe(
      data => {
        this.loader.hide();
        if (data['status']) {
          this.router.navigate(['/trailsucess']);
        }
        else {
          this.error = data['body'];
        }
      },
      error => {
        this.error = error;
      });

  }
  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}


