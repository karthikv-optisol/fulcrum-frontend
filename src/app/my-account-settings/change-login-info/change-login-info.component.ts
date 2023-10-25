import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';

@Component({
  selector: 'app-change-login-info',
  templateUrl: './change-login-info.component.html',
  styleUrls: ['./change-login-info.component.scss'],
})
export class ChangeLoginInfoComponent implements OnInit {
  currentlySelectedProjectName: any;
  mobileNetworkCarriers: any;
  groupMobileNetworkCarriers: any;
  users: any;
  commonError: any;
  successMessage: any;
  emailError: any;
  alertsError: any;
  screenNameError: any;
  mobileError: any;
  carrierError: any;
  alerts: any = 'Both';
  carrier_id: any;
  changeLoginInfoForm: any = FormGroup;
  isPasswordDiv: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private myAccountSettingsService: MyAccountSettingsService
  ) {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.loginInfoFormValue();
    this.getMobileNetworkCarriers();
  }

  ngOnInit(): void {}

  getMobileNetworkCarriers() {
    this.myAccountSettingsService
      .getMobileNetworkCarriers()
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            this.commonError = data.body;
          } else {
            this.mobileNetworkCarriers = data.body;
            this.setLoginFormValues();
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }

  loginInfoFormValue() {
    this.changeLoginInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      alerts: ['', Validators.required],
      id: ['', Validators.required],
      mobile_phone_area_code: [''],
      mobile_phone_prefix: [''],
      mobile_phone_last_number: [''],
      cell_phone_carrier: [''],
      screen_name: ['', Validators.required],
    });
  }

  setLoginFormValues() {
    this.alerts = this.users.alerts;
    var mobile_phone_area_code: any;
    var mobile_phone_prefix: any;
    var mobile_phone_last_number: any;
    if (this.users.mobile_phone_number) {
      mobile_phone_area_code = this.users.mobile_phone_number.substring(0, 3);
      mobile_phone_prefix = this.users.mobile_phone_number.substring(3, 6);
      mobile_phone_last_number = this.users.mobile_phone_number.substring(
        6,
        10
      );
    } else {
      mobile_phone_area_code = '';
      mobile_phone_prefix = '';
      mobile_phone_last_number = '';
    }

    if (this.alerts == 'Both' || this.alerts == 'SMS') {
      this.changeLoginInfoForm = this.formBuilder.group({
        email: [this.users.email, [Validators.required, Validators.email]],
        alerts: [this.users.alerts, Validators.required],
        id: [this.users.id, Validators.required],
        mobile_phone_area_code: [mobile_phone_area_code, Validators.required],
        mobile_phone_prefix: [mobile_phone_prefix, Validators.required],
        mobile_phone_last_number: [
          mobile_phone_last_number,
          Validators.required,
        ],
        cell_phone_carrier: [
          this.users.mobile_network_carrier_id,
          Validators.required,
        ],
        screen_name: [this.users.screen_name, Validators.required],
      });
    } else {
      this.changeLoginInfoForm = this.formBuilder.group({
        email: [this.users.email, [Validators.required, Validators.email]],
        alerts: [this.users.alerts, Validators.required],
        id: [this.users.id, Validators.required],
        mobile_phone_area_code: [mobile_phone_area_code],
        mobile_phone_prefix: [mobile_phone_prefix],
        mobile_phone_last_number: [mobile_phone_last_number],
        cell_phone_carrier: [this.users.mobile_network_carrier_id],
        screen_name: [this.users.screen_name, Validators.required],
      });
    }
  }

  alertchange(event: any, alertType: any) {
   

    var isEmail:any = document.getElementById("emailAlert");
    var isSMS:any = document.getElementById("smsAlert");
      if (isSMS.checked && isEmail.checked) {
        this.changeLoginInfoForm.controls['alerts'].setValue('Both');
        this.alerts = 'Both';
        this.changeLoginInfoForm.get('mobile_phone_area_code').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_area_code').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_prefix').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_prefix').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_last_number').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_last_number').updateValueAndValidity();
          this.changeLoginInfoForm.get('cell_phone_carrier').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('cell_phone_carrier').updateValueAndValidity();
      } else {
        if (isSMS.checked) {
          this.changeLoginInfoForm.controls['alerts'].setValue('SMS');
          this.alerts = 'SMS';
          this.changeLoginInfoForm.get('mobile_phone_area_code').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_area_code').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_prefix').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_prefix').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_last_number').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('mobile_phone_last_number').updateValueAndValidity();
          this.changeLoginInfoForm.get('cell_phone_carrier').setValidators([Validators.required]);
          this.changeLoginInfoForm.get('cell_phone_carrier').updateValueAndValidity();
        
        }
        if (isEmail.checked) {
          this.changeLoginInfoForm.controls['alerts'].setValue('Email');
          this.alerts = 'Email';
          this.changeLoginInfoForm.get('mobile_phone_area_code').clearValidators();
          this.changeLoginInfoForm.get('mobile_phone_area_code').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_prefix').clearValidators();
          this.changeLoginInfoForm.get('mobile_phone_prefix').updateValueAndValidity();
          this.changeLoginInfoForm.get('mobile_phone_last_number').clearValidators();
          this.changeLoginInfoForm.get('mobile_phone_last_number').updateValueAndValidity();
          this.changeLoginInfoForm.get('cell_phone_carrier').clearValidators();
          this.changeLoginInfoForm.get('cell_phone_carrier').updateValueAndValidity();
        }
        if (isSMS.checked ==false && isEmail.checked ==false) {
          this.changeLoginInfoForm.controls['alerts'].setValue('');
          this.alerts = '';
        }
      }
   
  }
  errorClear() {
    this.commonError="";
    this.successMessage="";
    this.emailError="";
    this.alertsError="";
    this.screenNameError="";
    this.mobileError="";
    this.carrierError="";
  }

  resetPasswordForm() {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.setLoginFormValues()
  }

  changeLoginInfo() {
    this.errorClear();
    console.log(this.changeLoginInfoForm);
    if (this.changeLoginInfoForm.valid) {
      var formvalue = this.changeLoginInfoForm.value;
      if (formvalue.email) {
        this.myAccountSettingsService
          .changeLoginInfo(this.changeLoginInfoForm.value)
          .pipe(first())
          .subscribe(
            (data: any) => {
              if (data.status == false) {
                this.commonError = data.body;
              } else {
                this.users = data['body'];
                localStorage.removeItem('users');
                localStorage.setItem('users', JSON.stringify(this.users));
                this.users = JSON.parse(localStorage.getItem('users'));
                this.commonError = '';
                this.successMessage =
                  'You have successfully updated your account login, security information, and settings.';
                this.isPasswordDiv = true;
                this.setLoginFormValues();
              }
            },
            (err: any) => {
              this.commonError = err;
            }
          );
      } else {
        this.emailError = 'Email and confirm email must match.';
      }
    } else {
      if (this.changeLoginInfoForm.get('email').errors?.required) {
        this.emailError = 'Please enter a email address.';
      } else if (this.changeLoginInfoForm.get('email').errors?.email) {
        this.emailError = 'Please enter a valid email address.';
      } else {
        this.emailError = '';
      }
      if (this.changeLoginInfoForm.get('alerts').errors?.required) {
        this.alertsError = 'Please select a valid alert option.';
      }
      if (this.changeLoginInfoForm.get('screen_name').errors?.required) {
        this.screenNameError = 'Please enter a valid screen name.';
      }
      if (
        this.changeLoginInfoForm.value.alerts &&
        (this.changeLoginInfoForm.value.alerts == 'Both' ||
          this.changeLoginInfoForm.value.alerts == 'SMS')
      ) {
        if (
          this.changeLoginInfoForm.get('cell_phone_carrier').errors?.required
        ) {
          this.carrierError = 'Please choose a valid cell phone carrier.';
        }

        if (
          this.changeLoginInfoForm.get('mobile_phone_area_code').errors
            ?.required ||
          this.changeLoginInfoForm.get('mobile_phone_prefix').errors
            ?.required ||
          this.changeLoginInfoForm.get('mobile_phone_last_number').errors
            ?.required
        ) {
          this.mobileError = 'Please enter a valid mobile phone number.';
        }
      }
    }
  }

  changePasswordDiv() {
    this.successMessage = ""
    this.isPasswordDiv = ! this.isPasswordDiv;
  }

  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
}
