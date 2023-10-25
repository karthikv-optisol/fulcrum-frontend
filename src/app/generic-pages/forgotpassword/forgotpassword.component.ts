import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../share/helpers/match.validators';
import { first } from 'rxjs/operators';
import { RegisterService } from '../../services/register.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  frm_forgot_password: FormGroup;
  submitted = false;
  showerror = false;
  error = '';
  showemailexistserror = false;
  public capcha: string;
  
  constructor(private router: Router,private titleService: Title,private formBuilder: FormBuilder,private RegisterService: RegisterService, private loader: LoaderService) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.titleService.setTitle("Retrieve Your Account Password");
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
  

    this.capcha =text;
   }

  ngOnInit(): void {


   

    this.frm_forgot_password = this.formBuilder.group({
      first_element: ['', [Validators.required, Validators.email]],
      captcha_input: ['', [Validators.required]],
      captcha_original: ['', []]
      // password: ['', [Validators.required, Validators.minLength(5),
      // Validators.maxLength(40)]]
    }, {
      validator: MustMatch('captcha_original', 'captcha_input')
  });
  }
  
   // convenience getter for easy access to form fields
   get f() { return this.frm_forgot_password.controls; }
   checkemailExists(event: any){
     this.RegisterService.checkUserExist(event.target.value)
       .pipe(first())
       .subscribe(
         data => {
           if (data['status']) {
             //1 entered email already exists in db, 0 email doesnot exists in fulcrum db
             this.error = '';
             if(data['body']  == 1)
             {
               this.showemailexistserror = false;
             }
             else{
               this.showemailexistserror = true;
             }
           }
           else {
             this.error = data['body'];
           }
         },
         error => {
           this.error = error;
         });
   }

   refreshCaptcha()
  {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
     

    this.capcha =text;
   
  }

  onSubmit() {
    this.loader.show();
    this.submitted = true;


    if (this.frm_forgot_password.invalid) {
      this.loader.hide();
      this.showerror = true;
      this.showemailexistserror = false;
      return;
    }
   

    this.RegisterService.forgotpassword(this.f.first_element.value)
    .pipe(first())
    .subscribe(
      data => {
        this.loader.hide();
        if (data['status']) {
          
          this.router.navigate(['/password-retrieval-success']);
         // this.showemailexistserror = data['body'];
         
        }
        else {
          this.error = data['body'];
        }
      },
      error => {
        this.error = error;
      });

  }

}
