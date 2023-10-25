// DCR CHARTS CHANGES 
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import * as $ from "jquery";
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-active-projects',
  templateUrl: './active-projects.component.html',
  styleUrls: ['./active-projects.component.scss']
})
export class ActiveProjectsComponent implements OnInit {
  @Input() time:string;
  operate: boolean = true;
  busines: boolean = false;
  tasksummary: boolean = false;
  show_cont: string = '';
  show_cont_class: number;
  subcount: number;
  totalUsers: number;
  rfiCount: number;
  closedsubmitalcount: number;
  closedrficount: number;
  loading: boolean = false;
  view_all: boolean = false;
  global_admin_content: boolean = false;
  topProject = [];
  rfitopProject = [];
  viewallsubmtl = [];
  ViewOpenRFI = [];
  loadopenSubmital = [];
  loadopenRfi = [];
  user_company = [];
  loaduser = [];
  Viewalluserslist = [];
  closedsubmitaldatas = [];
  closedrfidatas = [];
  closedsub = [];
  view_all_closed: string = 'MonthTill';
  view_all_closed_rfi: string = 'MonthTill';
  customerhealthperiod: string = 'YearTill';
  customertype: string = "active";
  closedrfi: any;
  myOptions: any;
  chartcat: any;
  color: any;
  CompaniesCount: number;
  projectCount: number;
  signupitemsname = [];
  signupitemscount = [];
  projectmonthlyitemsname = [];
  projectmonthlyitemscount = [];
  myOptionscustomer: any;


  showProjectNavBox: boolean = false;
  arrCompletedProjects = [];
  arrOtherProjects = [];
  arrActiveProjects = [];
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;
  isShown: boolean = true;
  isShownOther: boolean = true;
  isShownActive: boolean = false;
  isShownFileManager: boolean = true;
  IsshowActive: boolean = false;
  IsshowCompleted: boolean = false;
  IsshowOther: boolean = false;
  Arraysidemenu = [];
  titleSubscription: Subscription
  // DCR CHARTS CHANGES

