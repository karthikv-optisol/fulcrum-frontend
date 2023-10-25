import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { GlobalAdminService } from 'src/app/services/global-admin.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-manage-registered-user',
  templateUrl: './manage-registered-user.component.html',
  styleUrls: ['./manage-registered-user.component.scss'],
})
export class ManageRegisteredUserComponent implements OnInit {
  currentlySelectedProjectName: any;
  commonError: any;
  userCompanyLists: any;
  users: any;
  user: any;
  mobileNetworkCarriers: any;
  alerts: any = 'Both';
  changeLoginInfoForm: any = FormGroup;
  constructor(
    private globalAdminService: GlobalAdminService,
    private formBuilder: FormBuilder
    ) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.getManageUserData();
  }

  ngOnInit(): void {}

  loginInfoFormValue() {
    this.changeLoginInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      alerts: ['', Validators.required],
      user_company_id: ['', Validators.required],
      user_role_id: ['', Validators.required],
      id: [''],
      mobile_phone_area_code: [''],
      mobile_phone_prefix: [''],
      mobile_phone_last_number: [''],
      cell_phone_carrier: [''],
      first_name: [''],
      last_name: [''],
      title: [''],
      screen_name: ['', Validators.required],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
  }

  getManageUserData() {
    this.globalAdminService
      .getManageUserData(this.user)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            this.commonError = data.body;
          } else {
            this.userCompanyLists = data.body.userCompanyList;
            this.users = data.body.users;
            this.mobileNetworkCarriers = data.body.mobileNetworkCarriers;
            this.commonError = '';
            this.loginInfoFormValue();
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }
  getCompanyValue(var1: any) {}
  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }

  alertchange(event: any, alertType: any) {
    var isEmail: any = $('#emailAlert');
    var isSMS: any = $('#smsAlert');
    if (isSMS.checked && isEmail.checked) {
      this.changeLoginInfoForm.controls['alerts'].setValue('Both');
      this.alerts = 'Both';
      this.changeLoginInfoForm
        .get('mobile_phone_area_code')
        .setValidators([Validators.required]);
      this.changeLoginInfoForm
        .get('mobile_phone_area_code')
        .updateValueAndValidity();
      this.changeLoginInfoForm
        .get('mobile_phone_prefix')
        .setValidators([Validators.required]);
      this.changeLoginInfoForm
        .get('mobile_phone_prefix')
        .updateValueAndValidity();
      this.changeLoginInfoForm
        .get('mobile_phone_last_number')
        .setValidators([Validators.required]);
      this.changeLoginInfoForm
        .get('mobile_phone_last_number')
        .updateValueAndValidity();
      this.changeLoginInfoForm
        .get('cell_phone_carrier')
        .setValidators([Validators.required]);
      this.changeLoginInfoForm
        .get('cell_phone_carrier')
        .updateValueAndValidity();
    } else {
      if (isSMS.checked) {
        this.changeLoginInfoForm.controls['alerts'].setValue('SMS');
        this.alerts = 'SMS';
        this.changeLoginInfoForm
          .get('mobile_phone_area_code')
          .setValidators([Validators.required]);
        this.changeLoginInfoForm
          .get('mobile_phone_area_code')
          .updateValueAndValidity();
        this.changeLoginInfoForm
          .get('mobile_phone_prefix')
          .setValidators([Validators.required]);
        this.changeLoginInfoForm
          .get('mobile_phone_prefix')
          .updateValueAndValidity();
        this.changeLoginInfoForm
          .get('mobile_phone_last_number')
          .setValidators([Validators.required]);
        this.changeLoginInfoForm
          .get('mobile_phone_last_number')
          .updateValueAndValidity();
        this.changeLoginInfoForm
          .get('cell_phone_carrier')
          .setValidators([Validators.required]);
        this.changeLoginInfoForm
          .get('cell_phone_carrier')
          .updateValueAndValidity();
      }
      if (isEmail.checked) {
        this.changeLoginInfoForm.controls['alerts'].setValue('Email');
        this.alerts = 'Email';
        this.changeLoginInfoForm
          .get('mobile_phone_area_code')
          .clearValidators();
        this.changeLoginInfoForm
          .get('mobile_phone_area_code')
          .updateValueAndValidity();
        this.changeLoginInfoForm.get('mobile_phone_prefix').clearValidators();
        this.changeLoginInfoForm
          .get('mobile_phone_prefix')
          .updateValueAndValidity();
        this.changeLoginInfoForm
          .get('mobile_phone_last_number')
          .clearValidators();
        this.changeLoginInfoForm
          .get('mobile_phone_last_number')
          .updateValueAndValidity();
        this.changeLoginInfoForm.get('cell_phone_carrier').clearValidators();
        this.changeLoginInfoForm
          .get('cell_phone_carrier')
          .updateValueAndValidity();
      }
      if (isSMS.checked == false && isEmail.checked == false) {
        this.changeLoginInfoForm.controls['alerts'].setValue('');
        this.alerts = '';
      }
    }
  }
}
