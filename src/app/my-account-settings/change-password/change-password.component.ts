import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  currentlySelectedProjectName: any;
  user: any;
  currentPasswordError: any;
  passwordError: any;
  confirmPasswordError: any;
  successMessage: any;
  isPasswordDiv: boolean = false;
  changePasswordForm: any = FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private myAccountSettingsService: MyAccountSettingsService,
    ) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.createChangePasswordForm();
  }

  ngOnInit(): void {}

  createChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      email: [''],
      currentpassword: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(5)]],
    });
    if (this.user) {
      this.changePasswordForm.controls['email'].setValue(this.user.email);
    }
  }
  resetPasswordForm() {
    this.changePasswordForm.reset();
    this.currentPasswordError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
  }
  changePasswordDiv() {
    this.isPasswordDiv = ! this.isPasswordDiv
  }
  changePassword() {
    if (this.changePasswordForm.valid) {
      var formvalue = this.changePasswordForm.value;
      this.currentPasswordError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      if (formvalue.password == formvalue.confirmpassword) {
        this.confirmPasswordError = '';
        this.myAccountSettingsService
        .changePassword(this.changePasswordForm.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if(data.status ==false){
              this.currentPasswordError = data.body;
            }else{
              this.currentPasswordError = "";
              this.successMessage = "Your password was successfully updated.";
              this.isPasswordDiv = true;
              this.changePasswordForm.reset();
            }
          },
          (err: any) => {
            this.currentPasswordError = err;
          }
        );
      } else {
        this.currentPasswordError = 'Password and confirm password must match.';
      }
    } else {
      if (this.changePasswordForm.get('currentpassword').errors?.required) {
        this.currentPasswordError = 'Please enter a valid current password.';
      } else if (
        this.changePasswordForm.get('currentpassword').errors?.minlength
      ) {
        this.currentPasswordError =
          'Please enter a current password of five characters or more.';
      } else {
        this.currentPasswordError = '';
      }
      if (this.changePasswordForm.get('password').errors?.required) {
        this.passwordError = 'Please enter a valid new password.';
      } else if (this.changePasswordForm.get('password').errors?.minlength) {
        this.passwordError =
          'Please enter a new password of five characters or more.';
      } else {
        this.passwordError = '';
      }
      if (this.changePasswordForm.get('confirmpassword').errors?.required) {
        this.confirmPasswordError = 'Please enter a valid re-enter password.';
      } else if (
        this.changePasswordForm.get('confirmpassword').errors?.minlength
      ) {
        this.confirmPasswordError =
          'Please enter a re-enter password of five characters or more.';
      } else {
        this.confirmPasswordError = '';
      }
    }
  }
  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
}
