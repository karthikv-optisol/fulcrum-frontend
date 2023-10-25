import {
  Component,
  ElementRef,
  HostListener,
  ComponentFactoryResolver,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { first, map, startWith } from 'rxjs/operators';
import { ProjectBudgetService } from '../../services/project-budget.service';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {
  NgbDate,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { KeyValue } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { $$ } from 'protractor';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    //{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  host: {
    '(window:click)': 'onClick()',
  },
})
export class ProjectBudgetComponent implements OnInit {
  isShown: boolean = true;
  isShownOther: boolean = true;
  isShownActive: boolean = false;
  isShownFileManager: boolean = true;
  isShownReports: boolean = true;
  pid: string;
  search: string = '';
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
  ddlreallocationStatus = [];
  ddlSubcontractorBidStatuses = [];
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
  projectbudgetdata: any;
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
  model8: { year: number; month: number; day: number };
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
  userCanViewbudget: any;
  userCanManagebudget: any;
  ProjectBudgetData: any;
  ProjectBudgetCORData: any;
  isMenuOpen: boolean;
  arrDropDownList: any;
  arrCostCodes: any;
  importHeadline: any;
  isChecked: any = false;
  is_subtotal: any;
  balancedAmount: any;
  LoadedData: boolean;
  cost_code_abb: any;
  SubmittalDelaydatas: any;
  dateJoined: FormControl;
  selectdate: any;
  datet: NgbDateStruct = { year: 1789, month: 7, day: 14 }; // July, 14 1789
  scheduledStartDate: { year: number; month: number; day: number };
  displayStyle: string = 'none';
  displayStyleGc: string;
  scheduledValuesOnlyOption: any;
  needsBuyOutOnlyOption: string;
  needsSubValueOption: string;
  
