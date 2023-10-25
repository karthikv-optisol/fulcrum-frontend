import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SidemenuService } from './../../services/sidemenu.service';
import * as $ from "jquery";
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  @Output()
  projectId: number;
  user_id: number;
  user_company_id: number;
  primary_contact_id: number;
  showProjectNavBox: boolean = false;
  arrCompletedProjects = [];
  arrOtherProjects = [];
  arrActiveProjects = [];
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;
  isShown: boolean = true;
  isShownOther: boolean = true;
  isShownActive: boolean = false;
  isShownSettings: boolean = false;
  isShownFileManager: boolean = true;
  isShownGlobalAdmin: boolean = true;
  pid: string;
  isShownReports: boolean = true;
  Arraysidemenu: any;
  usersdetails = [];
  IsshowActive: boolean = false;
  IsshowCompleted: boolean = false;
  IsshowOther: boolean = false;
  Isshowbid: boolean = false;
  arrBiddingProjects = [];
  isShownBidding: boolean = true;
  currentlySelectedProjectTypeIndex: any;
  mappedarrbid: { type: string; value: any; }[];
  is_projectmanagement: string;
  getprojectmanagementmodules: any;
  isShownProjectManagement: boolean = true;
  selectedModulename: any;
  splitted_url: string[];
  Projecturl: string;
  constructor(private route: ActivatedRoute, private router: Router, private SidemenuService: SidemenuService, private commonService: CommonService, private loader: LoaderService) {
    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(params['currentlySelectedProjectName']);
      }
    });
    this.splitted_url = this.router.url.split('?');
    this.Projecturl = this.splitted_url[0];
    const subMenuShow = this.Projecturl.split('/');
    this.showsubmenu(subMenuShow[1]);
    this.selectedModulename = this.titleCaseWord(subMenuShow[2]);
    if (this.Projecturl == '/project-management/modules-gc-budget-form') {
      this.selectedModulename = ' Project Budget';
    }
    else if (this.Projecturl == '/project-management/punch_list') {
      this.selectedModulename = 'Punch List';
    }
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  ngOnInit(): void {
    // this.sidemenuList();
    if (localStorage.getItem("Arraysidemenu")) {
      this.Arraysidemenu = JSON.parse(localStorage.getItem("Arraysidemenu"));
      this.is_projectmanagement = localStorage.getItem('is_projectmanagement');
      this.sidemenuLoad();
    } else {
      this.sidemenuList();
    }
  }

  // sidemenuList() {
  //   var _jsonURL = '../../../assets/JSON/sidemenu.json'
  //   this.SidemenuService.sidemenuList(_jsonURL).subscribe(data => {
  //     this.Arraysidemenu = data;
  //     this.sidemenuLoad();
  //   })
  // }

  sidemenuList() {
    this.loader.show();
    this.SidemenuService.sidemenuList()
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.Arraysidemenu = data.body ? data.body : [];
          localStorage.setItem("Arraysidemenu", (JSON.stringify(this.Arraysidemenu)));
          this.is_projectmanagement = this.Arraysidemenu.arrOthermenus?.project_management[0] ? '1' : '0';
          localStorage.setItem('is_projectmanagement', this.is_projectmanagement);
          this.sidemenuLoad();
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  sidemenuLoad() {
    // this.Arraysidemenu = JSON.parse(localStorage.getItem('Arraysidemenu'));
    // this.getprojectmanagementmodules = JSON.parse(localStorage.getItem('getprojectmanagementmodules'));

    this.getprojectmanagementmodules = Object.values(this.Arraysidemenu.arrOthermenus.project_management[0]);

    this.showProjectNavBox = this.Arraysidemenu.showProjectNavBox;
    this.currentlySelectedProjectTypeIndex = this.Arraysidemenu.currentlySelectedProjectTypeIndex;
    this.usersdetails = JSON.parse(localStorage.getItem('users'));
    if (this.pid == null) {
      this.currentlySelectedProjectId = this.Arraysidemenu.currentlySelectedProjectId;
      this.currentlySelectedProjectName = this.Arraysidemenu.currentlySelectedProjectName;
    }
    this.arrActiveProjects = this.Arraysidemenu.arrProjectDetails.active;
    this.arrCompletedProjects = this.Arraysidemenu.arrProjectDetails.completed;

    this.arrOtherProjects = this.Arraysidemenu.arrProjectDetails.other;
    this.arrBiddingProjects = this.Arraysidemenu.arrBiddingProjects;
    this.mappedarrbid = Object.keys(this.arrBiddingProjects).map(key => ({ type: key, value: this.arrBiddingProjects[key] }));


    // var checkaccesstoproject = this.checkpermissiontourlprojectid(this.currentlySelectedProjectId);
    // if (checkaccesstoproject == false) {
    //   alert("Permission Denied");
    //   this.router.navigate(['/']);
    // }


    for (var key in this.arrActiveProjects) {

      if (this.arrActiveProjects[key]['id'] == this.currentlySelectedProjectId) {
        this.currentlySelectedProjectName = this.arrActiveProjects[key]['project_name'];
        $('#0_selected').show();
        $('#2_selected').hide();
        $('#3_selected').hide();

        this.isShownActive = !this.isShownActive;
        this.isShown = true;
        this.isShownOther = true;
        this.IsshowActive = true; this.isShownBidding = false;
      }
    }
    for (var key in this.arrCompletedProjects) {

      if (this.arrCompletedProjects[key]['id'] == this.currentlySelectedProjectId) {
        this.currentlySelectedProjectName = this.arrCompletedProjects[key]['project_name'];
        $('#2_selected').show();
        $('#3_selected').hide();
        $('#0_selected').hide();
        this.isShown = !this.isShown;
        this.isShownActive = true;
        this.isShownOther = true;
        this.IsshowCompleted = true; this.isShownBidding = false;

      }
    }
    for (var key in this.arrOtherProjects) {

      if (this.arrOtherProjects[key]['id'] == this.currentlySelectedProjectId) {
        this.currentlySelectedProjectName = this.arrOtherProjects[key]['project_name'];
        $('.otherprojectname3').show();
        $('.otherprojectname2').hide();

        $(".selectedProject.otherprojectname").css("visibility", "hidden");
        this.isShownOther = !this.isShownOther;
        this.isShownActive = true;
        this.isShown = true;
        this.IsshowOther = true;
        this.isShownBidding = false;
      }
    }
    if (this.currentlySelectedProjectTypeIndex == 1) {
      for (var key in this.arrBiddingProjects) {
        if (key == this.currentlySelectedProjectId) {
          this.currentlySelectedProjectName = this.arrBiddingProjects[key];

          $('.otherprojectname3').hide();
          $('.otherprojectname2').hide();
          $('#2_selected').hide();
          $('#3_selected').hide();
          $('#0_selected').hide();
          $('#4_selected').show();
          this.isShownBidding = !this.isShownBidding;
          this.isShownActive = true;
          this.isShownOther = true;
          this.IsshowCompleted = true;
          this.isShown = true;
        }
      }
    }
    const data = {
      isSelected: true,
      title: this.currentlySelectedProjectName
    }
    this.commonService.selectedMenuName.next(data);
  }
  checkpermissiontourlprojectid(pid) {

    for (var key in this.arrActiveProjects) {

      if (this.arrActiveProjects[key]['id'] == pid) {
        return true;
      }
    }

    for (var key in this.arrCompletedProjects) {

      if (this.arrCompletedProjects[key]['id'] == pid) {
        return true;
      }
    }

    for (var key in this.arrOtherProjects) {

      if (this.arrOtherProjects[key]['id'] == pid) {
        return true;
      }
    }
    if (this.currentlySelectedProjectTypeIndex == 1) {
      for (var key in this.arrBiddingProjects) {
        if (key == pid) {
          return true;
        }
      }
    }
    return false;
  }

  navigationProjectSelected(project_id, encodedProjectName, extraparam) {

    this.currentlySelectedProjectId = project_id;
    this.currentlySelectedProjectName = encodedProjectName;
    if (extraparam == 'active') {
      this.IsshowActive = true;
      this.IsshowCompleted = false;
      this.IsshowOther = false;
      $('#2_selected').hide();
      $('#3_selected').hide();
      $('#0_selected').show(); $('#4_selected').hide();


    }
    else if (extraparam == 'completed') {
      this.IsshowCompleted = true;
      this.IsshowActive = false;
      this.IsshowOther = false;
      $('#0_selected').hide();
      $('#3_selected').hide();
      $('#2_selected').show(); $('#4_selected').hide();

    }
    else if (extraparam == 'other') {
      this.IsshowActive = false;
      this.IsshowCompleted = false;
      this.IsshowOther = true;
      $('#0_selected').hide();
      $('#3_selected').show();
      $('#2_selected').hide();
      $('#4_selected').hide();
    }
    else if (extraparam == 'bidding') {
      this.IsshowActive = false;
      this.IsshowCompleted = false;
      this.IsshowOther = false;
      this.Isshowbid = false;
      $('#0_selected').hide();
      $('#4_selected').show();
      $('#3_selected').hide()
      $('#2_selected').hide();
    }
    this.router.navigate(['/dashboard'],
      {
        queryParams: {
          pid: btoa(project_id)
          //,currentlySelectedProjectName:btoa(encodedProjectName) 
        }
      });
    const data = {
      isSelected: true,
      title: this.currentlySelectedProjectName
    }
    this.commonService.selectedMenuName.next(data);
  }
  // navigationprojectlist(users): void {
  //  // this.loading = true;

  //   this.SidemenuService.navigationprojectlist(users)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         //this.loading = false;
  //         if (data['status']) {
  //           this.showProjectNavBox=data['body']['showProjectNavBox'];
  //           this.currentlySelectedProjectId=data['body']['currentlySelectedProjectId'];
  //           this.currentlySelectedProjectName=data['body']['currentlySelectedProjectName'];
  //           this.arrActiveProjects =data['body']['arrActiveProjects']['active'];
  //           this.arrCompletedProjects =data['body']['arrCompletedProjects']['completed'];

  //           this.arrOtherProjects =data['body']['arrOtherProjects']['other'];
  //         }
  //         else {

  //         }
  //       }
  //     );
  // }
  file_manager() {
    this.router.navigate(['/modules-file-manager-file-browser'],
      { queryParams: { pid: this.pid } });
    this.selectedModulename = 'modules-file-manager-file-browser';
  }
  project_modules(module_name) {
    this.selectedModulename = module_name;
    if (module_name.trim() == 'Project Budget') {
      this.router.navigate(['/project-management/modules-gc-budget-form'],
        { queryParams: { pid: this.pid } });

    }
    else if (module_name == 'Punch List') {
      this.punchlist();
    }
    else if (module_name == 'Submittals') {
      this.submittals();
    }
    else if (module_name == 'Meetings') {
      this.Meetings();
    }
    else if (module_name == 'RFIs') {
      this.RFIs();
    }
    else if(module_name == 'Subcontracts Tracking')
    {
        this.subcontract_tracking();
    }
    else if(module_name == 'Owner Change Order')
    {
        this.owner_change_order();
    }
  }

  punchlist() {
    this.router.navigate(['/project-management/punch_list'],
      { queryParams: { pid: this.pid } });
  }
  submittals() {
    this.router.navigate(['/project-management/submittals'],
      { queryParams: { pid: this.pid } });
  }
  Meetings() {
    this.router.navigate(['/project-management/Meetings'],
      { queryParams: { pid: this.pid } });
  }
  RFIs() {
    this.router.navigate(['/project-management/RFIs'],
      { queryParams: { pid: this.pid } });
  }
  subcontract_tracking()
  {
    this.router.navigate(['/project-management/contract-tracking'],
      { queryParams: { pid: this.pid } });
  }
  owner_change_order()
  {
    this.router.navigate(['/project-management/owner-change-order'],
      { queryParams: { pid: this.pid } });
  }

  dashboard() {

    this.router.navigate(['/dashboard'],
      { queryParams: { pid: this.pid } });
  }
  reportslist() {
    this.router.navigate(['/modules-report-form'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }

  myaccountsetting() {
    this.router.navigate(['/my_account_setting'],
      { queryParams: { pid: this.pid } });
  }

  changeEmailAddress() {
    this.router.navigate(['/my_account_setting/change_email_address'],
      { queryParams: { pid: this.pid } });
  }

  changePassword() {
    this.router.navigate(['/my_account_setting/change_password'],
      { queryParams: { pid: this.pid } });
  }

  changeLoginInfo() {
    this.router.navigate(['/my_account_setting/change_login_info'],
      { queryParams: { pid: this.pid } });
  }

  changeAccountInfo() {
    this.router.navigate(['/my_account_setting/change_account_info'],
      { queryParams: { pid: this.pid } });
  }

  myESignature() {
    this.router.navigate(['/my_account_setting/my_e_signature'],
      { queryParams: { pid: this.pid } });
  }

  manageRegisteredCompany() {
    this.router.navigate(['/global_admin/manage_registered_company'],
      { queryParams: { pid: this.pid } });
  }

  manageRegisteredUser() {
    this.router.navigate(['/global_admin/manage_registered_user'],
      { queryParams: { pid: this.pid } });
  }
  showsubmenu(param) {
    if (param == 'completed') {
      this.isShown = !this.isShown;
    }
    else if (param == 'other') {
      this.isShownOther = !this.isShownOther;
    }
    else if (param == 'active') {
      this.isShownActive = !this.isShownActive;
    }
    else if (param == 'bidding') {
      this.isShownBidding = !this.isShownBidding;
    }
    else if (param == 'modules-file-manager-file-browser') {
      this.isShownFileManager = !this.isShownFileManager;
    }
    else if (param == 'reports') {
      this.isShownReports = !this.isShownReports;
    }
    else if (param == 'myaccountsetting') {
      this.isShownSettings = !this.isShownSettings;
    } else if (param == 'globaladmin') {
      this.isShownGlobalAdmin = !this.isShownGlobalAdmin;
    }
    else if (param == 'project-management') {
      this.isShownProjectManagement = !this.isShownProjectManagement;
    }
  }
  get users() {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }

  }
}
