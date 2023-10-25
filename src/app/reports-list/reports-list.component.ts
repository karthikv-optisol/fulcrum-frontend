import { Component, ElementRef, HostListener, ComponentFactoryResolver, OnInit, Renderer2, ViewChild, ViewContainerRef, Input, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from "jquery";
import { first, map, startWith } from 'rxjs/operators';
import { ReportsListService } from './../services/reports-list.service';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgbDate, NgbDateStruct, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { KeyValue } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'; export interface User {
  name: string;
  id: number;
}
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}; const now = new Date();
@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportsListComponent implements OnInit {
  isShown: boolean = true;
  isShownOther: boolean = true;
  isShownActive: boolean = false;
  isShownFileManager: boolean = true;
  isShownReports: boolean = true;
  pid: string;
  search: string = "";
  modalloading: boolean = false;
  settheCot: boolean = false;
  despco_description: boolean = false;
  setshowCodeCodeAmt: boolean = false;
  Arraysidemenu: any;
  showProjectNavBox: any;
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: any;
  arrCompletedProjects: any;
  arrActiveProjects: any;
  arrOtherProjects: any;
  userrole: any;
  isguest: boolean;
  ReportsListarr = [];
  ddlreallocationStatus = []; ddlSubcontractorBidStatuses = [];
  ddlSubmittalStatuses = [];
  ddlrequestForInformationStatus = [];
  ddlsubinvStatus = [];
  ddlCoTypes = [];
  ddlMeetingTypes = [];
  i: number;
  selectedreport: string;
  assignselected: boolean;
  usersdetails = [];
  reportsempty: boolean;
  tilldate: Date;
  projectcreateddate: Date;
  delayFirstProject: Date;
  today: Date;
  bidderlist: any = [];
  buyouttlist: any = [];
  contactlist: any = [];
  tomorrow: any;
  oddrowheading = [];
  limit: any = 10;
  totalcount: number = 1;
  paginationData: any;
  p: number = 1;
  @Input() fieldvalue = '';
  Reportoption: string;
  selectreporttype: string;
  title = 'htmltopdf';
  IsshowActive: boolean = false;
  IsshowCompleted: boolean = false;
  IsshowOther: boolean = false;
  @ViewChild('table') table: ElementRef;
  hasSubContAmt: boolean = false;
  bidRecivedPercentage: any;
  contractedPercentage: any;
  overAlltotSubContActValFormatted: any;
  totbuyoutSavingHitFormatted: any;
  totalPSCVFormatted: any;
  commitedcontracts: any = [];
  arrUncommittedContracts: any = [];
  CorReports: any = [];
  selected_cotype: string;
  corfiltertype: any = '';
  pcoTotalCostCodeAmount;
  potentialCoContentTotalDays;
  corTotalCostCodeAmount;
  corTotalCostCodeDays;
  approvedTotalCostCodeAmount;
  approvedTotalCostCodeDays;
  totalAmt;
  pco_default_view: any = [];
  cor_submitted_default_view: any = [];
  approved_default_view: any = [];
  type_title_default_view;
  totspan_default_view;
  nospan_default_view;
  totAmountSpan_default_view;
  potentialCoContentTotalDays_subcontractor: any;
  pcoTotalCostCodeAmount_subcontractor: any;
  approvedTotalCostCodeDays_subcontractor: any;
  corTotalCostCodeAmount_subcontractor: any;
  corTotalCostCodeDays_subcontractor: any;
  approvedTotalCostCodeAmount_subcontractor: any;
  pco_subcontractor: any = [];
  approved_subcontractor: any = [];
  cor_submitted_subcontractor: any = [];
  contractlog = [];
  totalcount_contractlog: number = 1;
  totalcount_contactlist: number = 1;
  totalcountBuyoutLog: number = 1;
  CurrentBudget: any = [];
  DailyConstructionReport = [];
  unitCount: any;
  netRentableSqFt: any;
  total_buyout_forcast: any;
  total_forcast: any;
  OCODisplay: any;
  change_orders: any;
  coTotalValueFormatted: any;
  projectTotalFormatted: any;
  totalEstimatedSubcontractValueFormatted: any;
  totalVarianceFormatted: any;
  overall_Original_PSCV_f: any;
  overall_Reallocation_Val_f: any;
  totalPrimeScheduleValueFormatted: any;
  overall_Sco_amount_f: any;
  subtotalCostPerSqFtFormatted: any;
  CurrentBudgetArr: any = [];
  overall_OCO_Val_f: any;
  baseCdnUrl: any;
  fulcrumimg: any;
  project_name: any;
  projectAddress: any;
  jdlCreatedDate: any;
  amTemperature: any;
  amCondition: any;
  pmCondition: any;
  pmTemperature: any;
  project_escaped_address_line_1: any;
  display_address_line1: any = '';
  tableCombineManPowerRfi: any;
  numInspectionsThisWeek: any;
  numInspectionsToday: any;
  common_combineInspectionDelay: any = [];
  common_combineInspectionDelay_inspections: any;
  common_combineInspectionDelay_Schedule: any;
  jobsiteSiteWorkData: any = [];
  jobsite_notes: any;
  jobsiteBuildingData: any;
  DetailedWeekly: any = [];
  daysArr: any = [];
  dateerr: any = '';
  amCondition_Arr: any;
  amTemperatures_Arr: any;
  pmTemperatures_Arr: any;
  pmConditions_Arr: any;
  scheduledalys: any;
  jobsiteDailyLog: any;
  inspections: any;
  swpppnotes: any;
  jobsiteDailyBuild: any;
  visitors: any;
  othernotes: any;
  deliveries: any;
  safetyissues: any;
  extrawork: any;
  man_power: any;
  jobsiteDailyBuildArr: any;
  jobsiteDailyLogArr: any;
  man_powerArr: any;
  man_powerdate_count: any;
  reporttypeselected: any;
  lastDate: string;
  firstDate: string;
  extra_key: any;
  selyear: any;
  selmonth: any;
  dateArray: any[];
  model5: any;
  ManSummaryArr: any;
  finalDate: string;
  model7: any;
  now: Date = new Date();
  startDate: NgbDate | null;
  jobstatusArr: any;
  MeetingtypesList: any[];
  opentrackitemcontent: any;
  OpenRFITable: any;
  SubmittalsData: any;
  changeorderData: any;
  changeorderDatatotalcoschudlevalue: any;
  changeorderDatatotaldays: any;
  purchaseArr: any;
  Forcast: any;
  primeContractScheduledValueTotalcus: any;
  forecastedExpensesTotal: any;
  primeContractScheduledValueTotal: any;
  totalicount: any;
  totalbcount: any;
  yesdayManPowerrow_total: any;
  yesdayManPower: any;
  manpowerdays: number;
  navigatemanpowerdate: any;
  model8: { year: number; month: number; day: number; };
  meetingArr: any;
  attendandeesTd: any;
  next_meeting_location: any;
  nextMeetingEndDateDisplay: any;
  meetingStartDateDisplay: any;
  meetingEndDateDisplay: any;
  meeting_location: any;
  nextMeetingStartDateDisplay: any;
  meetingHeaderText: any;
  meeting_type_id: any;
  ddl_meeting_id: any;
  subDataViewDisplay: any;
  rfiDataViewDisplay: any;
  discussionHtmlContent: any;
  man_powerArrdatecount: any;
  coltotalarray: any;
  company_detaisArr: any;
  MonthlyManpowerArr: any;
  monthlymanpowerdaysarr: any;
  coltotalarraymonth: any;
  company_detaismonth: any;
  checkNull: any;
  prelimreports: any;
  projectdelayreports: any;
  totalcount_projectdelayreports: any;
  paginationDataprojectdelayreports: any;
  RFIbyid: any;
  paginationDataRFIbyid: any;
  totalcount_RFIbyid: any;
  RFIQA: any;
  totalcount_RFIQA: any;
  paginationDataRFIQA: any;
  SCOARR: any;
  filteroptval: any;
  overallPotentailTotal: any;
  userCanManageSCO: any;
  selected_view_option: any;
  sublistSArr: any;
  subcontractinvoice: any;
  ReallocationArr: any;
  vendorCompany: any;
  costCoDesc: any;
  subcontractorAudit: any;
  qb_customer: any;
  submittallogcostcodesarr: any;
  totalcount_submittallogcc: any;
  paginationDatasubmittallogcc: any;
  submittallogbyid: any;
  submittalnotes: any;
  submittallogbystatus: string;
  vectorCommonarr: any;
  vectorCommonCORarr: any;
  siteworkarr: any;
  inotescheck: any;
  buildingarr: any;
  softcostarr: any;
  weeklymanpowerdaysarr: any;
  weeklymanpowercompanyarr: any;
  weeklymanpowercoltotalarray: any;
  weeklyman_powerArrdatecount: any;
  weeklyjobs: any;
  weeklyjobsdays: any;
  weeklyjobsdaysamt: any;
  weeklyjobsdaysamc: any;
  weeklyjobsdayspmt: any;
  weeklyjobsdayspmc: any;
  generalArr: any;
  userCanViewReport: any;
  constructor(private formBuilder: FormBuilder, private fb: FormBuilder,
     public modalService: NgbModal, private httpClient: HttpClient, private route: ActivatedRoute,
      private componentFactoryResolver: ComponentFactoryResolver, private elementRef: ElementRef, private ReportsListService: ReportsListService, private router: Router, private titleService: Title, private renderer: Renderer2) {

    this.titleService.setTitle("Report - MyFulcrum.com");
    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(params['currentlySelectedProjectName']);
      }
    });
  }

  ngOnInit(): void {
    this.userrole = JSON.parse(localStorage.getItem('users'));
    if (this.userrole['userRole'] == 'guest') {
      this.isguest = true;
    }
    if (localStorage.getItem('users')) {
      this.getReportsoptions();
      this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport('');

    }
    else {
    }
    this.isShownReports = false;
    this.MeetingtypesList = [];
  }
  /*Weekly datepicker date selection*/
  hidedate() {
    $("#ui-datepicker-div").hide();
  }
  onDateSelect_other(event) {
    $('#bdate').removeClass('redBorderThick');
    let year = event.year;
    this.selyear = year;
    this.selmonth = event.month;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = month + "/" + day + "/" + year;
    this.finalDate = finalDate;

    if (this.reporttypeselected == 'Monthly Manpower') {
      var montharray = new Array();
      var today = new Date($("#bdatemanpower").val());
      var date = today, yearManpower = date.getFullYear(), monthManpower = date.getMonth();
      var days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      var firstDay = new Date(yearManpower, monthManpower, 1);
      var lastDay = new Date(yearManpower, monthManpower + 1, 0);
      this.manpowerdays = days;
      for (var i = 0; i < days; i++) {
        var tempDate = new Date(firstDay.getTime());
        tempDate.setDate(tempDate.getDate() + i);
        montharray.push(tempDate.getTime());
      }
      $('#bdatemanpower').val(this.MMDDYYYY(firstDay));
      this.navigatemanpowerdate = $("#bdatemanpower").val();
      $('#edate').val(this.MMDDYYYY(lastDay));

    }
    else  if (this.reporttypeselected == 'Weekly Manpower') {
      let date = new Date(Date.UTC(event.year, event.month - 1, event.day, 0, 0, 0))
      let days = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
      let day1 = days[date.getDay() - 1]
      
      if (day1 == undefined) //sunday selected
      {
        var today = new Date($(".otheroptions_wm #bdate").val());

        var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
        var sundayOfWeek = new Date(mondayOfWeek.getFullYear(), mondayOfWeek.getMonth(), mondayOfWeek.getDate() - mondayOfWeek.getDay() + 7);

        var firstDate = moment(mondayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
        var lastDate = moment(sundayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
      }
      else {
        var firstDate = moment(finalDate, "MM/DD/YYYY").day(1).format("MM/DD/YYYY");
        var lastDate = moment(finalDate, "MM/DD/YYYY").day(7).format("MM/DD/YYYY");
      }

      $('.otheroptions_wm #bdate').val(firstDate);
      $("#edate").val(lastDate);

      var dateArray = [];
      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
      while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('MM/DD/YYYY'))
        currentDate = moment(currentDate).add(1, 'days');
      }
      this.dateArray = dateArray;


    }


    else  if (this.reporttypeselected == 'Weekly Job') {
      let date = new Date(Date.UTC(event.year, event.month - 1, event.day, 0, 0, 0))
      let days = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
      let day1 = days[date.getDay() - 1]
      
      if (day1 == undefined) //sunday selected
      {
        var today = new Date($(".otheroptions_wj #bdate").val());

        var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
        var sundayOfWeek = new Date(mondayOfWeek.getFullYear(), mondayOfWeek.getMonth(), mondayOfWeek.getDate() - mondayOfWeek.getDay() + 7);

        var firstDate = moment(mondayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
        var lastDate = moment(sundayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
      }
      else {
        var firstDate = moment(finalDate, "MM/DD/YYYY").day(1).format("MM/DD/YYYY");
        var lastDate = moment(finalDate, "MM/DD/YYYY").day(7).format("MM/DD/YYYY");
      }

      $('.otheroptions_wj #bdate').val(firstDate);
      $("#edate").val(lastDate);

      var dateArray = [];
      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
      while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('MM/DD/YYYY'))
        currentDate = moment(currentDate).add(1, 'days');
      }
      this.dateArray = dateArray;


    }
    else {
      $('#bdate').val(finalDate);
    }
  }
  onDateSelect(event) {
    $('#bdate').removeClass('redBorderThick');
    let year = event.year;
    this.selyear = year;
    this.selmonth = event.month;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = month + "/" + day + "/" + year;

    let date = new Date(Date.UTC(event.year, event.month - 1, event.day, 0, 0, 0))
    let days = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    let day1 = days[date.getDay() - 1]



    if (this.reporttypeselected == 'Detailed Weekly') {
      if (day1 == undefined) //sunday selected
      {
        var today = new Date($("#bdateadded").val());

        var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
        var sundayOfWeek = new Date(mondayOfWeek.getFullYear(), mondayOfWeek.getMonth(), mondayOfWeek.getDate() - mondayOfWeek.getDay() + 7);

        var firstDate = moment(mondayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
        var lastDate = moment(sundayOfWeek, "MM/DD/YYYY").format("MM/DD/YYYY");
      }
      else {
        var firstDate = moment(finalDate, "MM/DD/YYYY").day(1).format("MM/DD/YYYY");
        var lastDate = moment(finalDate, "MM/DD/YYYY").day(7).format("MM/DD/YYYY");
      }

      $('#bdateadded').val(firstDate);
      $("#edate").val(lastDate);

      var dateArray = [];
      var currentDate = moment(firstDate);
      var stopDate = moment(lastDate);
      while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('MM/DD/YYYY'))
        currentDate = moment(currentDate).add(1, 'days');
      }
      this.dateArray = dateArray;


    }
    else {
      $('#bdate').val(finalDate);

      this.dateArray = [];
      $('.highlighted-week').removeClass('highlighted-week');
    }

  }
  addhighlightclass() {
    if ((this.reporttypeselected == 'Detailed Weekly') || (this.reporttypeselected == 'Weekly Manpower')|| (this.reporttypeselected == 'Weekly Job')){
      if (this.dateArray != undefined) {
        for (let index = 0; index < this.dateArray.length; ++index) {
          const element = this.dateArray[index];
          var split_firstdate = element.split('/');
          var loop_lastdate = parseInt(split_firstdate[1]);
          var selmonth = parseInt(split_firstdate[0]);
          var selyear = parseInt(split_firstdate[2]);
          $('#' + loop_lastdate + '_' + selyear + '_' + selmonth).removeClass('bg-primary');
          $('#' + loop_lastdate + '_' + selyear + '_' + selmonth).addClass('highlighted-week');
        }
      }
    }
    else if (this.reporttypeselected == 'Monthly Manpower') {

      var split_month = $('#bdatemanpower').val().split('/');
      var monthmanpowerunique = parseInt(split_month[0]);
      var yearmanpowerunique = parseInt(split_month[2]);
      var datemanpowerunique = parseInt(split_month[1]);
      $('.bg-primary').removeClass('bg-primary');
      for (var i = 1; i <= 31; i++) {
        $('#' + i + '_' + yearmanpowerunique + '_' + monthmanpowerunique).removeClass('bg-primary');
        $('#' + i + '_' + yearmanpowerunique + '_' + monthmanpowerunique).addClass('highlighted-week');
      }
      this.model8 = { month: monthmanpowerunique, day: datemanpowerunique, year: yearmanpowerunique };

    }
    else {
      this.dateArray = [];
      $('.bg-primary').removeClass('bg-primary');
      $('.highlighted-week').removeClass('highlighted-week');
    }



  }
  onDateSelect1(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = month + "/" + day + "/" + year;

    $('#edate').val(finalDate);
  }
  onDateSelect2(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = month + "/" + day + "/" + year;

    $('#date').val(finalDate);
  }
  openDatepicker(id) {
    id.open();
  }
  closeDatepicker(id) {
    id.close();
  }
  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
  public exportAsXLSX(): void {
    if(this.subcontractorAudit != '')
    {
     setTimeout(() => {

        const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb, 'Subcontractor Audit List.xlsx');
        
   }, 7000);
      
    }
  
    // const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.subcontractorAudit);
    // const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, 'testinggg');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }
  initchangelist() {
    this.SelectedReportChange();
    var type = $('#ddl_report_id').find(":selected").text();
    var explode = type.split(',');
    /*report type name*/
    var value = explode[0];
    this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport('');
  }

  Weekpicker = function (_selectedDate, count) {
    var week = new Array();
    var today = new Date($("#bdate").val());
    var countDay = count;
    if (countDay == 0) {
      var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
      var sundayOfWeek = new Date(mondayOfWeek.getFullYear(), mondayOfWeek.getMonth(), mondayOfWeek.getDate() - mondayOfWeek.getDay() + 7);
    } else {
      var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
      var sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
    }
    for (var i = 0; i < 7; i++) {
      var tempDate = new Date(mondayOfWeek.getTime());
      tempDate.setDate(tempDate.getDate() + i);
      week.push(tempDate.getTime());
    }
    $('#bdate').val(this.MMDDYYYY(mondayOfWeek));
    $('#edate').val(this.MMDDYYYY(sundayOfWeek));

    return week;
  };

  /*Monthly datepicker selection date*/
  Monthpicker = function (_selectedDate) {
    var montharray = new Array();
    var today = new Date($("#bdate").val());
    var date = today, year = date.getFullYear(), month = date.getMonth();
    var days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    for (var i = 0; i < days; i++) {
      var tempDate = new Date(firstDay.getTime());
      tempDate.setDate(tempDate.getDate() + i);
      montharray.push(tempDate.getTime());
    }
    $('#bdate').val(this.MMDDYYYY(firstDay));
    $('#edate').val(this.MMDDYYYY(lastDay));
    return montharray;
  };
  SelectedReportChange() {
    this.p = 1;
    this.limit = '';
    this.dateArray = [];
    $('.ngb-dp-day .bg-primary').removeClass('bg-primary');
    $('.ngb-dp-day .highlighted-week').removeClass('highlighted-week');
    $('#bdate').removeClass('redBorderThick');
    $('#edate').removeClass('redBorderThick');
    $("#reallocationDrawId").removeClass('redBorderThick');
    $("#reallocationDrawId").val('');
    $('#report_name').val('');
    $('#Delays_html').hide();
    $('#bdate').removeAttr('placeholder');
    $('#edate').removeAttr('placeholder');
    /*check the radio button default html*/
    $("input[name=ReportOption][value=Html]").prop('checked', true);
    $(".envelop").css('display', 'none');

    var type = $('#ddl_report_id').val();
    var cotype = $('#view_status').val();
    this.selected_cotype = cotype;
    if (type != undefined) {
      var explode = type.split(',');
    }

    /*report type name*/
    var value = explode[0];
    this.reporttypeselected = value;
    /*select date type*/
    var datetype = explode[1];
    /*export pdf permission -Y || N */
    var pdf = explode[2];
    /*export xlsx permission - Y || N*/
    var xlsx = explode[3];
    this.i = 0;
    if(value=="Subcontractor Audit List"){
			$('.costcode').css('display','block');
			$('.subcontractor').css('display','block');
			$('.commonDate').css('display','none');
			$('.particularDate').css('display','none');			
			$('.fs-option').removeClass('selected');
			$('.multiple').addClass('fs-default');
			$('.fs-label').empty().html('Select Options');
			$('#ddlSortBy').val('');
			$('#ddlStatus').val('');
		}else{
			$('.costcode').css('display','none');
			$('.subcontractor').css('display','none');
		}
    if (value == "Reallocation") {
      $('.reallocation').css('display', 'block');
      $('#cost_code_alias').prop('checked', false);
    } else {
      $('.reallocation').css('display', 'none');
    }
    /*PDF radio button enable*/
    if (pdf == 'Y') {
      $('.hidden_pdfradio').css('display', 'block');
    }
    else {
      $('.hidden_pdfradio').css('display', 'none');
    }
    /*csv radio button enable*/
    if (xlsx == 'Y') {
      $('.hidden_xlsxradio').css('display', 'block');
    }
    else {
      $('.hidden_xlsxradio').css('display', 'none');
    }

    if (value == 'Buyout Log') {
      $('.BuyoutLogchk').css('display', 'block');
      $('#buyoutlog_sub_amt').prop('checked', false);
      $('#buyoutlog_cc_alias').prop('checked', false);
    } else {
      $('.BuyoutLogchk').css('display', 'none');
    }

    if (value == 'Buyout Summary') {
      $('.BuyoutSummarychk').css('display', 'block');
      $('#buyoutSum_cc_alias').prop('checked', false);
    } else {
      $('.BuyoutSummarychk').css('display', 'none');
    }

    if (value == "Change Order") {
      $('.table_report').css('min-width', '132%');
      $('.co_rt').css('display', 'block');
      $('.changechk').css('display', 'block');
      $('#despco').prop('checked', false);
      $('#showChangeOrderReject').prop('checked', false);
      $('#showChangeOrderCostCodeAmount').prop('checked', false);
      if (cotype == "subcontractor") {
        $("#showChangeOrderCost").hide();
        $('#showChangeOrderCostCodeAmount').prop('checked', false);
      } else {
        $("#showChangeOrderCost").show();
      }

    } else {
      $('.table_report').css('min-width', '110%');
      $('.co_rt').css('display', 'none');
      $('.changechk').css('display', 'none');
    }
    if (value && value.startsWith("RFI Report") && value != 'RFI Report - QA - Open') {
      $('.requestForInformationStatuslist').css('display', 'block');
    } else {
      $('.requestForInformationStatuslist').css('display', 'none');
    }

    if (value && value.startsWith("Submittal")) {
      $('.submittalStatuslist').css('display', 'block');
      $('.fs-option').removeClass('selected');
      $('.multiple').addClass('fs-default');
      $('.fs-label').empty().html('Select Options');
    } else {
      $('.submittalStatuslist').css('display', 'none');
    }

    if (value == "Project Delay Log") {
      $('.delayStatuslist').css('display', 'block');
    } else {
      $('.delayStatuslist').css('display', 'none');
    }
    if (value == "Subcontract Invoice") {
      $('.subcontract_inv').css('display', 'block');
    } else {
      $('.subcontract_inv').css('display', 'none');
    }
    if (value == "Current Budget") {
      $('.crntBgtChkGrp').css('display', 'block');
      $('#crntBgtNotes').prop('checked', false);
      $('#crntBgt_val_only').prop('checked', true);
      $('#crntBgt_sub_total').prop('checked', false);
      $('#crntBgt_cc_alias').prop('checked', false);
    } else {
      $('.crntBgtChkGrp').css('display', 'none');
    }

    if (value == "Vector Report") {
      $('.changechkgrp').css('display', 'block');
      $('#grouprowval').prop('checked', true);
      $('#groupco').prop('checked', true);
      $('#generalco').prop('checked', true);
      $('#inotes').prop('checked', false);
      $('#vector_sub_total').prop('checked', false);
      $('#vector_cc_alias').prop('checked', false);
    } else {
      $('.changechkgrp').css('display', 'none');
    }
    if (value == "Meetings - Tasks") {
      $('.MT_rt').css('display', 'block');
    } else {
      $('.MT_rt').css('display', 'none');
    }
    if (value == "SCO") {
      $('.SCO_rt').css('display', 'block');
      $('.SCOchk').css('display', 'block');

    }
    else {
      $('.SCO_rt').css('display', 'none');
      $('.SCOchk').css('display', 'none');
    }

    if (value == "Bidder List") {
      $('.bidlist').css('display', 'block');
      $('.commonDate').css('display', 'none');
      $('.particularDate').css('display', 'none');
      $('.fs-option').removeClass('selected');
      $('.multiple').addClass('fs-default');
      $('.fs-label').empty().html('Select Options');
      $('#ddlSortBy').val('');
      $('#ddlStatus').val('');
    } else {
      if (datetype != "None")
        $('.commonDate').css('display', 'block');
      $('.particularDate').css('display', 'none');
      $('.bidlist').css('display', 'none');

    }
    /*
    Date Picker types
    Week type
    Month type
    Custom type (Any date selection)
    Project (start and till date of the project).
    None (hide the datepicker option for select another type)
    */


    var splitprojectcreateddate = $('#projectcreateddate').val().split('/');
    var loop_lastdate = parseInt(splitprojectcreateddate[1]);
    var selmonth = parseInt(splitprojectcreateddate[0]);
    var selyear = parseInt(splitprojectcreateddate[2]);
    this.startDate = new NgbDate(selyear, selmonth, loop_lastdate);
    if (value == 'Detailed Weekly') {
      $('.detailedoptions').show();
      $('.otheroptions').hide();
      $('.otheroptions_manpower').hide();
      $('.otheroptions_wm').hide();$('.otheroptions_wj').hide();
    }
    else if (value == 'Monthly Manpower') {
      $('.otheroptions_manpower').show();
      $('.otheroptions').hide();
      $('.detailedoptions').hide();$('.otheroptions_wm').hide();$('.otheroptions_wj').hide();
    }
    else if (value == 'Weekly Manpower') {
      $('.otheroptions_manpower').hide();
      $('.otheroptions').hide();
      $('.detailedoptions').hide();
      $('.otheroptions_wm').show();
      $('.otheroptions_wj').hide();
    }
    else if (value == 'Weekly Job') {
      $('.otheroptions_manpower').hide();
      $('.otheroptions').hide();
      $('.detailedoptions').hide();
      $('.otheroptions_wm').hide();
      $('.otheroptions_wj').show();
    }
    else {
      $('.otheroptions').show();
      $('.detailedoptions').hide();
      $('.otheroptions_manpower').hide();$('.otheroptions_wm').hide();$('.otheroptions_wj').hide();
    }
    if (datetype == "Week") {
      $('#edate').attr('disabled', true);
      $('.datedivseccal_icon_gk1').attr('disabled', true);
      $('#bdateadded').val('');
      if (this.dateArray != undefined) {
        for (let index = 0; index < this.dateArray.length; ++index) {
          const element = this.dateArray[index];
          var split_firstdate = element.split('/');
          var loop_lastdate = parseInt(split_firstdate[1]);
          var selmonth = parseInt(split_firstdate[0]);
          var selyear = parseInt(split_firstdate[2]);
          $('#' + loop_lastdate + '_' + selyear + '_' + selmonth).removeClass('highlighted-week');
        }
      }
      $('#edate').val('');
      $('#bdateadded').attr('placeholder', 'Pick a Date');
      if (value == 'Weekly Manpower') {
        $('.otheroptions_wm #bdate').attr('placeholder', 'Pick a Date');
        $('.otheroptions_wm #bdate').val('');
      }
      else if (value == 'Weekly Job') {
        $('.otheroptions_wj #bdate').attr('placeholder', 'Pick a Date');
        $('.otheroptions_wj #bdate').val('');
      }
      else{
        $('#bdate').val($('#projectcreateddate').val());
      }
      
     
      this.i = 1;
    } else if (datetype == "Month") {
      $('#edate').attr('disabled', true);
      $('.datedivseccal_icon_gk1').attr('disabled', true);
      $('#bdate').val('');
      $('#edate').val('');
      $('#bdate').attr('placeholder', 'Pick a Date');
     
      this.i = 1;
    } else if (datetype == "None") {
      $('.datepicker_style_custom').hide();
      $('.commonDate').css('display', 'none');

    } else if (datetype == "Project") {

      $('#edate').val($('#tilldate').val());

      $('#bdate').val(this.projectcreateddate);
      $('#edate').attr('placeholder', 'Pick a Date');
      $('.datedivseccal_icon_gk1').removeAttr('disabled', 'disabled');
      $('.datedivseccal_icon_gk').removeAttr('disabled', 'disabled');
      $('#edate').removeAttr('disabled', 'disabled');
      $('#bdate').removeAttr('disabled', 'disabled');

      this.i = 1;
      //added for subcontract report from date to piror week
      // if (value == "SC") {
      //   var d = new Date();
      //   var pieces = $('#bdate').val().split("/");

      //   var dateNow = new Date();
      //   var firstDayOfTheWeek = (dateNow.getDate() - dateNow.getDay()) + 1; // Remove + 1 if sunday is first day of the week.
      //   var lastDayOfTheWeek = firstDayOfTheWeek + 6;
      //   var firstDayOfLastWeek = new Date(dateNow.setDate(firstDayOfTheWeek - 7));
      //   var lastDayOfLastWeek = new Date(dateNow.setDate(lastDayOfTheWeek - 7));
      //   var datea = new Date(firstDayOfLastWeek)
      //   var formatDate = ("0" + (datea.getMonth() + 1)).slice(-2) + '/' +
      //     ("0" + datea.getDate()).slice(-2) + '/' +
      //     d.getFullYear();
      //   $('#bdate').val(formatDate);

      // }
      //added
    }
    else if (datetype == "Filter") {
      if (($('#delayFirstProject').val()) != '') {
        $('#bdate').val($('#delayFirstProject').val());
      }
      else {
        $('#bdate').val($('#tilldate').val());
      }
      $('#edate').val($('#tilldate').val());
      $('#bdate').attr('placeholder', 'Pick a Date');
      $('#edate').attr('placeholder', 'Pick a Date');
      $('.datedivseccal_icon_gk1').removeAttr('disabled', 'disabled');
      $('.datedivseccal_icon_gk').removeAttr('disabled', 'disabled');
      $('#edate').removeAttr('disabled', 'disabled');
      $('#bdate').removeAttr('disabled', 'disabled');
      this.i = 1;
    } else if (datetype == "Custom") {
      $('.datedivseccal_icon_gk1').removeAttr('disabled', 'disabled');
      $('.datedivseccal_icon_gk').removeAttr('disabled', 'disabled');
      $('#edate').removeAttr('disabled', 'disabled');
      $('#bdate').removeAttr('disabled', 'disabled');
      $('#edate').val('');

      $('#bdate').after('<input type="text" value="" class="bcus_date cus_date_report">');
      $('#bdate').remove();
      $('.bcus_date').attr('id', 'bdate')
      // $("#bdate").datepicker({ changeMonth: true, changeYear: true, dateFormat: 'mm/dd/yy', numberOfMonths: 1 });
      $('#edate').removeAttr('disabled', 'disabled');
      $('#bdate').val(this.MMDDYYYY(new Date()));
      $('#edate').val(this.MMDDYYYY(new Date()));
      $('#bdate').attr('placeholder', 'Pick a Date');
      $('#edate').attr('placeholder', 'Pick a Date');
      this.i = 1;

    } else if (datetype == "Particular Date") {
      $('.particularDate').show();
      $('.datepicker_style_particular').show();
      $('.datepicker_style_custom').hide();
      $('.commonDate').hide();
    }
    var ival = this.i;
    if (ival == 1) {

      $('.datepicker_style_custom').show();
      $('.commonDate').css('display', 'block');
      // $("#bdate").datepicker({ changeMonth: true, changeYear: true, dateFormat: 'mm/dd/yy', numberOfMonths: 1 });

    }

  }

  returnZero() {
    return 0
  }
  asIsOrder(a, b) {
    return 1;
  }
  checkheading(bidderlist) {
    if (bidderlist.is_heading == true) {
      return true;
    }
    else {
      return false;

    }
  }
  showreportsbyentries(event, kpiValue) {
    var type = $('#ddl_report_id').val();
    var explode = type.split(',');
    /*report type name*/
    var value = explode[0];
    this.limit = event;
    if (value === 'Bidder List') {
      this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue);
    }

  }
  searchreports(event, kpiValue) {
    var type = $('#ddl_report_id').val();
    var explode = type.split(',');
    /*report type name*/
    var value = explode[0];
    if (value === 'Bidder List') {
      if ((event) && (event.length >= 3)) {
        this.search = event;
        this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue);

      }
      else {

        this.search = "";
        this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue);


      }
    }

  }
  GenerateReport(kpiValue) {
    $('#Delays_html').show();
    this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue);
  }
  handlePageChange(event: number, kpiValue): void {
    this.p = event;
    this.Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue);
  }
  selected(change: MatSelectChange) {
    if (change.value.length > 0) {
      change.value = change.value.join();
      this.corfiltertype = change.value;
    }
    else {
      this.corfiltertype = '';
    }

  }
  Purchasing_Subcontractor_Bid_List_Report__updateBidderListReport(kpiValue) {
    try {
      if (kpiValue == null) {
        theStatus = '';
      }
      else {
        var theStatus = kpiValue.toString();
      }

      var theSortBy = $("#ddlSortBy").val();
      if (theSortBy == null) {
        theSortBy = '';
      }
      var projectId = $("#currentlySelectedProjectId").val();
      var projectName = $('#projectName').val();
      var despco = $('#despco').prop('checked');
      var showreject = $('#showChangeOrderReject').prop('checked');
      var showCodeCodeAmt = $('#showChangeOrderCostCodeAmount').prop('checked');
      var type = $('#ddl_report_id').find(":selected").val();
      if (type != undefined) {
        var explode = type.split(',');
        /*report type name*/
        var value = explode[0];
      }
      else {
        var value = 'Bidder List';
      }
      var ReportType = value;
      var report_view = value;
      var Reportoption = $("input[name='ReportOption']:checked").val();
      if (Reportoption == undefined) {
        this.Reportoption = 'Html';
      }
      else {
        this.Reportoption = Reportoption;
      }

      this.selectreporttype = ReportType;

      if (this.selectreporttype == "Buyout Log") {
        var theCot = $("#buyoutlog_sub_amt").prop('checked');
        despco = $("#buyoutlog_cc_alias").prop('checked');
      }
      else if (this.selectreporttype == "Buyout Summary") {
        var theCot =  $("#buyoutSum_cc_alias").prop('checked');
        despco = false;
      }
      else if (this.selectreporttype == "Change Order") {
        var theCot = this.corfiltertype;

        if (theCot != '' && theCot != null) {
          theCot = this.corfiltertype;
        }
        this.despco_description = despco;
      }
      else if (this.selectreporttype == "Project Delay Log") {
        theCot = $("#DelayStatuses").val();
      }
      else if ((this.selectreporttype == "RFI Report - by ID") || (this.selectreporttype == "RFI Report - QA")) {
        theCot = $("#requestForInformationStatus").val();
      }
      else {
        theCot = false;
        despco = false;
      }
      if (theCot == true) {
        this.settheCot = true;
      }
      else {
        this.settheCot = false;
      }
      if (showCodeCodeAmt == true) {
        this.setshowCodeCodeAmt = true;
      }
      else {
        this.setshowCodeCodeAmt = false;
      }
      if (this.selectreporttype == "Change Order") {
        var view_option = $("#view_status").val();
        var date = $('#delayFirstProject').val();
        var date1 = $('#tilldate').val();
      }
      else if (this.selectreporttype == "Detailed Weekly") {
        var date = $('#bdateadded').val();
        var date1 = $('#edate').val();
      }
       else if (this.selectreporttype == "Weekly Manpower") {
        var date = $('.otheroptions_wm #bdate').val();
        var date1 = $('#edate').val();
      }
      else if (this.selectreporttype == "Weekly Job") {
        var date = $('.otheroptions_wj #bdate').val();
        var date1 = $('#edate').val();
      }
      else if (this.selectreporttype == "Monthly Manpower") {
        var date = $('#bdatemanpower').val();
        var date1 = $('#edate').val();
      }
      else if (this.selectreporttype == "SCO") {
        var view_option = $("#sview_status").val();
        this.selected_view_option =view_option;
        var filteropt = $("#sco_filter").val();
        this.filteroptval = $("#sco_filter").val();
        var inc_pot = $("#in_potential").prop("checked");
        var ch_potential;
        if (inc_pot) {
          ch_potential = "Y";
        } else {
          ch_potential = "N";
        }
      }
      else {
        var date = $('#bdate').val();
        var date1 = $('#edate').val();
      }

      if (this.selectreporttype == "Current Budget") {
        var crntNotes = $('#crntBgtNotes').prop('checked');
        var crntSubtotal = $('#crntBgt_sub_total').prop('checked');
        var crntBgt_val_only = $('#crntBgt_val_only').prop('checked');
        var costCodeAlias = $('#crntBgt_cc_alias').prop('checked');
      }
      else {
        var crntNotes = false;
        var crntSubtotal = false;
        var crntBgt_val_only = false;
        var costCodeAlias = false;
      }
      if (this.selectreporttype == "Daily Construction Report (DCR)") {
        var dateDCR = $('#date').val();
      }
      else {
        var dateDCR = false;
      }
      if (this.selectreporttype == "Detailed Weekly") {
        var bdate = $('#bdateadded').val();

        if (bdate == '') {
          $('#bdateadded').addClass('redBorderThick');
          this.dateerr = true;
        }
        else {
          $('#bdateadded').removeClass('redBorderThick');
          this.dateerr = '';
        }

      }
      else {
        bdate = false;
        this.dateerr = '';
        $('#bdate').removeClass('redBorderThick');
      }
      if (this.selectreporttype == "Meetings - Tasks") {

        this.meeting_type_id = $("#ddl_meeting_type_id").val();
        this.ddl_meeting_id = $("#ddl_meeting_id").val();
      }
      else {
        this.meeting_type_id = '';
        this.ddl_meeting_id = '';
      }
      if (ReportType=="Subcontract Invoice") {		
        theCot =  this.corfiltertype;
      }
      var reallocationDrawId = $('#reallocationDrawId').val();
	var reallocationStatus = $('#cost_code_alias').prop('checked');
      if (ReportType=="Reallocation") {		
        theCot = reallocationDrawId;
        despco = reallocationStatus;
        if((theCot == ''))
        {
          this.dateerr = true;
          $('#reallocationDrawId').addClass('redBorderThick');
        }
        else{
          this.dateerr = '';
          $('#reallocationDrawId').removeClass('redBorderThick');
        }
      }
      if (ReportType=="Vector Report") {		
        var grouprowval = $('#grouprowval').prop('checked');
        var groupco = $('#groupco').prop('checked');
        var generalco = $('#generalco').prop('checked');
        var inotes = $('#inotes').prop('checked');
        this.inotescheck =inotes;
        var subtotal = $('#vector_sub_total').prop('checked');
        var costCodeAlias = $('#vector_cc_alias').prop('checked');
      }
      var vendor_id = $("#vendor_id").val();
      var qb_customer = $("#qb_customer").val();
      var cc_id = $("#cc_id").val();
      var vendor = $("#vendor_id :selected").text();
      if(ReportType && ReportType.startsWith('Submittal')){
        theCot = this.corfiltertype;
        if(theCot!='' && theCot!=null){
          theCot = theCot;
        }
      }

      if (this.selectreporttype == "Weekly Manpower") {
        var bdate = $('.otheroptions_wm #bdate').val();

        if (bdate == '') {
          $('.otheroptions_wm #bdate').addClass('redBorderThick');
          this.dateerr = true;
        }
        else {
          $('.otheroptions_wm #bdate').removeClass('redBorderThick');
          this.dateerr = '';
        }

      }
      else {
        bdate = false;
        this.dateerr = '';
        $('#bdate').removeClass('redBorderThick');
      }
      if (this.selectreporttype == "Weekly Job") {
        var bdate = $('.otheroptions_wj #bdate').val();

        if (bdate == '') {
          $('.otheroptions_wj #bdate').addClass('redBorderThick');
          this.dateerr = true;
        }
        else {
          $('.otheroptions_wj #bdate').removeClass('redBorderThick');
          this.dateerr = '';
        }

      }
      else {
        bdate = false;
        this.dateerr = '';
        $('#bdate').removeClass('redBorderThick');
      }

      if (this.dateerr) {
        this.messageAlert('Please fill in the highlighted areas .', 'errorMessage', '', 'none');
      }
      else {
        this.modalloading = true;
        if (this.Reportoption == 'PDF') {

          this.ReportsListService.GenerateReportPDF(grouprowval,groupco,generalco,inotes,subtotal,
            vendor_id,qb_customer,cc_id,vendor,filteropt,ch_potential ,this.meeting_type_id, this.ddl_meeting_id, dateDCR, crntNotes, crntSubtotal, crntBgt_val_only, costCodeAlias, view_option, showCodeCodeAmt, showreject, theCot, despco, this.Reportoption, this.search, this.p, this.limit, theStatus, theSortBy, ReportType, report_view, projectName, date, date1)
            .pipe(first())
            .subscribe(
              data => {
                this.modalloading = false;
                if (data['status']) {
                  this.DeleteTempPath(data['body']['tempFileName']);
                  this.limit = ''; this.p = 1;
                  if (this.selectreporttype == "Bidder List") {
                    this.CorReports = 0;
                    this.buyouttlist = this.commitedcontracts = this.arrUncommittedContracts = '';
                    if ((data['body']['arrBidders']['arrBidders'].length > 0) && (data['body']['arrBidders']['arrBidders'] != null)) {
                      this.bidderlist = data['body']['arrBidders']['arrBidders'];
                      this.totalcount = data['body']['arrBidders']['count'];
                    }
                  }
                  else if (this.selectreporttype == "Buyout Log") {
                    this.bidderlist = this.commitedcontracts = this.arrUncommittedContracts = '';
                    this.CorReports = 0;
                    if ((data['body']['arrBidders']['arrBuyout'].length > 0) && (data['body']['arrBidders']['arrBuyout'] != null)) {
                      this.buyouttlist = data['body']['arrBidders']['arrBuyout'];
                      this.totalcountBuyoutLog = data['body']['count'];
                    }
                  }
                  else if (this.selectreporttype == "Buyout Summary") {
                    this.bidderlist = '';
                    this.buyouttlist = ''; this.CorReports = [];
                    if ((data['body']['arrBidders']['commitedcontracts'].length > 0) && (data['body']['arrBidders']['commitedcontracts'] != null)) {
                      this.commitedcontracts = data['body']['arrBidders']['commitedcontracts'];
                    }
                    if ((data['body']['arrBidders']['arrUncommittedContracts'].length > 0) && (data['body']['arrBidders']['arrUncommittedContracts'] != null)) {
                      this.arrUncommittedContracts = data['body']['arrBidders']['arrUncommittedContracts'];

                    }
                  }
                  else if (this.selectreporttype == "Change Order") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = '';

                    if ((data['body']['arrBidders']['arrChangeOrders'].length > 0) && (data['body']['arrBidders']['arrChangeOrders'] != null)) {
                      this.CorReports = data['body']['arrBidders']['arrChangeOrders'];
                      if (data['body']['arrBidders']['arrChangeOrders'] != null) {

                        this.pcoTotalCostCodeAmount = data['body']['arrBidders']['arrChangeOrders'][0]['pcoTotalCostCodeAmount'];

                        this.potentialCoContentTotalDays = data['body']['arrBidders']['arrChangeOrders'][0]['potentialCoContentTotalDays'];
                        this.corTotalCostCodeAmount = data['body']['arrBidders']['arrChangeOrders'][0]['corTotalCostCodeAmount'];
                        this.corTotalCostCodeDays = data['body']['arrBidders']['arrChangeOrders'][0]['corTotalCostCodeDays'];
                        this.approvedTotalCostCodeAmount = data['body']['arrBidders']['arrChangeOrders'][0]['approvedTotalCostCodeAmount'];
                        this.approvedTotalCostCodeDays = data['body']['arrBidders']['arrChangeOrders'][0]['approvedTotalCostCodeDays'];
                        this.totalAmt = data['body']['arrBidders']['arrChangeOrders'][0]['totalAmt'];
                        this.pco_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['pco'];
                        this.cor_submitted_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['cor_submitted'];
                        this.approved_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['approved'];
                        this.type_title_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['type_title'];
                        this.totspan_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['totspan'];
                        this.nospan_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['nospan'];
                        this.totAmountSpan_default_view = data['body']['arrBidders']['arrChangeOrders'][0]['totAmountSpan'];

                        this.pcoTotalCostCodeAmount_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['pcoTotalCostCodeAmount_subcontractor'];
                        this.potentialCoContentTotalDays_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['potentialCoContentTotalDays_subcontractor'];
                        this.corTotalCostCodeAmount_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['corTotalCostCodeAmount_subcontractor'];
                        this.corTotalCostCodeDays_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['corTotalCostCodeDays_subcontractor'];
                        this.approvedTotalCostCodeAmount_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['approvedTotalCostCodeAmount_subcontractor'];
                        this.approvedTotalCostCodeDays_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['approvedTotalCostCodeDays_subcontractor'];
                        if (view_option == 'subcontractor') {
                          if (typeof data['body']['arrBidders']['arrChangeOrders'][0]['pco_subcontractor'] != 'undefined') {
                            this.pco_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['pco_subcontractor']['costcodes'];
                          }
                          else {
                            this.pco_subcontractor = [];
                          }
                          if (typeof data['body']['arrBidders']['arrChangeOrders'][0]['cor_submitted_subcontractor'] != 'undefined') {
                            this.cor_submitted_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['cor_submitted_subcontractor']['costcodes'];
                          } else {
                            this.cor_submitted_subcontractor = [];
                          }
                          if (typeof data['body']['arrBidders']['arrChangeOrders'][0]['approved_subcontractor'] != 'undefined') {
                            this.approved_subcontractor = data['body']['arrBidders']['arrChangeOrders'][0]['approved_subcontractor']['costcodes'];
                          } else {
                            this.approved_subcontractor = [];
                          }
                        }

                      }

                    }

                  }
                  else if (this.selectreporttype == "Contact List") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contactlist = data['body']['arrBidders'];
                    this.totalcount_contactlist = data['body']['count'];

                  } else if (this.selectreporttype == "ContractLog") {
                    this.bidderlist = this.contactlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = data['body']['arrBidders'];
                    this.totalcount_contractlog = data['body']['count'];

                  }
                  else if (this.selectreporttype == "Current Budget") {

                    this.bidderlist = this.contactlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = [];
                    this.CurrentBudget = data['body'];
                    this.CurrentBudgetArr = data['body']['commonarr'];
                    this.unitCount = data['body']['aligned_Arr']['unitCount'];
                    this.netRentableSqFt = data['body']['aligned_Arr']['netRentableSqFt'];
                    this.total_buyout_forcast = data['body']['aligned_Arr']['total_buyout_forcast'];
                    this.total_forcast = data['body']['aligned_Arr']['total_forcast'];
                    this.OCODisplay = data['body']['aligned_Arr']['OCODisplay'];
                    if (this.OCODisplay == 1) {
                      this.change_orders = data['body']['aligned_Arr']['change_orders'];
                    }
                    else {
                      this.change_orders = [];
                    }
                    this.coTotalValueFormatted = data['body']['aligned_Arr']['coTotalValueFormatted'];
                    this.projectTotalFormatted = data['body']['aligned_Arr']['projectTotalFormatted'];
                    this.totalEstimatedSubcontractValueFormatted = data['body']['aligned_Arr']['totalEstimatedSubcontractValueFormatted'];
                    this.totalVarianceFormatted = data['body']['aligned_Arr']['totalVarianceFormatted'];
                    this.overall_Original_PSCV_f = data['body']['aligned_Arr']['overall_Original_PSCV_f'];
                    this.overall_Reallocation_Val_f = data['body']['aligned_Arr']['overall_Reallocation_Val_f'];
                    this.totalPrimeScheduleValueFormatted = data['body']['aligned_Arr']['totalPrimeScheduleValueFormatted'];

                    this.overall_Sco_amount_f = data['body']['aligned_Arr']['overall_Sco_amount_f'];
                    this.subtotalCostPerSqFtFormatted = data['body']['aligned_Arr']['subtotalCostPerSqFtFormatted'];

                    this.overall_OCO_Val_f = data['body']['aligned_Arr']['overall_OCO_Val_f'];

                  }
                  else if (this.selectreporttype == "Daily Construction Report (DCR)") {

                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = [];
                    this.DailyConstructionReport = data['body'];
                    this.fulcrumimg = data['body']['arrBidders']['headerLogo']['fulcrum'];
                    this.baseCdnUrl = data['body']['arrBidders']['headerLogo']['baseCdnUrl'];
                    this.project_name = data['body']['arrBidders']['project_details']['project_name'];
                    this.project_escaped_address_line_1 = data['body']['arrBidders']['project_details']['project_escaped_address_line_1'];
                    if (this.project_escaped_address_line_1 != 0) {
                      this.display_address_line1 = this.project_escaped_address_line_1;
                    }

                    this.projectAddress = data['body']['arrBidders']['project_details']['projectAddress'];
                    this.jdlCreatedDate = data['body']['arrBidders']['project_details']['jdlCreatedDate'];
                    this.amTemperature = data['body']['arrBidders']['temp']['amTemperature'];
                    this.amCondition = data['body']['arrBidders']['temp']['amCondition'];
                    this.pmTemperature = data['body']['arrBidders']['temp']['pmTemperature'];
                    this.pmCondition = data['body']['arrBidders']['temp']['pmCondition'];
                    this.tableCombineManPowerRfi = data['body']['arrBidders']['tableCombineManPowerRfi'];
                    this.common_combineInspectionDelay_inspections = data['body']['arrBidders']['common_combineInspectionDelay']['inspections'];
                    this.common_combineInspectionDelay_Schedule = data['body']['arrBidders']['common_combineInspectionDelay']['Schedule'];
                    this.numInspectionsToday = data['body']['arrBidders']['numInspectionsToday'];
                    this.numInspectionsThisWeek = data['body']['arrBidders']['numInspectionsThisWeek'];

                    this.jobsiteSiteWorkData = data['body']['arrBidders']['jobsiteSiteWorkData'];
                    this.jobsiteBuildingData = data['body']['arrBidders']['jobsiteBuildingData'];
                    this.jobsite_notes = data['body']['arrBidders']['jobsite_notes'];

                  }
                  else if (this.selectreporttype == "Detailed Weekly") {

                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = [];
                    this.DetailedWeekly = data['body'];
                    this.daysArr = data['body']['arrBidders']['days'];
                    this.amTemperatures_Arr = data['body']['arrBidders']['amTemperatures_Arr'];
                    this.amCondition_Arr = data['body']['arrBidders']['amCondition_Arr'];
                    this.pmTemperatures_Arr = data['body']['arrBidders']['pmTemperatures_Arr'];
                    this.pmConditions_Arr = data['body']['arrBidders']['pmConditions_Arr'];
                    this.scheduledalys = data['body']['arrBidders']['scheduledalys'];
                    this.man_powerArr = data['body']['arrBidders']['man_power']['common_arr'];

                    this.man_powerArrdatecount = data['body']['arrBidders']['man_power']['date_count'];

                    this.man_powerdate_count = data['body']['arrBidders']['man_power']['man_powerdate_count'];
                    this.coltotalarray = data['body']['arrBidders']['man_power']['common_arr']['coltotalarray'];
                    this.company_detaisArr = data['body']['arrBidders']['man_power']['common_arr']['company_detais'];




                    this.jobsiteDailyLogArr = data['body']['arrBidders']['jobsiteDailyLog']['recordsarr'];
                    this.jobsiteDailyLog = data['body']['arrBidders']['jobsiteDailyLog']['recordslabel'];
                    this.jobsiteDailyBuildArr = data['body']['arrBidders']['jobsiteDailyBuild']['recordsarr'];
                    this.jobsiteDailyBuild = data['body']['arrBidders']['jobsiteDailyBuild']['recordslabel'];
                    this.inspections = data['body']['arrBidders']['inspections'];
                    this.othernotes = data['body']['arrBidders']['othernotes'];
                    this.swpppnotes = data['body']['arrBidders']['swpppnotes'];
                    this.deliveries = data['body']['arrBidders']['deliveries'];
                    this.visitors = data['body']['arrBidders']['visitors'];
                    this.extrawork = data['body']['arrBidders']['extrawork'];
                    this.safetyissues = data['body']['arrBidders']['safetyissues'];
                  }
                  else if (this.selectreporttype == "Manpower summary") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = data['body']['arrBidders'];

                  } else if (this.selectreporttype == "Job Status") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = data['body']['arrBidders'];
                    this.opentrackitemcontent = data['body']['arrBidders']['opentrackitemcontent'];
                    this.OpenRFITable = data['body']['arrBidders']['OpenRFITable'];
                    this.SubmittalsData = data['body']['arrBidders']['SubmittalsData'];
                    this.changeorderData = data['body']['arrBidders']['changeorder']['changeorder'];
                    this.changeorderDatatotalcoschudlevalue = data['body']['arrBidders']['changeorder']['totalcoschudlevalue'];
                    this.changeorderDatatotaldays = data['body']['arrBidders']['changeorder']['totaldays'];
                    this.Forcast = data['body']['arrBidders']['purchaseingorder']['Forcast'];
                    this.purchaseArr = data['body']['arrBidders']['purchaseingorder']['purchaseArr'];

                    this.primeContractScheduledValueTotalcus = data['body']['arrBidders']['purchaseingorder']['primeContractScheduledValueTotalcus'];
                    this.forecastedExpensesTotal = data['body']['arrBidders']['purchaseingorder']['forecastedExpensesTotal'];

                    this.primeContractScheduledValueTotal = data['body']['arrBidders']['purchaseingorder']['primeContractScheduledValueTotal'];
                    this.totalicount = data['body']['arrBidders']['purchaseingorder']['totalicount'];
                    this.totalbcount = data['body']['arrBidders']['purchaseingorder']['totalbcount'];
                    this.yesdayManPower = data['body']['arrBidders']['yesdayManPower']['arr'];
                    this.yesdayManPowerrow_total = data['body']['arrBidders']['yesdayManPower']['row_total'];
                  }
                  else if (this.selectreporttype == "Meetings - Tasks") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = '';
                    this.meetingArr = data['body']['arrBidders'];
                    this.meetingStartDateDisplay = data['body']['arrBidders']['meetingStartDateDisplay'];
                    this.meetingEndDateDisplay = data['body']['arrBidders']['meetingEndDateDisplay'];
                    this.meeting_location = data['body']['arrBidders']['meeting_location'];
                    this.nextMeetingStartDateDisplay = data['body']['arrBidders']['nextMeetingStartDateDisplay'];
                    this.nextMeetingEndDateDisplay = data['body']['arrBidders']['nextMeetingEndDateDisplay'];
                    this.next_meeting_location = data['body']['arrBidders']['next_meeting_location'];
                    this.attendandeesTd = data['body']['arrBidders']['attendandeesTd'];
                    this.meetingHeaderText = data['body']['arrBidders']['meetingHeaderText'];
                    this.subDataViewDisplay = data['body']['arrBidders']['subDataViewDisplay'];
                    this.rfiDataViewDisplay = data['body']['arrBidders']['rfiDataViewDisplay'];
                    this.discussionHtmlContent = data['body']['arrBidders']['discussionHtmlContent'];


                  }
                  else if (this.selectreporttype == "Monthly Manpower") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = '';
                    this.MonthlyManpowerArr = data['body'];

                    this.monthlymanpowerdaysarr = data['body']['arrBidders']['days_Arr'];
                    this.coltotalarraymonth = data['body']['arrBidders']['common_arr']['coltotalarray'];
                    this.company_detaismonth = data['body']['arrBidders']['common_arr']['company_detais'];
                    this.checkNull = data['body']['arrBidders']['checkNull'];


                  }
                  else if (this.selectreporttype == "Prelim Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.MonthlyManpowerArr = '';
                    this.prelimreports = data['body']['arrBidders'];
                  } else if (this.selectreporttype == "Project Delay Log") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = data['body']['arrBidders']['delayTableTbody_Arr'];
                    this.totalcount_projectdelayreports = data['body']['arrBidders']['count'];
                    this.paginationDataprojectdelayreports = data['body']['arrBidders']['pagination_data'];
                  } else if (this.selectreporttype == "RFI Report - by ID") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = data['body']['arrBidders']['submittalArr'];


                  }
                  else if ((this.selectreporttype == "RFI Report - QA") || ((this.selectreporttype == "RFI Report - QA - Open"))) {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = data['body']['arrBidders']['submittalArr'];
                  }    else if (this.selectreporttype == "SCO") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = data['body']['arrBidders'];
                    this.overallPotentailTotal= data['body']['overallPotentailTotal'];
                    this.userCanManageSCO= data['body']['userCanManageSCO'];
                  }
                  else if (this.selectreporttype == "Sub List") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr =data['body']['arrBidders'];

                  } else if (this.selectreporttype == "Subcontract Invoice") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice = data['body']['arrBidders'];

                  }  else if (this.selectreporttype == "Reallocation") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= data['body']['arrBidders'];
                  }
                  else if (this.selectreporttype == "Submittal log - by Cost Code") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogcostcodesarr=data['body']['arrBidders'];
                  } else if (this.selectreporttype == "Submittal Log - by ID") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid=data['body']['arrBidders'];
                  } else if (this.selectreporttype == "Submittal Log - by Notes") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid='';this.submittalnotes=data['body']['arrBidders'];
                  }else if (this.selectreporttype == "Submittal Log - by status") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes=data['body']['arrBidders'];
                  }
                  else if (this.selectreporttype == "Vector Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= data['body']['arrBidders']['return_arr'];
                    this.vectorCommonCORarr= data['body']['arrBidders']['return_arr']['COR'];
                    this.siteworkarr= data['body']['arrBidders']['siteworkarr'];
                    this.buildingarr= data['body']['arrBidders']['buildingarr'];
                    this.softcostarr= data['body']['arrBidders']['softcostarr'];
                    this.generalArr= data['body']['arrBidders']['generalarr'];
                  }
                  else if (this.selectreporttype == "Weekly Manpower") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr=data['body']['arrBidders']['days_Arr'];
                    this.weeklymanpowercompanyarr=data['body']['arrBidders']['arr']['common_arr']['company_detais'];
                    this.weeklymanpowercoltotalarray = data['body']['arrBidders']['arr']['common_arr']['coltotalarray'];
                    this.weeklyman_powerArrdatecount = data['body']['arrBidders']['arr']['date_count'];
                  }
                  else if (this.selectreporttype == "Weekly Job") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr='';
                    this.weeklymanpowercompanyarr='';
                    this.weeklymanpowercoltotalarray = '';
                    this.weeklyman_powerArrdatecount = '';
                    this.weeklyjobs = data['body']['arrBidders'];
                    this.weeklyjobsdays = data['body']['arrBidders']['days'];
                    this.weeklyjobsdaysamt = data['body']['arrBidders']['amTemperatures_Arr'];
                    this.weeklyjobsdaysamc = data['body']['arrBidders']['amCondition_Arr'];
                    this.weeklyjobsdayspmt = data['body']['arrBidders']['pmTemperatures_Arr'];
                    this.weeklyjobsdayspmc = data['body']['arrBidders']['pmConditions_Arr'];


                  }
                  let response = this.base64ToArrayBuffer(data['body']['tempFilePath']);

                  let file = new Blob([response], { type: 'application/pdf' });

                  var fileURL = URL.createObjectURL(file);
                  saveAs(fileURL, data['body']['filename'])
                }
                else {
                }
              }
            );
        }
        else if (this.Reportoption == 'XLSX') {

          this.ReportsListService.GenerateReportPDF(grouprowval,groupco,generalco,inotes,subtotal,vendor_id,qb_customer,cc_id,vendor,filteropt,ch_potential ,this.meeting_type_id, this.ddl_meeting_id, dateDCR, crntNotes, crntSubtotal, crntBgt_val_only, costCodeAlias, view_option, showCodeCodeAmt, showreject, theCot, despco, this.Reportoption, this.search, this.p, this.limit, theStatus, theSortBy, ReportType, report_view, projectName, date, date1)
            .pipe(first())
            .subscribe(
              data => {
                this.modalloading = false;
                if (data['status']) {
                  this.DeleteTempPath(data['body']['tempFileName']);
                  this.limit = '';
                  if (this.selectreporttype == "Bidder List") {
                    this.buyouttlist = this.commitedcontracts = this.arrUncommittedContracts = ''; this.CorReports = 0;
                    if ((data['body']['arrBidders'].length > 0) && (data['body']['arrBidders'] != null)) {
                      this.bidderlist = data['body']['arrBidders'];
                      this.totalcount = data['body']['arrBidders']['count'];
                    }
                  }
                  else if (this.selectreporttype == "Buyout Log") {
                    this.bidderlist = this.commitedcontracts = this.arrUncommittedContracts = ''; this.CorReports = 0;
                    if ((data['body']['arrBuyout'].length > 0) && (data['body']['arrBuyout'] != null)) {
                      this.buyouttlist = data['body']['arrBuyout'];
                      this.totalcountBuyoutLog = data['body']['count'];
                    }
                  }
                  else if (this.selectreporttype == "Buyout Summary") {
                    this.bidderlist = '';
                    this.buyouttlist = ''; this.CorReports = [];
                    if ((data['body']['arrBuyout']['commitedcontracts'].length > 0) && (data['body']['arrBuyout']['commitedcontracts'] != null)) {
                      this.commitedcontracts = data['body']['arrBuyout']['commitedcontracts'];
                    }
                    if ((data['body']['arrBuyout']['arrUncommittedContracts'].length > 0) && (data['body']['arrBuyout']['arrUncommittedContracts'] != null)) {
                      this.arrUncommittedContracts = data['body']['arrBuyout']['arrUncommittedContracts'];

                    }
                  } else if (this.selectreporttype == "Change Order") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = '';

                    if ((data['body']['arrChangeOrders']['arrChangeOrders'].length > 0) && (data['body']['arrChangeOrders']['arrChangeOrders'] != null)) {
                      this.CorReports = data['body']['arrChangeOrders']['arrChangeOrders'];

                      if (data['body']['arrChangeOrders']['arrChangeOrders'] != null) {

                        this.pcoTotalCostCodeAmount = data['body']['arrChangeOrders']['arrChangeOrders'][0]['pcoTotalCostCodeAmount'];

                        this.potentialCoContentTotalDays = data['body']['arrChangeOrders']['arrChangeOrders'][0]['potentialCoContentTotalDays'];
                        this.corTotalCostCodeAmount = data['body']['arrChangeOrders']['arrChangeOrders'][0]['corTotalCostCodeAmount'];
                        this.corTotalCostCodeDays = data['body']['arrChangeOrders']['arrChangeOrders'][0]['corTotalCostCodeDays'];
                        this.approvedTotalCostCodeAmount = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approvedTotalCostCodeAmount'];
                        this.approvedTotalCostCodeDays = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approvedTotalCostCodeDays'];
                        this.totalAmt = data['body']['arrChangeOrders']['arrChangeOrders'][0]['totalAmt'];
                        this.pco_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['pco'];
                        this.cor_submitted_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['cor_submitted'];
                        this.approved_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approved'];
                        this.type_title_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['type_title'];
                        this.totspan_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['totspan'];
                        this.nospan_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['nospan'];
                        this.totAmountSpan_default_view = data['body']['arrChangeOrders']['arrChangeOrders'][0]['totAmountSpan'];

                        this.pcoTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['pcoTotalCostCodeAmount_subcontractor'];
                        this.potentialCoContentTotalDays_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['potentialCoContentTotalDays_subcontractor'];
                        this.corTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['corTotalCostCodeAmount_subcontractor'];
                        this.corTotalCostCodeDays_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['corTotalCostCodeDays_subcontractor'];
                        this.approvedTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approvedTotalCostCodeAmount_subcontractor'];
                        this.approvedTotalCostCodeDays_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approvedTotalCostCodeDays_subcontractor'];
                        if (view_option == 'subcontractor') {
                          if (typeof data['body']['arrChangeOrders']['arrChangeOrders'][0]['pco_subcontractor'] != 'undefined') {
                            this.pco_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['pco_subcontractor']['costcodes'];
                          }
                          else {
                            this.pco_subcontractor = [];
                          }
                          if (typeof data['body']['arrChangeOrders']['arrChangeOrders'][0]['cor_submitted_subcontractor'] != 'undefined') {
                            this.cor_submitted_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['cor_submitted_subcontractor']['costcodes'];
                          } else {
                            this.cor_submitted_subcontractor = [];
                          }
                          if (typeof data['body']['arrChangeOrders']['arrChangeOrders'][0]['approved_subcontractor'] != 'undefined') {
                            this.approved_subcontractor = data['body']['arrChangeOrders']['arrChangeOrders'][0]['approved_subcontractor']['costcodes'];
                          } else {
                            this.approved_subcontractor = [];
                          }
                        }

                      }

                    }

                  }
                  else if (this.selectreporttype == "Contact List") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contactlist = data['body']['arrBuyout'];

                  }
                  else if (this.selectreporttype == "Current Budget") {
                    this.bidderlist = this.contactlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = [];
                    this.CurrentBudget = data['body'];
                    this.CurrentBudgetArr = data['body']['commonarr'];
                    this.unitCount = data['body']['aligned_Arr']['unitCount'];
                    this.netRentableSqFt = data['body']['aligned_Arr']['netRentableSqFt'];
                    this.total_buyout_forcast = data['body']['aligned_Arr']['total_buyout_forcast'];
                    this.total_forcast = data['body']['aligned_Arr']['total_forcast'];
                    this.OCODisplay = data['body']['aligned_Arr']['OCODisplay'];
                    if (this.OCODisplay == 1) {
                      this.change_orders = data['body']['aligned_Arr']['change_orders'];
                    }
                    else {
                      this.change_orders = [];
                    }
                    this.coTotalValueFormatted = data['body']['aligned_Arr']['coTotalValueFormatted'];
                    this.projectTotalFormatted = data['body']['aligned_Arr']['projectTotalFormatted'];
                    this.totalEstimatedSubcontractValueFormatted = data['body']['aligned_Arr']['totalEstimatedSubcontractValueFormatted'];
                    this.totalVarianceFormatted = data['body']['aligned_Arr']['totalVarianceFormatted'];
                    this.overall_Original_PSCV_f = data['body']['aligned_Arr']['overall_Original_PSCV_f'];
                    this.overall_Reallocation_Val_f = data['body']['aligned_Arr']['overall_Reallocation_Val_f'];
                    this.totalPrimeScheduleValueFormatted = data['body']['aligned_Arr']['totalPrimeScheduleValueFormatted'];

                    this.overall_Sco_amount_f = data['body']['aligned_Arr']['overall_Sco_amount_f'];
                    this.subtotalCostPerSqFtFormatted = data['body']['aligned_Arr']['subtotalCostPerSqFtFormatted'];

                    this.overall_OCO_Val_f = data['body']['aligned_Arr']['overall_OCO_Val_f'];
                  }

                  else if (this.selectreporttype == "Detailed Weekly") {

                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = [];
                    this.DetailedWeekly = data['body'];
                    this.daysArr = data['body']['arrDetailedWeekly']['days'];
                    this.amTemperatures_Arr = data['body']['arrDetailedWeekly']['amTemperatures_Arr'];
                    this.amCondition_Arr = data['body']['arrDetailedWeekly']['amCondition_Arr'];
                    this.pmTemperatures_Arr = data['body']['arrDetailedWeekly']['pmTemperatures_Arr'];
                    this.pmConditions_Arr = data['body']['arrDetailedWeekly']['pmConditions_Arr'];
                    this.scheduledalys = data['body']['arrDetailedWeekly']['scheduledalys'];
                    this.man_powerArr = data['body']['arrDetailedWeekly']['man_power']['common_arr'];
                    this.man_powerArrdatecount = data['body']['arrDetailedWeekly']['man_power']['date_count'];

                    this.man_powerdate_count = data['body']['arrDetailedWeekly']['man_power']['man_powerdate_count'];
                    this.coltotalarray = data['body']['arrDetailedWeekly']['man_power']['common_arr']['coltotalarray'];
                    this.company_detaisArr = data['body']['arrDetailedWeekly']['man_power']['common_arr']['company_detais'];



                    this.jobsiteDailyLogArr = data['body']['arrDetailedWeekly']['jobsiteDailyLog']['recordsarr'];
                    this.jobsiteDailyLog = data['body']['arrDetailedWeekly']['jobsiteDailyLog']['recordslabel'];
                    this.jobsiteDailyBuildArr = data['body']['arrDetailedWeekly']['jobsiteDailyBuild']['recordsarr'];
                    this.jobsiteDailyBuild = data['body']['arrDetailedWeekly']['jobsiteDailyBuild']['recordslabel'];
                    this.inspections = data['body']['arrDetailedWeekly']['inspections'];
                    this.othernotes = data['body']['arrDetailedWeekly']['othernotes'];
                    this.swpppnotes = data['body']['arrDetailedWeekly']['swpppnotes'];
                    this.deliveries = data['body']['arrDetailedWeekly']['deliveries'];
                    this.visitors = data['body']['arrDetailedWeekly']['visitors'];
                    this.extrawork = data['body']['arrDetailedWeekly']['extrawork'];
                    this.safetyissues = data['body']['arrDetailedWeekly']['safetyissues'];
                  }
                  else if (this.selectreporttype == "Manpower summary") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = data['body']['arrDetailedWeekly'];

                  } else if (this.selectreporttype == "Monthly Manpower") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = '';
                    this.MonthlyManpowerArr = data['body'];

                    this.monthlymanpowerdaysarr = data['body']['arrBidders']['days_Arr'];
                    this.coltotalarraymonth = data['body']['arrBidders']['common_arr']['coltotalarray'];
                    this.company_detaismonth = data['body']['arrBidders']['common_arr']['company_detais'];
                    this.checkNull = data['body']['arrBidders']['checkNull'];


                  }
                  else if (this.selectreporttype == "Prelim Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.MonthlyManpowerArr = '';
                    this.prelimreports = data['body']['arrBidders'];
                  } else if (this.selectreporttype == "Project Delay Log") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = data['body']['arrBidders'];
                  } else if (this.selectreporttype == "RFI Report - by ID") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = data['body']['arrBidders'];


                  } else if ((this.selectreporttype == "RFI Report - QA") || ((this.selectreporttype == "RFI Report - QA - Open"))) {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = data['body']['arrBidders'];
                  }else if (this.selectreporttype == "SCO") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = data['body']['arrBidders'];
                    this.overallPotentailTotal= data['body']['overallPotentailTotal'];
                    this.userCanManageSCO= data['body']['userCanManageSCO'];
                  }     else if (this.selectreporttype == "Sub List") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr =data['body']['arrBidders'];

                  }else if (this.selectreporttype == "Subcontract Invoice") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice = data['body']['arrBidders'];

                  } else if (this.selectreporttype == "Reallocation") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= data['body']['arrBidders'];
                  }else if (this.selectreporttype == "Subcontractor Audit List") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = data['body']['arrBidders'];
                   
                  }
                  else if (this.selectreporttype == "Submittal log - by Cost Code") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogcostcodesarr=data['body']['arrBidders'];
                  }  else if (this.selectreporttype == "Submittal Log - by ID") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid=data['body']['arrBidders'];
                  }else if (this.selectreporttype == "Submittal Log - by Notes") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid='';this.submittalnotes=data['body']['arrBidders'];
                  }else if (this.selectreporttype == "Submittal Log - by status") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes=data['body']['arrBidders'];
                  }
                  else if (this.selectreporttype == "Vector Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= data['body']['aligned_Arr'];
                    this.vectorCommonCORarr= data['body']['aligned_Arr']['COR'];
                    this.siteworkarr= data['body']['siteworkarr'];
                    this.buildingarr= data['body']['buildingarr'];
                    this.softcostarr= data['body']['softcostarr'];
                    this.generalArr= data['body']['generalarr'];
                  }
                  else if (this.selectreporttype == "Weekly Manpower") { 
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr=data['body']['arrDetailedWeekly']['days'];
                    this.weeklymanpowercompanyarr=data['body']['arrDetailedWeekly']['man_power']['common_arr']['company_detais'];
                    this.weeklymanpowercoltotalarray = data['body']['arrDetailedWeekly']['man_power']['common_arr']['coltotalarray'];
                    this.weeklyman_powerArrdatecount = data['body']['arrDetailedWeekly']['man_power']['date_count'];
                  }

                  else if (this.selectreporttype == "Weekly Job") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr='';
                    this.weeklymanpowercompanyarr='';
                    this.weeklymanpowercoltotalarray = '';
                    this.weeklyman_powerArrdatecount = '';
                    this.weeklyjobs = data['body']['arrDetailedWeekly'];
                    this.weeklyjobsdays = data['body']['arrDetailedWeekly']['days'];
                    this.weeklyjobsdaysamt = data['body']['arrDetailedWeekly']['amTemperatures_Arr'];
                    this.weeklyjobsdaysamc = data['body']['arrDetailedWeekly']['amCondition_Arr'];
                    this.weeklyjobsdayspmt = data['body']['arrDetailedWeekly']['pmTemperatures_Arr'];
                    this.weeklyjobsdayspmc = data['body']['arrDetailedWeekly']['pmConditions_Arr'];


                  }
                 // if (this.selectreporttype != "Subcontractor Audit List") {
                  let response = this.base64ToArrayBuffer(data['body']['tempFilePath']);

                  let file = new Blob([response], { type: 'application/vnd.ms-excel' });

                  var fileURL = URL.createObjectURL(file);
                  saveAs(fileURL, data['body']['filename'])
                 // }
                  // else{
                  //   this.exportAsXLSX();
                  // }
                }
                else {
                  // logout if user is  inactive for 1 hour, token invalid condition
                  if (data['code'] == '5') {
                  }

                }
              }
            );
        }
        else {
          this.limit = 10;

          this.ReportsListService.GenerateReport(grouprowval,groupco,generalco,inotes,subtotal,vendor_id,qb_customer,cc_id,vendor,filteropt,ch_potential ,this.meeting_type_id, this.ddl_meeting_id, dateDCR, crntNotes, crntSubtotal, crntBgt_val_only, costCodeAlias, view_option, showCodeCodeAmt, showreject, theCot, despco, this.Reportoption, this.search, this.p, this.limit, theStatus, theSortBy, ReportType, report_view, projectName, date, date1)
            .pipe(first())
            .subscribe(
              data => {
                this.modalloading = false;
                if (data['status']) {
                  if (this.selectreporttype == "Bidder List") {
                    this.buyouttlist = this.commitedcontracts = this.arrUncommittedContracts = ''; this.CorReports = 0;
                    if ((data['body']['arrBidders'].length > 0) && (data['body']['arrBidders'] != null)) {
                      this.bidderlist = data['body']['arrBidders'];
                      this.totalcount = data['body']['count'];
                      this.paginationData = data['body']['pagination_data'];

                    }
                  }
                  else if (this.selectreporttype == "Buyout Log") {
                    this.bidderlist = this.commitedcontracts = this.arrUncommittedContracts = ''; this.CorReports = 0;
                    if ((data['body']['arrBuyout'].length > 0) && (data['body']['arrBuyout'] != null)) {
                      this.buyouttlist = data['body']['arrBuyout'];
                      this.bidRecivedPercentage = data['body']['bidRecivedPercentage'];
                      this.contractedPercentage = data['body']['contractedPercentage'];
                      this.overAlltotSubContActValFormatted = data['body']['overAlltotSubContActValFormatted'];
                      this.totbuyoutSavingHitFormatted = data['body']['totbuyoutSavingHitFormatted'];
                      this.hasSubContAmt = data['body']['hasSubContAmt'];
                      this.totalPSCVFormatted = data['body']['totalPSCVFormatted'];
                      this.totalcountBuyoutLog = data['body']['count'];
                      this.paginationData = data['body']['pagination_data'];

                    }
                  }
                  else if (this.selectreporttype == "Buyout Summary") {
                    this.bidderlist = ''; this.CorReports = [];
                    this.buyouttlist = '';
                    if ((data['body']['commitedcontracts'].length > 0) && (data['body']['commitedcontracts'] != null)) {
                      this.commitedcontracts = data['body']['commitedcontracts'];
                    }
                    if ((data['body']['arrUncommittedContracts'].length > 0) && (data['body']['arrUncommittedContracts'] != null)) {
                      this.arrUncommittedContracts = data['body']['arrUncommittedContracts'];

                    }
                  }

                  else if (this.selectreporttype == "Change Order") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = '';
                    if ((data['body']['arrChangeOrders'].length > 0) && (data['body']['arrChangeOrders'] != null)) {
                      this.CorReports = data['body']['arrChangeOrders'];
                      if (data['body']['arrChangeOrders'] != null) {
                        this.pcoTotalCostCodeAmount = data['body']['arrChangeOrders'][0]['pcoTotalCostCodeAmount'];
                        this.potentialCoContentTotalDays = data['body']['arrChangeOrders'][0]['potentialCoContentTotalDays'];
                        this.corTotalCostCodeAmount = data['body']['arrChangeOrders'][0]['corTotalCostCodeAmount'];
                        this.corTotalCostCodeDays = data['body']['arrChangeOrders'][0]['corTotalCostCodeDays'];
                        this.approvedTotalCostCodeAmount = data['body']['arrChangeOrders'][0]['approvedTotalCostCodeAmount'];
                        this.approvedTotalCostCodeDays = data['body']['arrChangeOrders'][0]['approvedTotalCostCodeDays'];
                        this.totalAmt = data['body']['arrChangeOrders'][0]['totalAmt'];
                        this.pco_default_view = data['body']['arrChangeOrders'][0]['pco'];
                        this.cor_submitted_default_view = data['body']['arrChangeOrders'][0]['cor_submitted'];
                        this.approved_default_view = data['body']['arrChangeOrders'][0]['approved'];

                        this.type_title_default_view = data['body']['arrChangeOrders'][0]['type_title'];
                        this.totspan_default_view = data['body']['arrChangeOrders'][0]['totspan'];
                        this.nospan_default_view = data['body']['arrChangeOrders'][0]['nospan'];
                        this.totAmountSpan_default_view = data['body']['arrChangeOrders'][0]['totAmountSpan'];

                        this.pcoTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders'][0]['pcoTotalCostCodeAmount_subcontractor'];
                        this.potentialCoContentTotalDays_subcontractor = data['body']['arrChangeOrders'][0]['potentialCoContentTotalDays_subcontractor'];
                        this.corTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders'][0]['corTotalCostCodeAmount_subcontractor'];
                        this.corTotalCostCodeDays_subcontractor = data['body']['arrChangeOrders'][0]['corTotalCostCodeDays_subcontractor'];
                        this.approvedTotalCostCodeAmount_subcontractor = data['body']['arrChangeOrders'][0]['approvedTotalCostCodeAmount_subcontractor'];
                        this.approvedTotalCostCodeDays_subcontractor = data['body']['arrChangeOrders'][0]['approvedTotalCostCodeDays_subcontractor'];

                        if (view_option == 'subcontractor') {
                          if (typeof data['body']['arrChangeOrders'][0]['pco_subcontractor'] !== 'undefined') {
                            this.pco_subcontractor = data['body']['arrChangeOrders'][0]['pco_subcontractor']['costcodes'];
                          }
                          else {
                            this.pco_subcontractor = [];
                          }

                          if (typeof data['body']['arrChangeOrders'][0]['cor_submitted_subcontractor'] !== 'undefined') {
                            this.cor_submitted_subcontractor = data['body']['arrChangeOrders'][0]['cor_submitted_subcontractor']['costcodes'];
                          } else {
                            this.cor_submitted_subcontractor = [];
                          }
                          if (typeof data['body']['arrChangeOrders'][0]['approved_subcontractor'] !== 'undefined') {
                            this.approved_subcontractor = data['body']['arrChangeOrders'][0]['approved_subcontractor']['costcodes'];
                          } else {
                            this.approved_subcontractor = [];
                          }


                        }

                      }

                    }

                  }
                  else if (this.selectreporttype == "Contact List") {
                    this.bidderlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contactlist = data['body']['return_arr'];
                    this.totalcount_contactlist = data['body']['count'];
                    this.paginationData = data['body']['pagination_data'];

                  }
                  else if (this.selectreporttype == "ContractLog") {
                    this.bidderlist = this.contactlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = data['body']['return_arr'];
                    this.totalcount_contractlog = data['body']['count'];
                    this.paginationData = data['body']['pagination_data'];

                  }
                  else if (this.selectreporttype == "Current Budget") {
                    this.bidderlist = this.contactlist = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = [];
                    this.CurrentBudget = data['body'];
                    this.CurrentBudgetArr = data['body']['commonarr'];
                    this.unitCount = data['body']['aligned_Arr']['unitCount'];
                    this.netRentableSqFt = data['body']['aligned_Arr']['netRentableSqFt'];
                    this.total_buyout_forcast = data['body']['aligned_Arr']['total_buyout_forcast'];
                    this.total_forcast = data['body']['aligned_Arr']['total_forcast'];
                    this.OCODisplay = data['body']['aligned_Arr']['OCODisplay'];
                    if (this.OCODisplay == 1) {
                      this.change_orders = data['body']['aligned_Arr']['change_orders'];
                    }
                    else {
                      this.change_orders = [];
                    }
                    this.coTotalValueFormatted = data['body']['aligned_Arr']['coTotalValueFormatted'];
                    this.projectTotalFormatted = data['body']['aligned_Arr']['projectTotalFormatted'];
                    this.totalEstimatedSubcontractValueFormatted = data['body']['aligned_Arr']['totalEstimatedSubcontractValueFormatted'];
                    this.totalVarianceFormatted = data['body']['aligned_Arr']['totalVarianceFormatted'];
                    this.overall_Original_PSCV_f = data['body']['aligned_Arr']['overall_Original_PSCV_f'];
                    this.overall_Reallocation_Val_f = data['body']['aligned_Arr']['overall_Reallocation_Val_f'];
                    this.totalPrimeScheduleValueFormatted = data['body']['aligned_Arr']['totalPrimeScheduleValueFormatted'];

                    this.overall_Sco_amount_f = data['body']['aligned_Arr']['overall_Sco_amount_f'];
                    this.subtotalCostPerSqFtFormatted = data['body']['aligned_Arr']['subtotalCostPerSqFtFormatted'];

                    this.overall_OCO_Val_f = data['body']['aligned_Arr']['overall_OCO_Val_f'];
                  }

                  else if (this.selectreporttype == "Daily Construction Report (DCR)") {

                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = [];
                    this.DailyConstructionReport = data['body'];
                    this.fulcrumimg = data['body']['headerLogo']['fulcrum'];
                    this.baseCdnUrl = data['body']['headerLogo']['baseCdnUrl'];
                    this.project_name = data['body']['project_details']['project_name'];
                    this.project_escaped_address_line_1 = data['body']['project_details']['project_escaped_address_line_1'];
                    if (this.project_escaped_address_line_1 != 0) {
                      this.display_address_line1 = this.project_escaped_address_line_1;
                    }

                    this.projectAddress = data['body']['project_details']['projectAddress'];
                    this.jdlCreatedDate = data['body']['project_details']['jdlCreatedDate'];
                    this.amTemperature = data['body']['temp']['amTemperature'];
                    this.amCondition = data['body']['temp']['amCondition'];
                    this.pmTemperature = data['body']['temp']['pmTemperature'];
                    this.pmCondition = data['body']['temp']['pmCondition'];
                    this.tableCombineManPowerRfi = data['body']['tableCombineManPowerRfi'];
                    this.common_combineInspectionDelay_inspections = data['body']['common_combineInspectionDelay']['inspections'];
                    this.common_combineInspectionDelay_Schedule = data['body']['common_combineInspectionDelay']['Schedule'];
                    this.numInspectionsToday = data['body']['numInspectionsToday'];
                    this.numInspectionsThisWeek = data['body']['numInspectionsThisWeek'];

                    this.jobsiteSiteWorkData = data['body']['jobsiteSiteWorkData'];
                    this.jobsiteBuildingData = data['body']['jobsiteBuildingData'];
                    this.jobsite_notes = data['body']['jobsite_notes'];



                  }

                  else if (this.selectreporttype == "Detailed Weekly") {

                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = [];
                    this.DetailedWeekly = data['body'];
                    this.daysArr = data['body']['days'];
                    this.amTemperatures_Arr = data['body']['amTemperatures_Arr'];
                    this.amCondition_Arr = data['body']['amCondition_Arr'];
                    this.pmTemperatures_Arr = data['body']['pmTemperatures_Arr'];
                    this.pmConditions_Arr = data['body']['pmConditions_Arr'];
                    this.scheduledalys = data['body']['scheduledalys'];
                    this.man_powerArr = data['body']['man_power']['common_arr'];
                    this.man_powerArrdatecount = data['body']['man_power']['date_count'];

                    this.man_powerdate_count = data['body']['man_power']['man_powerdate_count'];
                    this.coltotalarray = data['body']['man_power']['common_arr']['coltotalarray'];
                    this.company_detaisArr = data['body']['man_power']['common_arr']['company_detais'];

                    this.jobsiteDailyLogArr = data['body']['jobsiteDailyLog']['recordsarr'];
                    this.jobsiteDailyLog = data['body']['jobsiteDailyLog']['recordslabel'];
                    this.jobsiteDailyBuildArr = data['body']['jobsiteDailyBuild']['recordsarr'];
                    this.jobsiteDailyBuild = data['body']['jobsiteDailyBuild']['recordslabel'];
                    this.inspections = data['body']['inspections'];
                    this.othernotes = data['body']['othernotes'];
                    this.swpppnotes = data['body']['swpppnotes'];
                    this.deliveries = data['body']['deliveries'];
                    this.visitors = data['body']['visitors'];
                    this.extrawork = data['body']['extrawork'];
                    this.safetyissues = data['body']['safetyissues'];
                  }
                  else if (this.selectreporttype == "Manpower summary") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = data['body'];

                  }

                  else if (this.selectreporttype == "Job Status") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = data['body'];
                    this.opentrackitemcontent = data['body']['opentrackitemcontent'];
                    this.OpenRFITable = data['body']['OpenRFITable']['arr'];
                    this.SubmittalsData = data['body']['SubmittalsData']['arr'];
                    this.changeorderData = data['body']['changeorder']['arr']['changeorder'];
                    this.changeorderDatatotalcoschudlevalue = data['body']['changeorder']['arr']['totalcoschudlevalue'];
                    this.changeorderDatatotaldays = data['body']['changeorder']['arr']['totaldays'];
                    this.Forcast = data['body']['purchaseingorder']['Forcast'];
                    this.purchaseArr = data['body']['purchaseingorder']['purchaseArr'];

                    this.primeContractScheduledValueTotalcus = data['body']['purchaseingorder']['primeContractScheduledValueTotalcus'];
                    this.forecastedExpensesTotal = data['body']['purchaseingorder']['forecastedExpensesTotal'];

                    this.primeContractScheduledValueTotal = data['body']['purchaseingorder']['primeContractScheduledValueTotal'];
                    this.totalicount = data['body']['purchaseingorder']['totalicount'];
                    this.totalbcount = data['body']['purchaseingorder']['totalbcount'];
                    this.yesdayManPower = data['body']['yesdayManPower']['arr']['arr'];
                    this.yesdayManPowerrow_total = data['body']['yesdayManPower']['arr']['row_total'];
                  }

                  else if (this.selectreporttype == "Meetings - Tasks") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = '';
                    this.meetingArr = data['body'];
                    this.meetingStartDateDisplay = data['body']['meetingStartDateDisplay'];
                    this.meetingEndDateDisplay = data['body']['meetingEndDateDisplay'];
                    this.meeting_location = data['body']['meeting_location'];
                    this.nextMeetingStartDateDisplay = data['body']['nextMeetingStartDateDisplay'];
                    this.nextMeetingEndDateDisplay = data['body']['nextMeetingEndDateDisplay'];
                    this.next_meeting_location = data['body']['next_meeting_location'];
                    this.attendandeesTd = data['body']['attendandeesTd'];
                    this.meetingHeaderText = data['body']['meetingHeaderText'];
                    this.subDataViewDisplay = data['body']['subDataViewDisplay'];
                    this.rfiDataViewDisplay = data['body']['rfiDataViewDisplay'];
                    this.discussionHtmlContent = data['body']['discussionHtmlContent'];
                  }

                  else if (this.selectreporttype == "Monthly Manpower") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = '';
                    this.MonthlyManpowerArr = data['body'];
                    this.monthlymanpowerdaysarr = data['body']['days_Arr'];
                    this.coltotalarraymonth = data['body']['common_arr']['coltotalarray'];
                    this.company_detaismonth = data['body']['common_arr']['company_detais'];
                    this.checkNull = data['body']['checkNull'];


                  }
                  else if (this.selectreporttype == "Prelim Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.MonthlyManpowerArr = '';
                    this.prelimreports = data['body'];
                  }
                  else if (this.selectreporttype == "Project Delay Log") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = data['body']['delayTableTbody_Arr'];
                    this.totalcount_projectdelayreports = data['body']['count'];
                    this.paginationDataprojectdelayreports = data['body']['pagination_data'];
                  }
                  else if (this.selectreporttype == "RFI Report - by ID") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = data['body']['submittalArr'];
                    this.totalcount_RFIbyid = data['body']['count'];
                    this.paginationDataRFIbyid = data['body']['pagination_data'];

                  }
                  else if ((this.selectreporttype == "RFI Report - QA") || ((this.selectreporttype == "RFI Report - QA - Open"))) {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = data['body']['submittalArr'];
                    this.totalcount_RFIQA = data['body']['count'];
                    this.paginationDataRFIQA = data['body']['pagination_data'];
                  }
                  else if (this.selectreporttype == "SCO") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = data['body']['return_arr'];
                    this.overallPotentailTotal= data['body']['overallPotentailTotal'];
                    this.userCanManageSCO= data['body']['userCanManageSCO'];
                  }
                  else if (this.selectreporttype == "Sub List") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr =data['body']['return_arr'];

                  }

                  else if (this.selectreporttype == "Subcontract Invoice") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice = data['body']['return_arr'];

                  }
                  else if (this.selectreporttype == "Reallocation") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= data['body']['return_arr'];
                  }
                  else if (this.selectreporttype == "Subcontractor Audit List") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = data['body'];
                  }
                  else if (this.selectreporttype == "Submittal log - by Cost Code") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogcostcodesarr=data['body']['return_arr'];
                    this.totalcount_submittallogcc = data['body']['count'];
                    this.paginationDatasubmittallogcc = data['body']['pagination_data'];
                  }
                  else if (this.selectreporttype == "Submittal Log - by ID") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid=data['body']['return_arr'];
                  }
                  else if (this.selectreporttype == "Submittal Log - by Notes") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbyid='';this.submittalnotes=data['body']['return_arr'];
                  }
                  else if (this.selectreporttype == "Submittal Log - by status") {
                    
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes=data['body']['return_arr'];
                  }
                  else if (this.selectreporttype == "Vector Report") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= data['body']['aligned_Arr'];
                    this.vectorCommonCORarr= data['body']['aligned_Arr']['COR'];
                    this.siteworkarr= data['body']['siteworkarr'];
                    this.buildingarr= data['body']['buildingarr'];
                    this.softcostarr= data['body']['softcostarr'];
                    this.generalArr= data['body']['generalarr'];
                  }


                  else if (this.selectreporttype == "Weekly Manpower") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr=data['body']['days_Arr'];
                    this.weeklymanpowercompanyarr=data['body']['arr']['common_arr']['company_detais'];
                    this.weeklymanpowercoltotalarray = data['body']['arr']['common_arr']['coltotalarray'];
                    this.weeklyman_powerArrdatecount = data['body']['arr']['date_count'];
                  }
                  else if (this.selectreporttype == "Weekly Job") {
                    this.bidderlist = this.contactlist = this.CurrentBudgetArr = this.arrUncommittedContracts = '';
                    this.buyouttlist = this.commitedcontracts = this.DetailedWeekly = ''; this.CorReports = 0;
                    this.contractlog = this.DailyConstructionReport = this.daysArr = [];
                    this.ManSummaryArr = '';
                    this.jobstatusArr = this.meetingArr = this.prelimreports = this.MonthlyManpowerArr = '';
                    this.projectdelayreports = '';
                    this.RFIbyid = '';
                    this.RFIQA = '';
                    this.SCOARR = '';
                    this.sublistSArr ='';
                    this.subcontractinvoice ='';
                    this.ReallocationArr= '';
                    this.subcontractorAudit = '';
                    this.submittallogbystatus='';this.submittalnotes='';
                    this.vectorCommonarr= '';
                    this.vectorCommonCORarr='';
                    this.siteworkarr= '';
                    this.buildingarr= '';
                    this.softcostarr= '';
                    this.weeklymanpowerdaysarr='';
                    this.weeklymanpowercompanyarr='';
                    this.weeklymanpowercoltotalarray = '';
                    this.weeklyman_powerArrdatecount = '';
                    this.weeklyjobs = data['body']['return_arr'];
                    this.weeklyjobsdays = data['body']['return_arr']['days'];
                    this.weeklyjobsdaysamt = data['body']['return_arr']['amTemperatures_Arr'];
                    this.weeklyjobsdaysamc = data['body']['return_arr']['amCondition_Arr'];
                    this.weeklyjobsdayspmt = data['body']['return_arr']['pmTemperatures_Arr'];
                    this.weeklyjobsdayspmc = data['body']['return_arr']['pmConditions_Arr'];


                  }
                }
                else {
                  // logout if user is  inactive for 1 hour, token invalid condition
                  if (data['code'] == '5') {
                  }

                }
              }
            );
        }
      }





    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }

  loadMeetingsByMeetingTypeId() {
    this.modalloading = true;
    var meeting_type_id = $("#ddl_meeting_type_id").val();
    this.ReportsListService.loadMeetingsByMeetingTypeId(meeting_type_id)
      .pipe(first())
      .subscribe(
        data => {
          this.modalloading = false;
          if (data['status']) {

            this.MeetingtypesList = data['body'];
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
  messageAlert(text, messageStyle, labelStyle, elementId) {
    clearTimeout(window['labelStyleTimeout_' + elementId]);
    clearTimeout(window['messageStyleTimeout_' + elementId]);

    var messageTimeout = 3000;


    $("#messageDiv").removeClass();
    $("#messageDiv").html('');

    $("#messageDiv").addClass(messageStyle);
    $("#messageDiv").html(text);
    $("#messageDiv").fadeIn('slow');

    window['messageStyleTimeout_' + elementId] = setTimeout(function () {
      $("#messageDiv").fadeOut('slow', function () {
        $("#messageDiv").removeClass();
        $("#messageDiv").html('');
      });
    }, messageTimeout);

    if (elementId != 'none') {
      var classesToRemove = 'infoMessageLabel successMessageLabel warningMessageLabel errorMessageLabel modalMessage';
      $("#" + elementId).removeClass(classesToRemove);
      $("#" + elementId).addClass(labelStyle);

      window['labelStyleTimeout_' + elementId] = setTimeout(function () {
        $("#" + elementId).removeClass(classesToRemove);
      }, messageTimeout);
    }
  }
  DeleteTempPath(tempFileName) {
    if(tempFileName != '') {
    this.ReportsListService.DeleteTempPath(tempFileName)
      .pipe(first())
      .subscribe(
        data => {
          if (data['status']) {
          }
          else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }

          }
        }
      );
  }
  }
  base64ToArrayBuffer(base64: any): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  loadSelectedReportCompany()
  {
    var ReportType = "Company";
		var vendor_id = $("#vendor_id").val();
    try {
      this.modalloading = true;
      this.ReportsListService.loadSelectedReportCompany(vendor_id)
        .pipe(first())
        .subscribe(
          data => {
            this.modalloading = false;
            if (data['status']) {
             // $('#costCodeHtml').empty();
             this.costCoDesc = data['body']['vendorCompany'];
            }
            }
            );

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  getReportsoptions() {

    try {
      this.modalloading = true;
      this.ReportsListService.ReportsandOptions()
        .pipe(first())
        .subscribe(
          data => {
            this.modalloading = false;
            if (data['status']) {
              if (data['body']['errorvar'] == '1') {
                this.reportsempty = true;
              }
              else {
                
                this.userCanViewReport = data['body']['userCanViewReport'];
                if(this.userCanViewReport != 1)
                {
                  this.reportsempty = true;
                }else{
                  this.reportsempty = false;
                }
                this.qb_customer = data['body']['qb_customer'];
                this.ReportsListarr = data['body']['report_list']['userCanSeeReport'];
                this.ddlreallocationStatus = data['body']['ddlreallocationStatus'];
                this.vendorCompany = data['body']['vendorCompany']['vendorCompany'];
                this.costCoDesc = data['body']['costCoDesc']['costCoDesc'];
                this.ddlSubcontractorBidStatuses = data['body']['ddlSubcontractorBidStatuses'];
                this.ddlSubmittalStatuses = data['body']['ddlSubmittalStatuses'];
                this.ddlrequestForInformationStatus = data['body']['ddlrequestForInformationStatus'];
                this.ddlsubinvStatus = data['body']['ddlsubinvStatus'];
                this.ddlCoTypes = data['body']['ddlCoTypes'];
                this.ddlMeetingTypes = data['body']['ddlMeetingTypes'];

                this.selectedreport = data['body']['selectedreport'];
                this.tilldate = data['body']['tilldate'];
                this.projectcreateddate = data['body']['projectcreateddate'];
                this.delayFirstProject = data['body']['delayFirstProject'];
                this.today = data['body']['today'];
                if (this.selectedreport == 'Bidder List,None,Y,Y') {
                  this.assignselected = true;
                }
                else {
                  this.assignselected = false;
                }
                //   setTimeout(()=>{                          
                //     this.initchangelist();
                // }, 1000);


              }


            }
            else {
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }

            }
          }
        );

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }

  file_manager() {
    this.router.navigate(['/modules-file-manager-file-browser'],
      {
        queryParams: {
          pid: this.pid
          // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
        }
      });

  }
  punchlist() {
    this.router.navigate(['/punch_list'],
      {
        queryParams: {
          pid: this.pid
          // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
        }
      });
  }
  dashboard() {
    this.router.navigate(['/dashboard'],
      {
        queryParams: {
          pid: this.pid
          // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
        }
      });
  }
  reportslist() {
    this.router.navigate(['/modules-report-form'],
      {
        queryParams: {
          pid: this.pid
          //,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
        }
      });
  }
  navigationProjectSelected(project_id, encodedProjectName, extraparam) {

    this.currentlySelectedProjectId = project_id;
    this.currentlySelectedProjectName = encodedProjectName;
    //this.passcurrentlySelectedProjectName.emit(this.currentlySelectedProjectName);
    if (extraparam == 'active') {
      $('#2_selected').hide();
      $('#3_selected').hide();
      $('#0_selected').show();

    }
    else if (extraparam == 'completed') {
      $('#0_selected').hide();
      $('#3_selected').hide();
      $('#2_selected').show();
    }
    else if (extraparam == 'other') {
      $('#0_selected').hide();
      $('#3_selected').show();
      $('#2_selected').hide();
    }

    this.router.navigate(['/dashboard'],
      {
        queryParams: {
          pid: btoa(project_id)
          //,currentlySelectedProjectName:btoa(encodedProjectName) 
        }
      }); //redirect to dashboard page after login 
  }
  MMDDYYYY(str) {
    var ndateArr = str.toString().split(' ');
    var Months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec';
    var monvalu1 = (Months.indexOf(ndateArr[1]) / 4) + 1;
    var monvalu = monvalu1.toString();
    if (monvalu.length == 1)
      monvalu = '0' + monvalu;
    return monvalu + '/' + ndateArr[2] + '/' + ndateArr[3];
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

}




