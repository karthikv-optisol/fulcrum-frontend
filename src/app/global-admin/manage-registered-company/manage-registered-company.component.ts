import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { GlobalAdminService } from 'src/app/services/global-admin.service';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';
import * as $ from 'jquery';

export interface companyListData{
  id:number,
  company:string,
  employer_identification_number:number,
  construction_license_number:number,
  construction_license_number_expiration_date:number,
  paying_customer_flag:string
}

@Component({
  selector: 'app-manage-registered-company',
  templateUrl: './manage-registered-company.component.html',
  styleUrls: ['./manage-registered-company.component.scss'],
})

export class ManageRegisteredCompanyComponent implements OnInit {
  modalloading: boolean = false;
  isHideDomElement: boolean = false;
  currentlySelectedProjectName: any;
  user: any;
  commonError: any;
  getValues: any;
  userCompanyLists: any;
  softwareModulesLists: any = [];
  changeAccountInfoForm: any = FormGroup;
  software_modules: any;
  userCompanySoftwareModules: any = []; // 2
  isChecked = false;

  userCompanyList: companyListData = {company:'',employer_identification_number:0,construction_license_number:0,construction_license_number_expiration_date:0,paying_customer_flag:'',id:0}; // 1

  constructor(
    private globalAdminService: GlobalAdminService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.getSoftwareModuleListData();
    // this.getupdateDeleteCompanyUsersDataSoftModule();
  }

  ngOnInit(): void {
    this.accountInfoFormValue();
  }

  accountInfoFormValue() {
    this.changeAccountInfoForm = this.formBuilder.group({
      user_company_name: ['', [Validators.required]],
      employer_identification_number: ['', [Validators.required]],
      construction_license_number: [''],
      construction_license_number_expiration_date: [''],
      gc_logo: [''],
      paying_customer_flag: [''],
      software_modules: new FormArray([]),
      company_id: [''],
      form_type: [''],
    });
  }

  getSoftwareModuleListData() {
    this.globalAdminService
      .getSoftwareModuleListData(this.user)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            this.commonError = data.body;
          } else {
            this.userCompanyLists = data.body.userCompanyList;
            this.softwareModulesLists = data.body.softwareModulesList;
            this.commonError = '';
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }

  getCompanyValue(event: any) {
    var userCompanyList = this.userCompanyLists.filter(
      (x: any) => x.id === parseInt(event)
    );
    console.log("userCompanyList", userCompanyList);
    
    if (userCompanyList.length > 0) {
      this.assignEditFormValue(userCompanyList[0]);
    }
  }
//
  assignEditFormValue(editValue: any) {
    this.globalAdminService
    .getCompanySoftwareModuleListData(editValue)
    .pipe(first())
    .subscribe(
      (data: any) => {
        this.userCompanyList = data.body.userCompanyList;
        this.userCompanySoftwareModules = data.body.userCompanySoftwareModules;
        
        var testCont = [];
        this.userCompanySoftwareModules.forEach(getIdValues => {
          testCont.push(getIdValues.software_module_id);
        });

        this.softwareModulesLists = this.softwareModulesLists.filter(getIdSoftModu => {
            getIdSoftModu.CheckBoxvalues = false;
            if(testCont.includes(getIdSoftModu.id)){
              getIdSoftModu.CheckBoxvalues = true;
            }
            return getIdSoftModu; 
        });

        console.log("userCompanyList",this.userCompanyList);
        console.log("userCompanySoftwareModules",this.userCompanySoftwareModules);
        

        this.changeAccountInfoForm.controls['company_id'].setValue(this.userCompanyList.id);
        this.changeAccountInfoForm.controls['user_company_name'].setValue(this.userCompanyList.company); //
        this.changeAccountInfoForm.controls['employer_identification_number'].setValue(this.userCompanyList.employer_identification_number);
        this.changeAccountInfoForm.controls['construction_license_number'].setValue(this.userCompanyList.construction_license_number);

        this.changeAccountInfoForm.controls['construction_license_number_expiration_date'].setValue(this.userCompanyList.construction_license_number_expiration_date,'MM/dd/yyyy');

        //new Date( this.datePipe.transform(this.userCompanyList.construction_license_number_expiration_date,'MM/dd/yyyy'))
       
        this.changeAccountInfoForm.controls['paying_customer_flag'].setValue(this.userCompanyList.paying_customer_flag);
         console.log("paying_customer_flag", this.userCompanyList.paying_customer_flag);

          // if(this.userCompanyList.paying_customer_flag == 'Y') {  
          //   console.log("this.userCompanyList.paying_customer_flag", this.userCompanyList.paying_customer_flag);
                    
          //   //this.isChecked = true;
          //   //this.changeAccountInfoForm.controls['paying_customer_flag'].setValue(this.userCompanyList.paying_customer_flag);
          // }

         console.log("Date pipe", this.datePipe.transform(this.userCompanyList.construction_license_number_expiration_date,'MM/dd/yyyy'));
        
        // console.log("dAte format", new Date( this.datePipe.transform(this.userCompanyList.construction_license_number_expiration_date,'MM/dd/yyyy')));
        
        
        
      },
      (err: any) => {
        this.commonError = err;
      }
    );
  }

 

  submitForm() {
    
    var checkedVals = $('.softwareModules:checkbox:checked')
      .map(function () {
        return this.value;
      }).get();

      if (checkedVals && checkedVals.length > 0) {
        this.changeAccountInfoForm.value.software_modules = checkedVals;
      }

      //console.log("userCompanyList ",this.userCompanyList);
      console.log("changeAccountInfoForm_Valid",this.changeAccountInfoForm.valid);
      console.log("changeAccountInfoForm_Value",this.changeAccountInfoForm.value);

      this.globalAdminService.getupdateDeleteCompanyUsersDataSoftModule(this.changeAccountInfoForm.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // if (data.status == false) {
          //   this.commonError = data.body;
          // } else {
          //   this.userCompanyLists = data.body.userCompanyList;
          //   this.softwareModulesLists = data.body.softwareModulesList;
          //   this.commonError = '';
          // }
          console.log("data", data);
          
        },
        (err: any) => {
          this.commonError = err;
        }
      );

    //this.updateDeleteCompanyUsersDataSoftModule();
    


  }

  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }

  showHideDomElement() {
    this.isHideDomElement = !this.isHideDomElement;
  }


  resetForm() {
    this.changeAccountInfoForm.reset();
    $('.purchasedModuleFlag').each(function () {
      $(this).attr('checked', true);
    });
  }

  checkAllPayingCustomerModules(element: any) {
    var checked = element.target.checked || false;
    $('.payingCustomerModuleCheckbox').prop('checked', checked);
  }
}
