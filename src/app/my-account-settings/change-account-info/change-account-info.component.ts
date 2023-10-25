import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';

@Component({
  selector: 'app-change-account-info',
  templateUrl: './change-account-info.component.html',
  styleUrls: ['./change-account-info.component.scss'],
})
export class ChangeAccountInfoComponent implements OnInit {
  currentlySelectedProjectName: any;
  changeAccountInfoForm: any = FormGroup;
  commonError: any;
  user: any;
  userName: any;
  users: any;
  getValues: any;
  emailError: string;
  passwordError: string;
  successMessage: string;
  constructor(
    private formBuilder: FormBuilder,
    private myAccountSettingsService: MyAccountSettingsService
  ) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.userName = this.user.email;
    this.accountInfoFormValue();
    this.getAccountInfoFormValue();
  }

  ngOnInit(): void {}

  getAccountInfoFormValue() {
    this.myAccountSettingsService
      .getAccountInfoFormValue(this.user)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            this.commonError = data.body;
          } else {
            this.getValues = data.body;
            this.commonError = '';
            this.setAccountInfoFormValue();
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }
  accountInfoFormValue() {
    this.changeAccountInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      first_name: [''],
      last_name: [''],
      address_line_1: [''],
      address_line_2: [''],
      address_line_3: [''],
      address_city: [''],
      address_state: [''],
      address_zip: [''],
      address_country: [''],
      website: [''],
      title: [''],
      company_name: [''],
    });
  }

  setAccountInfoFormValue() {
    this.changeAccountInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      first_name: [this.getValues.first_name],
      last_name: [this.getValues.last_name],
      address_line_1: [this.getValues.address_line_1],
      address_line_2: [this.getValues.address_line_2],
      address_line_3: [this.getValues.address_line_3],
      address_city: [this.getValues.address_city],
      address_state: [this.getValues.address_state],
      address_zip: [this.getValues.address_zip],
      address_country: [this.getValues.address_country],
      website: [this.getValues.website],
      title: [this.getValues.title],
      company_name: [this.getValues.company_name],
    });
  }

  resetPasswordForm() {
    this.commonError="";
    this.emailError="";
    this.passwordError="";
    this.successMessage="";
    this.setAccountInfoFormValue();
  }

  changeAccountInfo() {
    this.user = JSON.parse(localStorage.getItem('users'));
    if (this.user) {
      this.changeAccountInfoForm.controls['email'].setValue(this.user.email);
    }
    if (this.changeAccountInfoForm.valid) {
      var formvalue = this.changeAccountInfoForm.value;
      this.commonError = '';
      this.emailError = '';
      this.passwordError = '';
      this.myAccountSettingsService
        .changeAccountInfo(this.changeAccountInfoForm.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == false) {
              this.commonError = data.body;
            } else {
              this.commonError = '';
              this.getValues = data.body;
              this.successMessage =
                'Your account info was successfully updated.';
            }
          },
          (err: any) => {
            this.commonError = err;
          }
        );
    } else {
      if (this.changeAccountInfoForm.get('password').errors?.required) {
        this.passwordError = 'Please enter a valid new password.';
      } else if (this.changeAccountInfoForm.get('password').errors?.minlength) {
        this.passwordError =
          'Please enter a new password of five characters or more.';
      } else {
        this.passwordError = '';
      }
    }
  }

  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
}
