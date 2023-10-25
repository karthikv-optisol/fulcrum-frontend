import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FileManagerFile } from '../../project-budget.component';
import 'bootstrap';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as  Constant from '../../../../constant/constant';
import { ToasterService } from 'src/app/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/share/confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-budget-file-container',
  templateUrl: './budget-file-container.component.html',
  styleUrls: ['./budget-file-container.component.scss']
})
export class BudgetFileContainerComponent implements OnInit, AfterViewChecked {

  @Input() fileList : FileManagerFile[] = [];
  @Input() tableData : string = '';
  @Input() fileUploadUrl : string;
  @Input() virtual_file_path : string;
  @Input() containerTitle : string;
  @Input() tooltip : string;
  @Input() methodCall : string;
  @Input() gc_budget_line_item_id : number;
  showContainer : boolean = false;

  pid: string;
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;

  defalutListingmsg : any = {
    project_bid : 'No Project Bid Invitations On File',
    budget_line : 'No Cost Code Level Default Bid Invitations On File',
    unsigned : 'No Unsigned Scope Of Work Documents On File'
  }

  defaultListingTopicmsg : any = {
    project_bid : 'All Project Bid Invitations',
    budget_line : 'All Cost Code Level Default Bid Invitations',
    unsigned : 'All Unsigned Scope Of Work Documents'
  }

  constructor(
    private httpClient: HttpClient,
    private toaster: ToasterService,
    private route: ActivatedRoute,
    private confirmationDialogService : ConfirmationDialogService,
    private loader: LoaderService,
    ) { 
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
    console.log(this.fileList);
  }

  ngAfterViewChecked(): void {
    $('[data-toggle = "tooltip"]').tooltip();
  }


  handleUploadFilesResponse(responseData){

    if(responseData.body.status){
      this.fileList = responseData.body.body.FilesAsUrlList;
    }
    // console.log('from container', responseData);
  }

  public openConfirmationDialog(fileId) {
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure want to delete this attachment ?')
    .then((confirmed) => {
      if(confirmed){
        this.deleteProjectBidInvitation(fileId);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  
  deleteProjectBidInvitation(fileId){
    console.log(fileId);
    let data = {
      projectId : this.pid,
      fileId : fileId,
      tableData : this.tableData,
      gc_budget_line_item_id : this.gc_budget_line_item_id
    }

    this.loader.show();
    this.httpClient.post<any>(Constant.BE_URL+'api/project_management/deleteProjectBidInvitation', data, this.httpOptions).subscribe((response) => {
      if(response.status){
        this.fileList = response.body.FilesAsUrlList;
        this.toaster.showSuccessToaster('Deleted Successfully','')
      }else{
        this.toaster.showFailToaster(response.body, '')
      }
      this.loader.hide();
    }, (err :Error) => {
      console.log(err);
      this.toaster.showFailToaster('Unable to Delete!', '');
      this.loader.hide();
    })
  }

  
}