  //@ViewChild('chartsnew') public chartEl: ElementRef;
  pid: string;
  isShownReports: boolean = true; usersdetails = [];
  constructor(
    private route: ActivatedRoute, public modalService: NgbModal, private titleService: Title, private DashboardService: DashboardService, private router: Router, private commonService:CommonService, private loader: LoaderService) {
    this.titleService.setTitle("Dashboard");

    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(params['currentlySelectedProjectName']);
      }


    });
  }

  ngOnInit(): void {

    if (localStorage.getItem('users')) {
      this.usersdetails = JSON.parse(localStorage.getItem('users'));
      this.getdashboarddetails(localStorage.getItem('userid'));
      if (this.usersdetails['userRole'] == 'global_admin') {
        this.global_admin_content = true;
      }
      else {
        this.global_admin_content = false;
      }


    }
    else {
      localStorage.clear();
      this.router.navigate(['/login-form']);
    }

    this.titleSubscription = this.commonService.selectedMenuName.subscribe((res: any) => {
      if (res.isSelected) {
        this.currentlySelectedProjectName = res.title;
      }
    })
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  file_manager() {
    this.router.navigate(['/modules-file-manager-file-browser'],
      {
        queryParams: {
          pid: this.pid
        }
      });

  }
  punchlist() {
    this.router.navigate(['/project-management/punch_list'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }
  dashboard() {
    this.router.navigate(['/dashboard'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }
  reportslist() {
    this.router.navigate(['/modules-report-form'],
      {
        queryParams: {
          pid: this.pid
        }
      });
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
    else if (param == 'file_manager') {
      this.isShownFileManager = !this.isShownFileManager;
    } else if (param == 'reports') {
      this.isShownReports = !this.isShownReports;
    }


  }
  get users() {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }

  }
  getdashboarddetails(userid): void {
    this.loader.show();
    this.DashboardService.getdashboarddetails(userid)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            if (data['body'] != null) {


              this.subcount = data['body']['subCount'];
              this.rfiCount = data['body']['rfiCount'];
              this.topProject = data['body']['topProject'];
              this.rfitopProject = data['body']['rfitopProject'];
              this.totalUsers = data['body']['totalUsers'];

              this.user_company = data['body']['user_company'];

              this.CompaniesCount = data['body']['CompaniesCount'];
              this.projectCount = data['body']['ProjectCount'];
            }
           
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }


          }
        }
      );
  }
  ViewOpenSubmittal(userid, content): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, windowClass: 'dashboardlist-page'
    };
    this.DashboardService.ViewOpenSubmittal(userid)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.viewallsubmtl = data['body']['viewallsubmtl'];
            this.modalService.open(content, ngbModalOptions);
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }

  viewallsubmtals(content) {
    this.ViewOpenSubmittal(localStorage.getItem('userid'), content);
  }
  load_openRFI(project_id) {

    this.loader.show();
    this.DashboardService.load_openRFI(project_id)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            if (project_id == data['body']['project_id']) {
              this.show_cont_class = data['body']['project_id'];

            }
            else {
              this.show_cont_class = 0;
            }
            this.loadopenRfi = data['body']['loadopenRFI'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );

  }
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    this.show_cont_class = 0;
  }
  load_user(company_id) {

    this.loader.show();
    this.DashboardService.load_user(company_id)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            if (company_id == data['body']['company_id']) {
              this.show_cont_class = data['body']['company_id'];

            }
            else {
              this.show_cont_class = 0;
            }
            this.loaduser = data['body']['load_user'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );
  }
  load_openSubmital(project_id) {
    this.loader.show();
    this.DashboardService.load_openSubmital(project_id)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            if (project_id == data['body']['project_id']) {
              this.show_cont_class = data['body']['project_id'];

            }
            else {
              this.show_cont_class = 0;
            }
            this.loadopenSubmital = data['body']['loadopenSubmital'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );

  }
  Viewallrfi(userid, contentrfi): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, windowClass: 'dashboardlist-page'
    };
    this.DashboardService.Viewallopenrfi(userid)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.ViewOpenRFI = data['body']['ViewOpenRFI'];
            this.modalService.open(contentrfi, ngbModalOptions);
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );
  }
  viewallrfi(contentrfi) {
    this.Viewallrfi(localStorage.getItem('userid'), contentrfi);
  }
  view_allUsers(contentallusers) {
    this.Viewallusers(localStorage.getItem('userid'), contentallusers);

  }

  Viewallusers(userid, contentallusers): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, windowClass: 'dashboardlist-page'
    };
    this.DashboardService.Viewallusers(userid)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.Viewalluserslist = data['body']['user_company'];
            this.modalService.open(contentallusers, ngbModalOptions);
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );
  }
  ProjectsORBusinessview(signupvalue: string) {

    if (signupvalue == 'operational') {
      this.operate = true;
      this.busines = false;
      this.tasksummary = false;
    }
    else if (signupvalue == 'business') {
      this.operate = false;
      this.busines = true;
      this.tasksummary = false;
    }
    else if (signupvalue == 'tasksummary') {
      this.operate = false;
      this.busines = false;
      this.tasksummary = true;
    }

  }
  view_allclosedRFI(contentallclosedrfiindex) {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, windowClass: 'dashboardlist-page'
    };
    this.view_all = true;
    this.DashboardService.closedrfidata(this.view_all_closed_rfi, this.view_all)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.modalService.open(contentallclosedrfiindex, ngbModalOptions);

            this.closedrfi = data['body']['closedrfi'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }
  view_allclosedSubmittal(contentallclosedsubmittalindex) {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, windowClass: 'dashboardlist-page'
    };
    this.view_all = true;
    this.DashboardService.closedsubmitaldata(this.view_all_closed, this.view_all)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.modalService.open(contentallclosedsubmittalindex, ngbModalOptions);

            this.closedsub = data['body']['closedsub'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );

  }
  styleObject(inputarr)
  {
if (inputarr != undefined){
  return {height: '400px'}
}
return {}
  }
  // DCR CHARTS CHANGES
  dcrchart(period) {
    this.loader.show();
    this.DashboardService.dcrchart(period)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();

          if (data['status']) {
            this.chartcat = data['body']['strdays'].split(',');

            let cat = [];
            let data1 = this.chartcat;

            data1.forEach(function (item) {
              cat.push(item);

            });

            let dcrdata = [];
            let data2 = data['body']['strval'];
            let color2 = "";

            data2.forEach(function (item, index) {
              if (data['body']['curdate'] === index) {
                dcrdata.push({ y: item, color: "#ffffff" });
              }
              else {
                dcrdata.push({ y: item, color: "#686d70" });
              }

            });

            this.myOptions = {
              chart: {
                type: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
              },
              title: {
                text: 'DCR Generated',
                align: 'left'
              },
              colors: ['#666666'],
              xAxis: {


                gridLineColor: 'transparent',
                lineColor: 'transparent',
                minorGridLineWidth: 0,
                lineWidth: 0,
                minorTickLength: 0,
                tickLength: 0,
                categories: cat,
                // categories: ['Week1','Week2','Week3','Week4','Week5'],
                crosshair: true,
                labels:
                {
                  rotation: -45,
                  style: {
                    color: ''
                  },
                  formatter: function () {

                    if (data['body']['actstrdays'] === this.value) {
                      return '<span style="fill: #ffffff;">' + this.value + '</span>';
                    } else {
                      return '<span style="fill: #3F343D;">' + this.value + '</span>';
                    }

                  }
                }
              },
              yAxis: {
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                min: 0,
                title: {
                  text: ''
                },
                labels:
                {
                  enabled: false
                }
              },
              tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">DCR {point.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0,

                }
              },
              series: [{
                showInLegend: false,
                data: dcrdata
                //data:  [{y:0,color:'#686d70'},{y:3,color:'#686d70'},{y:0,color:'#ffffff'},{y:0,color:'#686d70'},{y:0,color:'#686d70'}, ]
              }]
            };

            Highcharts.chart('dcrchartsprojects', this.myOptions);
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }
  // DCR CHARTS CHANGES

  closedrfidataindex(period) {


    this.loader.show();

    if (period == 'MonthTill') {
      this.view_all_closed_rfi = 'MonthTill';
    }
    else if (period == 'QuatorTill') {
      this.view_all_closed_rfi = 'QuatorTill';
    }
    else {
      this.view_all_closed_rfi = 'YearTill';
    }
    this.view_all = false;
    this.DashboardService.closedrfidata(period, this.view_all)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {


            this.closedrficount = data['body']['totcount'];
            this.closedrfidatas = data['body']['closedrfi'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }

          }
        }
      );
  }

  closedsubmitaldataindex(period) {


    this.loader.show();

    if (period == 'MonthTill') {
      this.view_all_closed = 'MonthTill';
    }
    else if (period == 'QuatorTill') {
      this.view_all_closed = 'QuatorTill';
    }
    else {
      this.view_all_closed = 'YearTill';
    }
    this.view_all = false;
    this.DashboardService.closedsubmitaldata(period, this.view_all)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {


            this.closedsubmitalcount = data['body']['totcount'];
            this.closedsubmitaldatas = data['body']['closedsub'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }

  signupindex(period) {
    this.loader.show();
    this.DashboardService.signupindex(period)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.CompaniesCount = data['body']['total']['count'];
            this.signupitemsname = data['body']['items']['name'];
            this.signupitemscount = data['body']['items']['count'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }

  projectmonthly(period) {
    this.loader.show();
    this.DashboardService.projectmonthly(period)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            this.projectCount = data['body']['total']['count'];
            this.projectmonthlyitemsname = data['body']['items']['name'];
            this.projectmonthlyitemscount = data['body']['items']['count'];
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }
  setCont(type) {
    if (type == 'active') {
      this.customertype = "active";
    }
    else if (type == 'dormant') {
      this.customertype = "dormant";
    }
    else {
      this.customertype = "active";
    }
    this.activecustomer(this.customerhealthperiod)
  }
  activecustomer(period) {
    this.customerhealthperiod = period
    this.loader.show();
    this.DashboardService.customerHealthReport(period, this.customertype)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {
            var chart;
            let cat = [];
            let cat2 = [];
            if (data['body']['company_datas'] != '') {
              let data1 = data['body']['company_datas'].split(',');

              data1.forEach(function (item) {
                cat.push(item);

              });
              cat2 = data['body']['chart_date']
            }
            else {
              this.myOptionscustomer = {};
            }


            this.myOptionscustomer = {
              chart: {
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                renderTo: 'customerhealthcharts'
              },
              title: {
                text: 'Customer Health Index'
              },
              colors: ['#FFFFFF'],
              yAxis: {
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                title: {
                  text: ''
                },
                labels:
                {
                  style: {
                    color: '#FFFFFF'
                  }
                }



              },
              xAxis: {
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                minorGridLineWidth: 0,
                minorTickLength: 0,
                tickLength: 0,

                title: {

                  style: {
                    color: '#FFFFFF'
                  }
                },
                categories: cat,
                labels:
                {
                  enabled: false
                }


              },

              series: [{
                showInLegend: false,
                name: ' ',
                data: cat2,
              }]
            }
            if (data['body']['company_datas'] == '') {
              chart = Highcharts.chart('customerhealthcharts', this.myOptionscustomer, function (chart) { // on complete

                chart.renderer.text('No Data Available', 140, 100)
                  .css({
                    color: '#FFFFFF',
                    fontSize: '13px'
                  })
                  .add();

              });
            }
            else {
              Highcharts.chart('customerhealthcharts', this.myOptionscustomer);
            }
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        }
      );
  }
}
