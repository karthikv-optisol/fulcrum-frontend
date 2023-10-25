import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectBudgetService } from 'src/app/services/project-budget.service';
import { HttpClient , HttpEvent, HttpEventType, HttpHeaders} from '@angular/common/http';
import { Subject } from 'rxjs';

interface FileUrlList {
  cdnFileUrl : string,
  virtual_file_name : string,
  displayedFilename : string,
  file_id : number,
  subcontractor_bid_document_type_id : number,
  subcontractor_bid_document_type : string,
  subcontractor_bid_document_id : number,
  subcontractor_bid_id : number
}


@Component({
  selector: 'app-drag-and-drop-or-click',
  templateUrl: './drag-and-drop-or-click.component.html',
  styleUrls: ['./drag-and-drop-or-click.component.scss']
})

export class DragAndDropOrClickComponent implements OnInit {

  subcontractorBidsAsUrlListChanged = new Subject<FileUrlList[]>()

  dragOver : boolean = false;
  pid: string;
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: any;
  fileUploadProgress : number | null = null;
  fileUploadProgressStatus : string; 
  uploading : boolean = false;
  @Input() subcontractor_bid_id: number;
  @Input() subcontractor_bid_document_virtual_file_path: string
  @Input() dialogbox: string
  subcontractorBidsAsUrlList : FileUrlList[] = []
  signedScopesOfWorkAsUrlList : FileUrlList[] = []
  bidderSpecificUnsignedScopesOfWorkAsUrlList : FileUrlList[] = []
  bidderSpecificBidInvitationsAsUrlList : FileUrlList[] = []
  submittalsAsUrlList : FileUrlList[] = []
  
  constructor(
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private ProjectBudgetService: ProjectBudgetService,
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
  }


  onDrop(event: any) {
    event.preventDefault();
    this.handleFiles(event.dataTransfer.files);
    this.dragOver = false;
  }

  onDragOver(event: any, ) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    this.dragOver = false;
  }

  onFileSelected(files: FileList) {
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    // Perform operations with the selected files.
   
    // max of 20 files can be uploaded at once.
    if (files.length > 20){
      return this.toaster.showFailToaster("You can upload a maximum of 20 files at once.", '');
    }

    let totalSizeOfUplodedFiles = 0;
    for (let i = 0; i < files.length; i++) {

      if (!this.isValidPDF(files[i])) {
        return this.toaster.showFailToaster("Please upload files in PDF format only.", '');
      }

      totalSizeOfUplodedFiles += +files[i].size;
    }

    if((totalSizeOfUplodedFiles / 1024) > (100 * 1024) ){
      return this.toaster.showFailToaster("The maximum file size for uploads is 100 MB at a time", '');
    }

    let formData = new FormData();
    for (let i = 0; i < files.length; i++){
      if (this.isValidPDF(files[i])) {
        formData.append("files[" + [i] + "]", files[i]);
      }
    }

    formData.append('projectId', this.pid);
    formData.append('virtual_file_path', this.subcontractor_bid_document_virtual_file_path);   

    const documentTypeMap: { [key: string]: number } = {
      'uploadPurchasingFiles_subcontractorBid': 1,
      'uploadPurchasingFiles_signedScopeOfWork': 2,
      'uploadPurchasingFiles_unsignedScopeOfWork': 3,
      'uploadPurchasingFiles_bidInvitation': 4,
      'uploadPurchasingFiles_submittal': 5
    };
    
    if (documentTypeMap.hasOwnProperty(this.dialogbox)) {
      const subcontractor_bid_document_type_id = documentTypeMap[this.dialogbox];
      formData.append('subcontractor_bid_document_type_id', subcontractor_bid_document_type_id.toString());
      formData.append('subcontractor_bid_id', this.subcontractor_bid_id.toString());
      this.purchaseFileUpload(formData);
      return;
    }
    
    // this.uploadEmailAttachements(formData, button, dialogbox)
  }

  purchaseFileUpload(formData: FormData) {
    this.uploading = true;
    this.ProjectBudgetService.purchaseFilesUpload(formData).subscribe(
      (data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          const progress = Math.round((data.loaded / data.total) * 100);
          this.updateFileUploadProgress(progress);
        }else if(data.type === HttpEventType.ResponseHeader){
          this.uploading = false;
          this.fileUploadProgress = null;
        } 
        // else if (data.type === HttpEventType.Response) {
        //   this.handleResponse(data);
        // }
      },
      (err: Error) => {
        this.handleUploadError();
      }
    );
  }
  
  private updateFileUploadProgress(progress: number) {
    this.fileUploadProgress = progress;
    this.fileUploadProgressStatus = progress === 100 ? 'Uploading...' : `${progress} % Uploaded...`;
  }
  
  private handleResponse(data: any) {
    if (data?.body?.status) {
      let content = data?.body?.body
      const typeId = +content.subcontractor_bid_document_type_id;
      switch (typeId) {
        case 1:
          this.subcontractorBidsAsUrlList = content.FilesAsUrlList;
          this.subcontractorBidsAsUrlListChanged.next(content.FilesAsUrlList)
          break;
        case 2:
          this.signedScopesOfWorkAsUrlList = content.FilesAsUrlList;
          break;
        case 3:
          this.bidderSpecificUnsignedScopesOfWorkAsUrlList = content.FilesAsUrlList;
          break;
        case 4:
          this.bidderSpecificBidInvitationsAsUrlList = content.FilesAsUrlList;
          break;
        case 5:
          this.submittalsAsUrlList = content.FilesAsUrlList;
          break;
        default:
          break;
      }
    }
  }
  
  private handleUploadError() {
    this.fileUploadProgress = null;
    this.uploading=false;
    this.toaster.showFailToaster("Unable to process!", '');
  }

  isValidPDF(file: File): boolean {
    return file.type === 'application/pdf';
  }
}
