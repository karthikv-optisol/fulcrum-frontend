import { Component, Inject, Input, NgZone, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PunchListService } from '../../services/punch-list.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as $ from "jquery";
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: '',
  templateUrl: './punch-list.component.html',
  styleUrls: ['./punch-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PunchListComponent implements OnInit {
  p: number = 1;
  search: string = "";
  punchPdfUrl:string="";
  limit:number = 10;
  totalcount: number = 1;
  punchList: any = [];
  loading: boolean = true;
  @Input() fieldvalue = '';
  paginationData: any;
  showProjectNavBox : boolean= false;
  arrCompletedProjects=[];
  arrOtherProjects=[];
  arrActiveProjects=[];
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;
  isShown: boolean = true ;
  isShownOther :boolean = true;
  isShownActive :boolean = false;
  isShownFileManager :boolean = true;
  Arraysidemenu = [];
  attachmentRecords=[];
  pid: string;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  modalloading: boolean = false;
  cnt_attachmentRecords:number = 0;
  isShownReports: boolean = true;
  usersdetails=[];
  IsshowActive :boolean = false;
  IsshowCompleted :boolean = false;
  IsshowOther :boolean = false;
  titleSubscription: Subscription;
  constructor(public modalService: NgbModal, private dialogRef: MatDialogRef<PunchListComponent>,private ngZone: NgZone,public dialog: MatDialog,private route: ActivatedRoute,private punchListService: PunchListService, private router: Router,private titleService: Title, private commonService: CommonService, private loader: LoaderService) {

    this.titleService.setTitle("Punch List");
    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if(params['currentlySelectedProjectName'] != null)
      {
        this.currentlySelectedProjectName = atob(params['currentlySelectedProjectName']);
        
      }
     
  });
   }
  
  ngOnInit() {
      if (localStorage.getItem('users')) {
       
    this.getPunchLists();
      }
    else{
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

  asIsOrder(a, b) {
    return 1;
  }
  searchpunchlist(event) {
  
    if((event) && (event.length >= 3))
    {
      this.search = event;
      this.getPunchLists();

    }
    else{
      this.search = "";
      this.getPunchLists();
    }
    
}

showpunchlists(event) {
  this.limit = event;
  this.getPunchLists();
}
  handlePageChange(event: number): void {
    this.p = event;
    this.getPunchLists();
  }
  getPunchLists(): void {
    this.loader.show();
    this.modalloading = true;
    this.punchListService.getServicePunchLists(this.p,this.limit,this.search, this.pid)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          this.modalloading = false;
          if (data['status']) {
           
            this.punchList = data['body'];
            this.totalcount = data['count'];
            this.paginationData = data['pagination_data'];
          }
          else {
           // logout if user is  inactive for 1 hour, token invalid condition
           if(data['code'] == '5')
           {
             localStorage.clear();
             this.router.navigate(['/login-form']);
           }
          }
        }
      );
  }

  showPunchitem(punch_id)
  {
    try {
      // If the options object was not passed as an argument, create it here.  
      this.loader.show();
      this.modalloading = true;
      this.punchListService.showPunchitem(punch_id)
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            this.modalloading = false;
            if (data['status']) {
              this.attachmentRecords = data['body']['attachmentRecords'];
              this.cnt_attachmentRecords = data['body']['cnt_attachmentRecords'];
              this.punchPdfUrl = data['body']['punchPdfUrl'];
              var dialogWidth ='500px';
              var dialogHeight = '250px';
              
              this.dialog.open(this.callAPIDialog, { disableClose: true });
             
            }
            else {
            }
          }
        );
    } catch(error) {
  
      
        var errorMessage = error.message;
        alert('Exception Thrown: ' + errorMessage);
        return;
      
    }
  }

  showPunchitemAttach(punch_id,Contentattachments) {
    this.loader.show();
    this.modalloading = true;
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false, windowClass: 'punchlist-page'
};
try {
  // If the options object was not passed as an argument, create it here.  
  this.loader.show();
  this.modalloading = true;
    this.punchListService.showPunchitem(punch_id)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          this.modalloading = false;
          if (data['status']) {
            this.attachmentRecords = data['body']['attachmentRecords'];
            this.cnt_attachmentRecords = data['body']['cnt_attachmentRecords'];
            this.punchPdfUrl = data['body']['punchPdfUrl'];
          this.modalService.open(Contentattachments, ngbModalOptions);
          }
          else {
            
          }
        }
      );
    } catch(error) {
  
      
      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;
    
  }
  }
  punch__openpdfInNewTab(url)
  {
    window.open(url, '_blank');
  }
  closeDialog() {
    
      this.dialogRef.close();
    
  }
  file_manager()
  {
    this.router.navigate(['/modules-file-manager-file-browser'],
    { queryParams: { pid:this.pid 
     // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
    } });
  
  }
  punchlist()
  {
    this.router.navigate(['/project-management/punch_list'],
    { queryParams: { pid:this.pid 
     // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
    } });
  }
  dashboard()
  {
   this.router.navigate(['/dashboard'],
   { queryParams: { pid:this.pid 
   // ,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
  } });
  }
  reportslist()
  {
   this.router.navigate(['/modules-report-form'],
   { queryParams: { pid:this.pid
    //,currentlySelectedProjectName:btoa(this.currentlySelectedProjectName )
   } });
  }
  navigationProjectSelected(project_id, encodedProjectName,extraparam)
  {
  
    this.currentlySelectedProjectId= project_id;
    this.currentlySelectedProjectName=encodedProjectName;
    //this.passcurrentlySelectedProjectName.emit(this.currentlySelectedProjectName);
    if(extraparam == 'active')
    {
      $('#2_selected').hide();
      $('#3_selected').hide();
      $('#0_selected').show();

    }
    else if(extraparam == 'completed')
    {
      $('#0_selected').hide();
      $('#3_selected').hide();
      $('#2_selected').show();
    }
    else if(extraparam == 'other')
    {
      $('#0_selected').hide();
      $('#3_selected').show();
      $('#2_selected').hide();
    }

    this.router.navigate(['/dashboard'],
    { queryParams: { pid:btoa(project_id) 
      //,currentlySelectedProjectName:btoa(encodedProjectName) 
    } }); //redirect to dashboard page after login 
  }
  showsubmenu(param)
  {
    if(param == 'completed')
    {
      this.isShown = ! this.isShown;
    }
    else if(param == 'other')
    {
      this.isShownOther = ! this.isShownOther;
    }
    else if(param == 'active')
    {
      this.isShownActive = ! this.isShownActive;
    }
    else if(param == 'file_manager')
    {
      this.isShownFileManager = ! this.isShownFileManager;
    }else if(param == 'reports')
    {
      this.isShownReports = ! this.isShownReports;
    }
    
    
  }
}