  //import bidders variables
  costCodeDividerType:any;
  last:any = "";
  arrGcBudgetLineItems:any = [];
  arrBidderList:any = [];
  arrNonMatchingBudgetItems:any = [];
  arrPotentialBidders:any = [];
  arrSelectedGcBudgetLineItems:any = [];
  isresponse : boolean = false;
  bidLists: any;
  projects: any;
  project_id: any;
  parseduser: any;
  // project_name: any;
  companyName:any = "";
  budgetName :any = "";
  poptitle: any;
  scheduled_value: any;
  foreExp: any;
  Budget_sco: any;
  tot_estimate: any;
  pot_estimate: any;
  subOrderData: any;
  titleSubscription: Subscription;
  companyList: any;
  costCodeList: any;
  costCodeDivisionList: any;
  costCodeDividerList: any;
  isShowManagementForm: boolean = false;
  isShowCostCodeForm: boolean = false;
  manageMasterCostcodeList: any;
  selectedDivisionId: any = '';
  selectedDivisionData: any = '';
  selectedDivider: any = '';
  selectedDividerId: any = '';
  isToggleDivision: boolean = true;
  manageCostCodeId: any = -1;
  selectedCompanyId:any = '';
  divisionForm: FormGroup;
  costCodeForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    public modalService: NgbModal,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private ProjectBudgetService: ProjectBudgetService,
    private router: Router,
    private titleService: Title,
    private renderer: Renderer2,
    private commonService: CommonService,
    private loader: LoaderService,
    private toaster: ToasterService
  ) {
    this.titleService.setTitle('Construction Management - MyFulcrum.com');
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(
          params['currentlySelectedProjectName']
        );
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('users')) {
      this.FetchProjectBudgetDetails();
    }
  
    this.titleSubscription = this.commonService.selectedMenuName.subscribe((res: any) => {
      if (res.isSelected) {
        this.currentlySelectedProjectName = res.title;
      }
    })
  }


  validateDivisionForm() {
    this.divisionForm = new FormGroup({
      cost_code_type_id: new FormControl('', [Validators.required]),
      division_number: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern(/^[0-9_]*$/)]),
      division_code_heading: new FormControl('000', [Validators.required, Validators.pattern(/^[0-9_]*$/)]),
      division: new FormControl('', [Validators.required]),
      division_abbreviation: new FormControl('', [Validators.required]),
    });
  }

  validateCostCodeForm() {
    this.costCodeForm = new FormGroup({
      cost_code_division_id: new FormControl('', [Validators.required]),
      cost_code: new FormControl('', [Validators.required]),
      cost_code_description: new FormControl('', [Validators.required]),
      cost_code_description_abbreviation: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }


  toggleMenu($event) {
    $event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    $('#MenuList').show();
  }
  onClick() {
    this.isMenuOpen = false;
    $('#MenuList').hide();
  }
  loadImportCostCodesIntoBudgetDialog(contentrfi) {
    this.loadImportCostCodesIntoBudgetDialogcontent(contentrfi);
  }
  loadManageMasterCodeListDialog(MasterCodeList) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);
  }
  loadImportCostCodesIntoBudgetDialogChanges() {
    var importFromProjectId = -1;
    if ($('#ddlImportProjectList').length) {
      importFromProjectId = $('#ddlImportProjectList').val();
    }

    console.log(importFromProjectId);
    //return false;
    this.loader.show();
    this.ProjectBudgetService.loadImportCostCodesIntoBudgetDialog(
      importFromProjectId
    )
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.arrDropDownList = data['body']['arrDropDownList'];
          this.arrCostCodes = data['body']['arrCostCodes'];
          this.importHeadline = data['body']['importHeadline'];
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }
  loadManageMasterCodeListDialogChanges() {
    // var importFromProjectId = -1;
    // if ($('#ddlImportProjectList').length) {
    //   importFromProjectId = $('#ddlImportProjectList').val();
    // }

    // console.log(importFromProjectId);
    // //return false;
    // this.loader.show();
    // this.ProjectBudgetService.loadImportCostCodesIntoBudgetDialog(
    //   importFromProjectId
    // )
    //   .pipe(first())
    //   .subscribe((data) => {
    // this.loader.hide();
    //     if (data['status']) {
    //       this.arrDropDownList = data['body']['arrDropDownList'];
    //       this.arrCostCodes = data['body']['arrCostCodes'];
    //       this.importHeadline = data['body']['importHeadline'];
    //     } else {
    //       // logout if user is  inactive for 1 hour, token invalid condition
    //       if (data['code'] == '5') {
    //         localStorage.clear();
    //         this.router.navigate(['/login-form']);
    //       }
    //     }
    //   });
  }
  openDatepicker(id) {
    id.open();
  }
  SetPurchaseTargetdate(id, event) {
    console.log(event);
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
  }
  updateAllIsDcrFlag(pid) {
    var project_id = atob(pid);

    var updateData = '';
    if ($('#attach_all_copy_lock').prop('checked') == true) {
      updateData = 'Y';
      $('#attach_all_copy_text').prop('checked', true);
      $('#attach_all_copy_lock').prop('checked', true);
      $('.checkAllDcrText').prop('checked', true);
      $('.checkAllDcrEdit').prop('checked', true);
    } else {
      updateData = 'N';
      $('#attach_all_copy_text').prop('checked', false);
      $('#attach_all_copy_lock').prop('checked', false);
      $('.checkAllDcrText').prop('checked', false);
      $('.checkAllDcrEdit').prop('checked', false);
    }
    this.loader.show();
    try {
      this.ProjectBudgetService.updateAllIsDcrFlag(project_id, updateData)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.loader.hide();
            this.messageAlert(
              'Updated Successfully',
              'successMessage',
              '',
              'none'
            );
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  closePopupGC() {
    this.displayStyleGc = 'none';
  }

  filterGcBudgetLineItems() {
    var scheduledValuesOnly = $('#scheduledValuesOnly').is(':checked');
    localStorage.setItem('scheduledValuesOnly', scheduledValuesOnly);
    var needsBuyOutOnly = $('#needsBuyOutOnly').is(':checked');
    localStorage.setItem('needsBuyOutOnly', needsBuyOutOnly);
    var needsSubValue = $('#needsSubValue').is(':checked');
    localStorage.setItem('needsSubValue', needsSubValue);
    // console.log(scheduledValuesOnly);
    // return false;
    try {
      this.loader.show();
      this.ProjectBudgetService.FetchProjectBudgetDetails(
        '',
        '',
        scheduledValuesOnly,
        needsBuyOutOnly,
        needsSubValue
      )
        .pipe(first())
        .subscribe((data) => {
          this.loader.hide();
          if (data['status']) {
            this.projectbudgetdata =
              data['body']['htmlContent']['output_array'];
            this.userrole = data['body']['userRole'];
            this.is_subtotal =
              data['body']['htmlContent']['output_array']['is_subtotal'];
            this.userCanViewbudget = data['body']['userCanViewbudget'];
            this.userCanManagebudget = data['body']['userCanManagebudget'];
            this.ProjectBudgetData = data['body']['htmlContent']['return_arr'];
            this.ProjectBudgetCORData =
              data['body']['htmlContent']['output_array']['COR'];
            if (this.is_subtotal == '1') {
              this.isChecked = true;
            } else {
              this.isChecked = false;
            }
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }
  // Delete the record
  DeleteGcBudget() {
    try {
      var gc_budget_line_item_id = $('.selected_gc_id').val();

      this.ProjectBudgetService.deleteGcBudgetLineItem(gc_budget_line_item_id)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.loader.hide();
            this.messageAlert(
              'Deleted Successfully',
              'successMessage',
              '',
              'none'
            );
            window.location.reload();
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + error.message);
      return;
    }
  }
  Gc_Budget__deleteGcBudgetLineItem(
    gc_budget_line_item_id,
    options,
    gcBudgetLineItemDesc
  ) {
    $('.selected_gc_id').val('');
    var sub_check = $(
      '#gc_budget_line_items--vendorList--' + gc_budget_line_item_id
    ).attr('data-vendorcount');
    console.log(sub_check);
    if (sub_check != 0) {
      var htmltext = gcBudgetLineItemDesc;
      $('#dialog-confirm').html(htmltext);
      this.displayStyle = 'block';
      this.displayStyleGc = 'none';
    } else {
      this.displayStyle = 'none';
      this.displayStyleGc = 'block';
      try {
        $('.selected_gc_id').val(gc_budget_line_item_id);
        var htmltextgc = gcBudgetLineItemDesc;
        $('#dialog-confirm1').html(htmltextgc);
      } catch (error) {
        var errorMessage = error.message;
        alert('Exception Thrown: ' + error.message);
        return;
      }
    }
  }
  updateIsDcrFlag(id) {
    if (id) {
      var updateData = '';
      if ($('#attach_' + id).prop('checked') == true) {
        updateData = 'Y';
        $('#attach_copy_' + id).prop('checked', true);
        $('#attach_' + id).prop('checked', true);
      } else {
        updateData = 'N';
        $('#attach_copy_' + id).prop('checked', false);
        $('#attach_' + id).prop('checked', false);
      }

      //   var ajaxHandler = window.ajaxUrlPrefix + 'modules-gc-budget-ajax.php?method=updateIsDcrFlag';
      // var ajaxQueryString =
      //   'attributeId=' + encodeURIComponent(id) +
      //   '&updateData=' + encodeURIComponent(updateData);
      // var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

      // var current_project_id = $("#current_project_id").val();
      this.loader.show();
      try {
        this.ProjectBudgetService.updateIsDcrFlag(id, updateData)
          .pipe(first())
          .subscribe((data) => {
            if (data['status']) {
              this.loader.hide();
              if (data['body'] == 0) {
                $('#attach_all_copy_text').prop('checked', true);
                $('#attach_all_copy_lock').prop('checked', true);
              } else {
                $('#attach_all_copy_text').prop('checked', false);
                $('#attach_all_copy_lock').prop('checked', false);
              }
              this.messageAlert(
                'Updated Successfully',
                'successMessage',
                '',
                'none'
              );
            } else {
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }
            }
          });
      } catch (error) {
        var errorMessage = error.message;
        alert('Exception Thrown: ' + errorMessage);
        return;
      }

      // $.ajax({
      //   url: ajaxHandler,
      //   data: ajaxQueryString,
      //   success: function(){
      //     countAllIsDcrFlag(current_project_id);
      //     messageAlert('Updated Successfully', 'successMessage');
      //   },
      //   error: errorHandler
      // });
    }
  }
  onDateSelect_other(event, uniqueId) {
    $('#bdate').removeClass('redBorderThick');
    let year = event.year;
    this.selyear = year;
    this.selmonth = event.month;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + '-' + month + '-' + day;
    let finalDatenew = month + '/' + day + '/' + year;
    this.finalDate = finalDate;

    var subcontractCount = $('#subcontractCount-' + uniqueId).val();
    var dateObj = new Date();
    var cmonth = dateObj.getUTCMonth() + 1; //months from 1-12
    var cday = dateObj.getUTCDate();
    var cyear = dateObj.getUTCFullYear();

    var currentDate = cmonth + '/' + cday + '/' + cyear;
    var currentDate1 = new Date(currentDate);
    var newValueText = new Date(finalDatenew);
    console.log(currentDate1);
    console.log(newValueText);
    if (newValueText <= currentDate1 && subcontractCount < 1) {
      $('.purchasing_target' + uniqueId).css('color', 'red');
    } else {
      $('.purchasing_target' + uniqueId).css('color', '');
    }
    this.loader.show();
    try {
      this.ProjectBudgetService.updatePurchasingTarget(uniqueId, this.finalDate)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.loader.hide();
            $('.purchasingtargetdate-' + uniqueId).val(finalDatenew);
            $('.purchasing_target' + uniqueId).val(finalDatenew);
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }
  loadImportCostCodesIntoBudgetDialogcontent(contentrfi): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.ProjectBudgetService.loadImportCostCodesIntoBudgetDialog(-1)
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.arrDropDownList = data['body']['arrDropDownList'];
          this.arrCostCodes = data['body']['arrCostCodes'];
          this.importHeadline = data['body']['importHeadline'];
          this.modalService.open(contentrfi, ngbModalOptions);
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }
  loadManageMasterCodeListDialogContent(MasterCodeList, isLoad): void {
    this.loader.show();
    this.ProjectBudgetService.loadManageMasterCodeListDialog(this.manageCostCodeId)
      // .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.companyList = data.body?.company;
          this.costCodeList = data.body?.cost_code;
          this.costCodeDivisionList = data.body?.cost_code_divisions;
          this.costCodeDividerList = data.body?.arrCostCodeDividerByUserCompanyId;
          const dividerData = data.body?.cost_code_divider_for_user_company;
          this.selectedDividerId = dividerData.length ? dividerData[0].id : 1;
          this.loadMasterCodeList();
          this.isToggleDivision = true;
          this.changeDivider(this.selectedDividerId);
          if(MasterCodeList){
            this.validateDivisionForm();
            this.validateCostCodeForm();
            this.loadManageMasterCodeListDialog(MasterCodeList)
          }
          if(isLoad){
            this.changeDivision(this.selectedDivisionId);
          } else {
            this.changeDivision('');
          }
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  loadMasterCodeList(){
    var _jsonURL = '../../../assets/JSON/masterCostCode.json'
    this.ProjectBudgetService.getMasterCodeList(_jsonURL).subscribe(data => {
      if(data.status){
        this.manageMasterCostcodeList = data.body.cost_code_divisions;
      }
    })
  }

  changeDivision(value: any){
    if(value){
      this.selectedDivisionData = this.costCodeDivisionList.filter(res => res.id === this.selectedDivisionId);
      this.selectedDivisionData = Object.assign({}, ...this.selectedDivisionData)
    } else {
      this.selectedDivisionData = '';
      this.selectedDivisionId='';
    }
  }

  toggleDivision(data: any){
    if (data) {
      this.isToggleDivision = false;
      this.loader.show();
      const inputData = {
        cost_code_type_id: data.cost_code_type_id,
        division_number: data.division_number,
        attribute_subgroup_name:'cost_code_divisions',
        newValue: data.disabled_flag == "Y" ? 'N' : 'Y',
        attributeName:'disabled_flag',
        uniqueId: data.id
      }
      this.ProjectBudgetService.updateCostCodeDivision(inputData)
        .subscribe((data) => {
          this.loader.hide();
          if (data.status) {
            this.loadManageMasterCodeListDialogContent('', true);
            this.toaster.showSuccessToaster(data.body?.original?.Message, "");
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        });
    } else {
      this.toaster.showInfoToaster("Please, Select the Division value", "");
    }
  }

  deleteCostCodeDivision(data){
    if(this.selectedDivisionId){
      this.loader.show();
      const inputData = {
        cost_code_type_id: data.cost_code_type_id,
        division_number: data.division_number,
        attribute_subgroup_name:'cost_code_divisions',
        uniqueId: data.id
      }
      this.ProjectBudgetService.deleteCodeDivision(inputData)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.loadManageMasterCodeListDialogContent('', false);
          this.toaster.showSuccessToaster(data.body?.original?.Message, "");
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
    } else {
      this.toaster.showInfoToaster("Please, Select the Division value", "");
    }
  }

  manageCostCodeSelection(){
    this.loadManageMasterCodeListDialogContent('', false);
  }

  saveCostCodeDivider(){
    if(this.selectedDividerId){
      this.loader.show();
      const inputData = {
        divider_id: this.selectedDividerId
      }
      this.ProjectBudgetService.updateCostCodeDivider(inputData)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.toaster.showSuccessToaster(data.body?.original?.Message, "");
          this.loadManageMasterCodeListDialogContent('', false)
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
    } else {
      this.toaster.showInfoToaster("Please, Select the Cost Divider value", "");
    }
  }

  divisionFormSubmit(){
    this.divisionForm.patchValue({
      cost_code_type_id:this.manageCostCodeId > 0 ? this.manageCostCodeId : ''
    })
    this.divisionForm.markAllAsTouched();
    if(this.divisionForm.valid){
      this.loader.show();
      this.ProjectBudgetService.createCostCodeDivision(this.divisionForm.value)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.loadManageMasterCodeListDialogContent('', false)
          this.toaster.showSuccessToaster('New Division - Created successfully.', "");
          this.divisionForm.reset();
          this.divisionDefaultValue();
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
    }
  }

  divisionDefaultValue(){
    this.divisionForm.patchValue({
      division_code_heading: '000'
    })
  }

  costCodeFormSubmit(){
    this.costCodeForm.markAllAsTouched();
    if(this.costCodeForm.valid){
      this.loader.show();
      this.ProjectBudgetService.createCostCode(this.costCodeForm.getRawValue())
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.toaster.showSuccessToaster('New Cost Code - Created successfully.', "");
          this.loadManageMasterCodeListDialogContent('', false)
          this.costCodeForm.reset();
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
    }  }

    changeDivider(data: any){
      if(data){
        this.selectedDivider = this.costCodeDividerList.filter((res: { id: any; }) => res.id == this.selectedDividerId); 
      } else {
        this.selectedDivider = '';
        this.selectedDividerId = 1;
      }   
    }

  styleObject(inputarr) {
    if (inputarr != undefined) {
      return { height: '400px' };
    }
    return {};
  }
  allowToUserEditPrimeDcr(allow) {
    if (allow) {
      $('#entypo-edit-icon-dcr').css('display', 'none');
      $('#entypo-lock-icon-dcr').css('display', 'block');
      $('.dcr-text').css('display', 'none');
      $('.dcr-edit').css('display', 'block');
    } else {
      $('#entypo-edit-icon-dcr').css('display', 'block');
      $('#entypo-lock-icon-dcr').css('display', 'none');
      $('.dcr-text').css('display', 'block');
      $('.dcr-edit').css('display', 'none');
    }
  }
  FetchProjectBudgetDetails() {
    this.scheduledValuesOnlyOption =
      localStorage.getItem('scheduledValuesOnly') == 'true' ? 'checked' : '';
    this.needsBuyOutOnlyOption =
      localStorage.getItem('needsBuyOutOnly') == 'true' ? 'checked' : '';
    this.needsSubValueOption =
      localStorage.getItem('needsSubValue') == 'true' ? 'checked' : '';
    try {
      this.loader.show();
      this.ProjectBudgetService.FetchProjectBudgetDetails(
        '',
        '',
        localStorage.getItem('scheduledValuesOnly'),
        localStorage.getItem('needsBuyOutOnly'),
        localStorage.getItem('needsSubValue')
      )
        .pipe(first())
        .subscribe((data) => {
          this.loader.hide();
          if (data['status']) {
            this.projectbudgetdata =
              data['body']['htmlContent']['output_array'];
            this.userrole = data['body']['userRole'];
            this.is_subtotal =
              data['body']['htmlContent']['output_array']['is_subtotal'];
            this.userCanViewbudget = data['body']['userCanViewbudget'];
            this.userCanManagebudget = data['body']['userCanManagebudget'];
            this.ProjectBudgetData = data['body']['htmlContent']['return_arr'];
            this.ProjectBudgetCORData =
              data['body']['htmlContent']['output_array']['COR'];
            if (this.is_subtotal == '1') {
              this.isChecked = true;
            } else {
              this.isChecked = false;
            }
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }
  AddorEditnotes(id) {
    $('.popupover_edit').hide();
    try {
      var newValue = $('.notestext_' + id).val();

      if (newValue == '') {
        $('#CreateNotesdiv_' + id).show();
        $('#CreateNotesdiv_' + id).removeClass('hidden');
      } else {
        this.loader.show();
        this.ProjectBudgetService.NotesData(id)
          .pipe(first())
          .subscribe((data) => {
            if (data['status']) {
              this.LoadedData = true;
              this.loader.hide();
              $('#CreateNotesdiv_' + id).show();
              $('#CreateNotesdiv_' + id).removeClass('hidden');
              $(
                '#manage-gc_budget_line_item-record--gc_budget_line_items--notes--' +
                  id
              ).val(data['body']['notes']);
            } else {
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }
            }
          });
      }
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
    // to initiate the Notes popover
    // $(".btnAddNotesPopover").popover({
    //   html: true,
    //   title: 'Add/Edit Notes',
    //   content: function() {
    //     var b_id = this.id.split('_');
    //     var bud_id = b_id[1];
    //     var content = $("#CreateNotesdiv_"+bud_id).html();
    //     $("#CreateNotesdiv_"+bud_id).html('');
    //     $(this).on('hide.bs.popover', function() {
    //       $("#CreateNotesdiv_"+bud_id).html(content);
    //     });
    //     //retrieveNotesData(bud_id);

    //     return content;
    //   }
    // }).click(function (e) {
    //   $('[data-original-title]').popover('hide');
    //   $(this).popover('show');
    // });
  }
  closenotes(budget_id) {
    var newValue = $('.notestext_' + budget_id).val();
    //if (newValue != '') {

    this.loader.show();
    try {
      this.ProjectBudgetService.updateNotes(budget_id, newValue)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.LoadedData = true;
            this.loader.hide();
            $('#CreateNotesdiv_' + budget_id).hide();
            $('#CreateNotesdiv_' + budget_id).addClass('hidden');
            if (newValue == '') {
              $('#btnAddNotesPopover_' + budget_id).removeClass(
                'entypo-doc-text'
              );
              $('#btnAddNotesPopover_' + budget_id).addClass(
                'entypo-plus-circled'
              );
            } else {
              $('#btnAddNotesPopover_' + budget_id).removeClass(
                'entypo-plus-circled'
              );
              $('#btnAddNotesPopover_' + budget_id).addClass('entypo-doc-text');
            }
            $('#btnAddNotesPopover_' + budget_id)
              .next('div')
              .css('display', 'none');
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
    // }
    // else {
    //   $('#CreateNotesdiv_' + budget_id).hide();
    //   $('#CreateNotesdiv_' + budget_id).addClass('hidden');
    // }
  }
  HideNotes(budget_id) {
    $('#CreateNotesdiv_' + budget_id).hide();
    $('#CreateNotesdiv_' + budget_id).addClass('hidden');
  }
  // moveToNextRowIfEnterKeyWasPressed(event)
  // {
  //   // keyCode 13 is the enter key (standard across all browsers and platforms).
  //   if (event.keyCode != 13) {
  //     return;
  //   }

  //   // Get the class of the element that should get focus.
  //   var targetElement = event.target;
  //   if ($(targetElement).hasClass('autosum-pcsv')) {
  //     var nextElementClass = 'autosum-pcsv';
  //   } else if ($(targetElement).hasClass('autosum-fe')) {
  //     var nextElementClass = 'autosum-fe';
  //   } else {
  //     return;
  //   }

  //   // If the shift key was pressed, focus the element of the previous row.
  //   // Otherwise, focus the element of the next row.
  //   var tr = $(targetElement).closest('tr');
  //   if (event.shiftKey) {
  //     tr.prev().find('.' + nextElementClass).focus();
  //   } else {
  //     tr.next().find('.' + nextElementClass).focus();
  //   }
  // }
  isNumber(x) {
    // check if the passed value is a number
    if (typeof x == 'number' && !isNaN(x)) {
      // check if it is integer
      if (Number.isInteger(x)) {
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  closesubmittalPopover(budget_id) {
    $('#submittalitem_' + budget_id).removeClass('show_cont');
  }
  closescoPopover(budget_id) {
    $('#suborderitem_' + budget_id).removeClass('show_cont');
  }
  loadSubmittalDelayDATA(cost_code_id, pid, budget_id) {
    this.loader.show();
    try {
      this.ProjectBudgetService.loadSubmittalDelayDATA(budget_id, cost_code_id)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.loader.hide();
            $('#submittalitem_' + budget_id).addClass('show_cont');
            this.cost_code_abb = data['body']['return_arr']['cost_code_abb'];
            this.SubmittalDelaydatas = data['body']['return_arr1'];
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }
  loadSubcontractCODATA(cost_code_id,project_id,budget_id,subcontract_id)
{
  console.log(subcontract_id);
  this.loader.show();
  try {
    this.ProjectBudgetService.loadSubcontractCODATA(cost_code_id,project_id,budget_id,subcontract_id)
      .pipe(first())
      .subscribe((data) => {
        if (data['status']) {
          console.log(data);
          this.loader.hide();
          $('#suborderitem_' + subcontract_id).addClass('show_cont');
          this.poptitle= data['body']['poptitle'];
          this.scheduled_value= data['body']['scheduled_value'];
          this.foreExp= data['body']['foreExp'];
          this.Budget_sco= data['body']['Budget_sco'];
          this.tot_estimate= data['body']['tot_estimate'];
          this.pot_estimate= data['body']['pot_estimate'];
          this.subOrderData= data['body']['subOrderData'];
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
          }
        }
      });
  } catch (error) {
    var errorMessage = error.message;
    alert('Exception Thrown: ' + errorMessage);
    return;
  }
}

  Gc_Budget__updateGcBudgetLineItem(
    budget_id,
    value,
    attributeSubgroupName,
    calVal,
    calVal1
  ) {
    var value = value.toString().replace(/[^0-9\.-]+/g, '');
    var aboveorbelw = $('#aboveorbelw').val();
    if (!isNaN(value)) {
      this.loader.show();
      var newValue = parseFloat(value).toFixed(2);
      try {
        this.ProjectBudgetService.updateAttributes(
          budget_id,
          newValue,
          attributeSubgroupName
        )
          .pipe(first())
          .subscribe((data) => {
            if (data['status']) {
              this.loader.hide();
              if (attributeSubgroupName == 'forecasted_expenses') {
                $('.updateforecasted_expenses_' + budget_id).val(data['body']);
              } else if (
                attributeSubgroupName == 'buyout_forecasted_expenses'
              ) {
                $('.updatebuyout_forecasted_expenses_' + budget_id).val(
                  data['body']
                );
              }
              setTimeout(function () {
                var value = data['body'].toString().replace(/[^0-9\.-]+/g, '');
                var subcontractCount = $('.subcontractCount' + budget_id).val();
                var count = calVal;
                var loopLength = $('.pcsvSubFld' + count).length;
                if (attributeSubgroupName == 'forecasted_expenses') {
                  var pcsvORfe = 'fe';
                } else if (
                  attributeSubgroupName == 'buyout_forecasted_expenses'
                ) {
                  pcsvORfe = 'be';
                } else {
                  pcsvORfe = 'pcsv';
                }
                if (pcsvORfe == 'pcsv') {
                  var total = 0;
                  for (var i = 1; i <= loopLength; i++) {
                    var value1 = $('.pcsvSubFld' + count + '-' + i).val();
                    if (value1 == undefined || value1 == 'undefined') {
                      value1 = 0;
                    }

                    value1 = value1.toString().replace(/[^0-9\.-]+/g, '');
                    total = Number(total) + Number(value1);
                  }

                  var total1 = total.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });
                  $('#pcsvSubtotal' + count)
                    .empty()
                    .html(total1);
                }
                if (pcsvORfe == 'fe') {
                  if (value >= 0) {
                    $('.updateforecasted_expenses_' + budget_id).removeClass(
                      'red'
                    );
                  } else {
                    $('.updateforecasted_expenses_' + budget_id).addClass(
                      'red'
                    );
                  }
                  if (aboveorbelw == 2) {
                    var ocototal = Number(
                      $('.ocototal' + budget_id)
                        .html()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );
                    var pscvtotal =
                      Number(
                        $('.pscvtotal' + budget_id)
                          .html()
                          .toString()
                          .replace(/[^0-9\.-]+/g, '')
                      ) + ocototal;
                  } else {
                    var pscvtotal = Number(
                      $('.pscvtotal' + budget_id)
                        .html()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );
                  }
                  var fetotal = Number(
                    $('.fetotal' + budget_id)
                      .val()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );
                  var bfetotal = Number(
                    $('.bfetotal' + budget_id)
                      .val()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );
                  var savrawtotal = Number(
                    $('.savrawtotal' + budget_id)
                      .html()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );
                  var arrValuesfe = $('.autosum-fe');
                  var feoverallTotal = 0;
                  arrValuesfe.each(function (index, element) {
                    feoverallTotal += Number(
                      $(this)
                        .val()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );
                  });
                  if (feoverallTotal >= 0) {
                    $('#forecastedExpensesTotal').removeClass('red');
                  } else {
                    $('#forecastedExpensesTotal').addClass('red');
                  }
                  var formatedfeoveralltotal = feoverallTotal.toLocaleString(
                    'en-US',
                    {
                      maximumFractionDigits: 2,
                      style: 'currency',
                      currency: 'USD',
                    }
                  );
                  $('#forecastedExpensesTotal').val(formatedfeoveralltotal);

                  if (subcontractCount >= 1) {
                    var variance = pscvtotal - (fetotal + savrawtotal);
                  } else {
                    var variance =
                      pscvtotal - (fetotal + bfetotal + savrawtotal);
                  }
                  if (variance >= 0) {
                    $('.variance' + budget_id).removeClass('red');
                  } else {
                    $('.variance' + budget_id).addClass('red');
                  }

                  var overallvariance = variance.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });

                  $('.variance' + budget_id).html(overallvariance);

                  var total = 0;

                  for (var i = 1; i <= loopLength; i++) {
                    var valuefe = $('.feSubFld' + count + '-' + i).val();
                    var beSubFld = $('.beSubFld' + count + '-' + i).val();
                    var autosumsav = $('.autosum-sav' + count + '-' + i).val();

                    if (valuefe == undefined || valuefe == 'undefined') {
                      valuefe = 0;
                    }

                    valuefe = valuefe.toString().replace(/[^0-9\.-]+/g, '');
                    total = Number(total) + Number(valuefe);
                  }
                  if (total < 0) {
                    $('#feSubtotal' + count).addClass('red');
                  } else {
                    $('#feSubtotal' + count).removeClass('red');
                  }

                  var total2 = total.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });

                  $('#feSubtotal' + count)
                    .empty()
                    .html(total2);
                }
                // For buyout expenses
                if (pcsvORfe == 'be') {
                  if (value >= 0) {
                    $(
                      '.updatebuyout_forecasted_expenses_' + budget_id
                    ).removeClass('red');
                  } else {
                    $(
                      '.updatebuyout_forecasted_expenses_' + budget_id
                    ).addClass('red');
                  }

                  if (aboveorbelw == 2) {
                    var ocototal = Number(
                      $('.ocototal' + budget_id)
                        .html()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );

                    var pscvtotal =
                      Number(
                        $('.pscvtotal' + budget_id)
                          .html()
                          .toString()
                          .replace(/[^0-9\.-]+/g, '')
                      ) + ocototal;
                  } else {
                    var pscvtotal = Number(
                      $('.pscvtotal' + budget_id)
                        .html()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );
                  }
                  var fetotal = Number(
                    $('.fetotal' + budget_id)
                      .val()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );
                  var bfetotal = Number(
                    $('.bfetotal' + budget_id)
                      .val()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );
                  var savrawtotal = Number(
                    $('.savrawtotal' + budget_id)
                      .html()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '')
                  );

                  var arrValuesbe = $('.autosum-be');
                  var beoverallTotal = 0;
                  arrValuesbe.each(function (index, element) {
                    beoverallTotal += Number(
                      $(this)
                        .val()
                        .toString()
                        .replace(/[^0-9\.-]+/g, '')
                    );
                  });
                  if (beoverallTotal >= 0) {
                    $('#buyoutExpensesTotal').removeClass('red');
                  } else {
                    $('#buyoutExpensesTotal').addClass('red');
                  }
                  var formatedbeoveralltotal = beoverallTotal.toLocaleString(
                    'en-US',
                    {
                      maximumFractionDigits: 2,
                      style: 'currency',
                      currency: 'USD',
                    }
                  );
                  $('#buyoutExpensesTotal').val(formatedbeoveralltotal);

                  if (subcontractCount >= 1) {
                    var variance = pscvtotal - (fetotal + savrawtotal);
                  } else {
                    var variance =
                      pscvtotal - (fetotal + bfetotal + savrawtotal);
                  }
                  var overallvariance = variance.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });

                  $('.variance' + budget_id).html(overallvariance);

                  if (variance >= 0) {
                    $('.variance' + budget_id).removeClass('red');
                  } else {
                    $('.variance' + budget_id).addClass('red');
                  }

                  var total = 0;
                  for (var i = 1; i <= loopLength; i++) {
                    var valuebes = $('.beSubFld' + count + '-' + i).val();
                    if (valuebes == undefined || valuebes == 'undefined') {
                      valuebes = 0;
                    }

                    valuebes = valuebes.toString().replace(/[^0-9\.-]+/g, '');
                    total = Number(total) + Number(valuebes);
                  }
                  if (total < 0) {
                    $('#beSubtotal' + count).addClass('red');
                  } else {
                    $('#beSubtotal' + count).removeClass('red');
                  }

                  var total4 = total.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });
                  $('#beSubtotal' + count)
                    .empty()
                    .html(total4);
                }
                var varianceoverallTotal = 0;
                $('.GcVariance')
                  .find('span')
                  .each(function () {
                    var autosumvariance = $(this)
                      .html()
                      .toString()
                      .replace(/[^0-9\.-]+/g, '');
                    varianceoverallTotal += Number(autosumvariance);
                  });
                console.log(varianceoverallTotal);
                if (varianceoverallTotal >= 0) {
                  $('#varianceTotal').removeClass('red');
                } else {
                  $('#varianceTotal').addClass('red');
                }
                var formatedvaroveralltotal =
                  varianceoverallTotal.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'USD',
                  });
                $('#varianceTotal').val(formatedvaroveralltotal);

                var total = 0;
                for (var i = 1; i <= loopLength; i++) {
                  var value = $('.vSubFld' + count + '-' + i).html();

                  if (value == undefined || value == 'undefined') {
                    value = 0;
                  }

                  value = value.toString().replace(/[^0-9\.-]+/g, '');
                  total = Number(total) + Number(value);
                }
                if (total < 0) {
                  $('#vSubtotal' + count).addClass('red');
                } else {
                  $('#vSubtotal' + count).removeClass('red');
                }

                var total3 = total.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  style: 'currency',
                  currency: 'USD',
                });

                $('#vSubtotal' + count)
                  .empty()
                  .html(total3);
              }, 1000);
            } else {
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }
            }
          });
      } catch (error) {
        var errorMessage = error.message;
        alert('Exception Thrown: ' + errorMessage);
        return;
      }
    } else {
      var messageText = 'Not a valid input';

      this.messageAlert(messageText, 'errorMessage', '', 'none');
    }
  }
  checkAllImportItems() {
    var checked = $('#chkImportDefault').is(':checked');
    $('.input-import-checkbox').prop('checked', checked);
  }
  importCostCodesIntoBudget() {
    try {
      var arrCostCodeIds = [];
      $('.input-import-checkbox:checkbox:checked').each(function (i) {
        var cost_code_id = $(this).val();
        arrCostCodeIds.push(cost_code_id);
      });
      var csvCostCodeIds = arrCostCodeIds.join(',');
      var selectedCostCodeType = $('#ddlImportProjectList').val();
      selectedCostCodeType = selectedCostCodeType.split(':')[0];

      this.loader.show();
      if (selectedCostCodeType == 't_cct_id') {
        var method = 'importCostCodesTemplatesIntoBudget';
      } else {
        method = 'importCostCodesIntoBudget';
      }
      this.ProjectBudgetService.LoadimportCostCodesIntoBudget(
        method,
        csvCostCodeIds
      )
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
            this.loader.hide();
            var messageText = 'Items successfully imported';
            this.messageAlert(messageText, 'successMessage', '', 'none');
            window.location.reload();
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      alert('Exception Thrown: ' + error);
      return;
    }
  }
  messageAlert(text, messageStyle, labelStyle, elementId) {
    clearTimeout(window['labelStyleTimeout_' + elementId]);
    clearTimeout(window['messageStyleTimeout_' + elementId]);

    var messageTimeout = 7000;

    $('#messageDiv').removeClass();
    $('#messageDiv').html('');

    $('#messageDiv').addClass(messageStyle);
    $('#messageDiv').html(text);
    $('#messageDiv').fadeIn('slow');

    window['messageStyleTimeout_' + elementId] = setTimeout(function () {
      $('#messageDiv').fadeOut('slow', function () {
        $('#messageDiv').removeClass();
        $('#messageDiv').html('');
      });
    }, messageTimeout);

    if (elementId != '') {
      var classesToRemove =
        'infoMessageLabel successMessageLabel warningMessageLabel errorMessageLabel modalMessage';
      $('#' + elementId).removeClass(classesToRemove);
      $('#' + elementId).addClass(labelStyle);

      window['labelStyleTimeout_' + elementId] = setTimeout(function () {
        $('#' + elementId).removeClass(classesToRemove);
      }, messageTimeout);
    }
  }
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.isChecked = true;
      this.balancedAmount = true;
    } else {
      this.isChecked = false;
      this.balancedAmount = false;
    }

    try {
      this.ProjectBudgetService.updateIsSubtotal(this.isChecked)
        .pipe(first())
        .subscribe((data) => {
          if (data['status']) {
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }
          }
        });
    } catch (error) {
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    }
  }

  showsubmenu(param) {
    if (param == 'completed') {
      this.isShown = !this.isShown;
    } else if (param == 'other') {
      this.isShownOther = !this.isShownOther;
    } else if (param == 'active') {
      this.isShownActive = !this.isShownActive;
    } else if (param == 'file_manager') {
      this.isShownFileManager = !this.isShownFileManager;
    } else if (param == 'reports') {
      this.isShownReports = !this.isShownReports;
    }
  }

  loadImportBiddersDialog(importValue: any) {
    this.loadImportBiddersDialogcontent(importValue);
  }

  loadRequestBudgetNumberDialog(importValue: any) {
    this.loadRequestBudgetNumberDialogcontent(importValue);
  }
  

  loadUploadFilesByCompanyDialog(importValue: any) {
    this.loadUploadFilesByCompanyDialogcontent(importValue);
  }

  loadsendBitInviteDialog(importValue: any) {
    this.sendBitInviteDialogContent(importValue);
  }

  modalImportBiddersReference = null;   
  loadImportBiddersDialogcontent(importValue: any): void {
    this.costCodeDividerType = "";
    this.arrGcBudgetLineItems =[];
    this.arrPotentialBidders = [];
    this.arrNonMatchingBudgetItems = [];
    this.arrBidderList = [];
    this.arrSelectedGcBudgetLineItems = [];
    this.last = "";
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page2 pt-0',
    };
    this.isresponse = false;
    this.ProjectBudgetService.loadImportBiddersDropDown()
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.bidLists = data['body']['bid_lists'];
          this.projects = data['body']['projects'];
          this.modalImportBiddersReference = this.modalService.open(importValue, ngbModalOptions);
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  modalRequestBudgetNumberReference = null;   
  arrRequestBidderList:any = [];   
  rowGcBudgetLineItems:any = [];   
  arrCodesCheckable:any = [];   
  isrequestresponse:boolean = false;
  loadRequestBudgetNumberDialogcontent(importValue: any): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page3',
    };
    this.isrequestresponse = false;
    this.ProjectBudgetService.loadRequestBudgetNumber()
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.isrequestresponse = true;
          this.rowGcBudgetLineItems = data['body']['rowGcBudgetLineItems'];
          this.arrRequestBidderList = data['body']['arrBidderList'];
          this.arrCodesCheckable = data['body']['arrCodesCheckable'];
          this.modalRequestBudgetNumberReference = this.modalService.open(importValue, ngbModalOptions);

        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  modalUploadFilesByCompanyReference = null;   
  biddersByCompanies :any = [];
  uploadCostCodeDividerType :any;
  loadUploadFilesByCompanyDialogcontent(importValue: any): void {
    this.companyName = "";
    this.budgetName = "";
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page4',
    };
    this.isresponse = false;
    this.ProjectBudgetService.loadUploadFilesByCompany()
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.biddersByCompanies = data['body']['biddersByCompany'];
          this.uploadCostCodeDividerType = data['body']['costCodeDividerType'];
          this.modalUploadFilesByCompanyReference = this.modalService.open(importValue, ngbModalOptions);
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }
  getSubcontractorBidLists:any =[];
  sendBitInviteDialogContent(importValue: any): void {
    this.loader.show();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page4',
    };

    this.ProjectBudgetService.getSubcontractorBidStatus()
      .pipe(first())
      .subscribe((data) => {
        this.loader.hide();
        if (data['status']) {
          this.getSubcontractorBidLists = data['body']['getSubcontractorBidStatus'];
          this.modalUploadFilesByCompanyReference = this.modalService.open(importValue, ngbModalOptions);
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  ddlValue(row:any){
    let company = row['company'];
    let division_number = row['division_number'];
    let cost_code = row['cost_code'];
    let cost_code_description = row['cost_code_description'];
    let contactFullName = row['first_name']+" "+row['last_name'];
    let gc_budget_line_item_id = row['gc_budget_line_item_id'];
    let subcontractor_bid_id = row['subcontractor_bid_id'];

    let ddlDisplay = company+" ("+division_number+this.uploadCostCodeDividerType+cost_code+" "+cost_code_description+") "+contactFullName;
    let divisionData = division_number+this.uploadCostCodeDividerType+cost_code+' '+cost_code_description;
    let ddlValue = gc_budget_line_item_id+"|"+subcontractor_bid_id+"|"+company+"|"+divisionData;
      return ddlValue;
  }

  ddlDisplay(row:any){
    let company = row['company'];
    let division_number = row['division_number'];
    let cost_code = row['cost_code'];
    let cost_code_description = row['cost_code_description'];
    let contactFullName = row['first_name']+" "+row['last_name'];
    let gc_budget_line_item_id = row['gc_budget_line_item_id'];
    let subcontractor_bid_id = row['subcontractor_bid_id'];

    let ddlDisplay = company+" ("+division_number+this.uploadCostCodeDividerType+cost_code+" "+cost_code_description+") "+contactFullName;
    let divisionData = division_number+this.uploadCostCodeDividerType+cost_code+' '+cost_code_description;
    let ddlValue = gc_budget_line_item_id+"|"+subcontractor_bid_id+"|"+company+"|"+divisionData;
    return ddlDisplay;
  }
  
  updateImportOptions(selectValue: any) {
    let split = selectValue.split('|');
    let import_type = split[0];
    let select_project_id = split[1];
    this.last = "";
    this.ProjectBudgetService.loadImportBiddersSelect(import_type, select_project_id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.loader.hide();
          if (data['status']) {
            this.isresponse = true;
            this.last = "";
            this.costCodeDividerType = data['body']['costCodeDividerType'];
            this.arrGcBudgetLineItems = data['body']['arrGcBudgetLineItems'];
            this.arrPotentialBidders = data['body']['arrPotentialBidders'];
            let arrNonMatchingBudgetItems = data['body']['arrPotentialBidders'];
            this.arrNonMatchingBudgetItems = arrNonMatchingBudgetItems.sort((a:any, b:any) => b.cost_code_id - a.cost_code_id);
            this.arrBidderList = data['body']['arrBidderList'];
            this.arrSelectedGcBudgetLineItems = data['body']['arrSelectedGcBudgetLineItems'];
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        },
        (err: Error) => {
          this.loader.hide();
          console.log(err);
        }
      );
  }

  checkBiddersToImport(event:any,cost_code:any){
    if ($('.allcheck').is(':checked')) {
      if (cost_code.toString() == '0') {
        $(".inputCheckbox").prop('checked', true);
      } else {
        $("." + cost_code).prop('checked', true);
      }
    } else {
      if (cost_code.toString() == '0') {
        $(".inputCheckbox").prop('checked', false);
      } else {
        $("." + cost_code).prop('checked', false);
      }
    }
  }

checkBiddersToInvite(chkBox:any,costCode:any)
{
  if ($('.allinvitecheck').is(":checked")) {
    if (costCode.toString() == '0') {
       $(".inviteCheckBox").prop('checked', true);
      } else {
        $("." + costCode).prop('checked', true);
      }
    } else {
      if (costCode.toString() == '0') {
        $(".inviteCheckBox").prop('checked', false);
      } else {
        $("." + costCode).prop('checked', false);
      }
    }
  }

  checkBiddersToSendInvite(chkBox:any,costCode:any)
  {
    if ($('.allsendinvitecheck').is(":checked")) {
      if (costCode.toString() == '0') {
        $(".inviteCheckBox").prop('checked', true);
      } else {
        $("." + costCode).prop('checked', true);
      }
    } else {
      if (costCode.toString() == '0') {
        $(".inviteCheckBox").prop('checked', false);
      } else {
        $("." + costCode).prop('checked', false);
      }
    }
  }

  importSelectedBidders(){
    
    let arrCheckedBidders = $('input[id^="chk_"]:checked').map(function () {
      return this.value;
    }).get();

    if (arrCheckedBidders.length == 0) {
      let messageText = 'You have not selected any bidders to import.';
      alert(messageText);
    }else{
      this.ProjectBudgetService.importSelectedBidders(arrCheckedBidders)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.loader.hide();
          if (data['status']) {
            this.modalImportBiddersReference.close();
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        },
        (err: Error) => {
          this.loader.hide();
          console.log(err);
        }
      );
    }
  }

  checkDisplay(old:any,last:any){
    let result:any
    if(last==""){
      this.last = old;
      result = true;
    }else{
      if(old == last){
        result = false;
      }else{
        result = true;
      }
      this.last = old;
    }
    return result;
  }

  updateSubcontractorBidDocumentFileUploaderModalDialog(selValue:any){
    var arrIds = selValue.split('|');
    var gc_budget_line_item_id = arrIds[0];
    var subcontractor_bid_id = arrIds[1];
    var companyName = arrIds[2];
    var budgetName = arrIds[3];
    this.budgetName = budgetName;
    this.companyName = companyName;
    this.ProjectBudgetService.updateSubcontractorBidDocumentFileUploader(gc_budget_line_item_id, subcontractor_bid_id)
    .pipe(first())
    .subscribe(
      (data: any) => {
        this.loader.hide();
        if (data['status']) {
          this.modalImportBiddersReference.close();
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      },
      (err: Error) => {
        this.loader.hide();
        console.log(err);
      }
    );
  }
  arrBidders:any = [];
  updateBidderEmailList(){
    this.arrBidders = [];
    this.loader.show();
    this.last = "";
    let ddlStatus = $("#ddl_subcontractor_bid_status_id").val();
    let ddlStatusString = ddlStatus.reduce((current:any, value:any, index:any) => {
      if(index > 0)
            current += ',';
        return current + value;
      }, '');
      this.ProjectBudgetService.updateEmailBiddersList(ddlStatusString)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.loader.hide();
          if (data['status']) {
            this.arrBidders = data['body']['arrBidders'];
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        },
        (err: Error) => {
          this.loader.hide();
          console.log(err);
        }
      );
  
  }
}
