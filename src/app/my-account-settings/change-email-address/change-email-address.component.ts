import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';

@Component({
  selector: 'app-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss'],
})
export class ChangeEmailAddressComponent implements OnInit {
  currentlySelectedProjectName: any;
  commonError: any;
  successMessage: any;
  emailError: any;
  confirmEmailError: any;
  passwordError: any;
  user: any;
  users: any = [];
  message: any = false;
  pid: string;
  Arraysidemenu: any = [];
  public changeEmailForm: any = FormGroup;
  constructor(
    private myAccountSettingsService: MyAccountSettingsService,
    private formBuilder: FormBuilder
  ) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.createChangeEmailForm();
  }

  ngOnInit(): void {}

  createChangeEmailForm() {
    this.changeEmailForm = this.formBuilder.group({
      currentemail: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      confirmemail: ['', [Validators.required,Validators.email]],
    }
    );
    if(this.user){
      this.changeEmailForm.controls['currentemail'].setValue(this.user.email);
    }
  }

  resetPasswordForm() {
    this.changeEmailForm.controls['password'].setValue('');
    this.changeEmailForm.controls['email'].setValue('');
    this.changeEmailForm.controls['confirmemail'].setValue('');
  
    this.confirmEmailError = '';
    this.passwordError = '';
    this.emailError = '';
  }

  changeEmailAddress() {
    this.user = JSON.parse(localStorage.getItem('users'));
    if(this.user){
      this.changeEmailForm.controls['currentemail'].setValue(this.user.email);
    }
    if (
      this.changeEmailForm.valid
    ) {
      var formvalue = this.changeEmailForm.value;
      if(formvalue.email == formvalue.confirmemail){
        this.commonError = '';
        this.emailError = '';
        this.confirmEmailError = '';
        this.passwordError = '';
        this.myAccountSettingsService
        .changeEmailAddress(this.changeEmailForm.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if(data.status ==false){
              this.commonError = data.body;
            }else{
              this.users = data['body'];
              localStorage.removeItem("users");
              localStorage.removeItem("token");
              localStorage.removeItem("userid");
              localStorage.setItem('users', JSON.stringify(this.users));
              localStorage.setItem('token', this.users.token);            
              localStorage.setItem('userid', this.users.id);
              this.changeEmailForm.controls['currentemail'].setValue(this.users.email);
              this.user = JSON.parse(localStorage.getItem('users'));
              this.commonError = "";
              this.successMessage = "Your email was successfully updated.";
              this.resetPasswordForm();
            }
          },
          (err: any) => {
            this.commonError = err;
          }
        );
      }else{
        this.emailError = 'Email and confirm email must match.';
      }
      
    } else {
      if(this.changeEmailForm.get('email').errors?.required){
        this.emailError = 'Please enter a email address.';
      }else if(this.changeEmailForm.get('email').errors?.email){
        this.emailError = 'Please enter a valid email address.';
      }else{
        this.emailError = '';
      }
      if(this.changeEmailForm.get('confirmemail').errors?.required){
        this.confirmEmailError = 'Please re-enter your new email address.';
      }else if(this.changeEmailForm.get('confirmemail').errors?.email){
        this.confirmEmailError = 'Please enter a valid confirm email address.';
      }else{
        this.confirmEmailError = '';
      }
      if(this.changeEmailForm.get('password').errors?.required){
      this.passwordError = 'Please enter a valid password.';
      }
    }
  }
  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
}
