import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as  Constant from '../../../constant/constant';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-drag-and-drop-files',
  templateUrl: './drag-and-drop-files.component.html',
  styleUrls: ['./drag-and-drop-files.component.scss']
})
export class DrangAndDropFilesComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private toaster: ToasterService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
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

  uploading : boolean = false;
  dragOver : boolean = false;
  pid: string;
  currentlySelectedProjectName: any;
  currentlySelectedProjectId: any;
  fileUploadProgress : number | null = null;
  fileUploadProgressStatus : string; 

  @Input('multiple') isMultiple: boolean;
  @Input() allowed_extensions: string[] = [];
  @Input() max_files_allowed_at_once: number;
  @Input() min_files_allowed_at_once: number;
  @Input() maxFileSize: number;
  @Input() maxSize_uploaded_at_once: number;
  @Input() virtual_file_path: string;
  @Input() fileUploadUrl : string;
  @Input() methodCall : string;
  @Input() gc_budget_line_item_id : number;
  @Input() append_date_to_filename : number = 0;

  @Output() uploadedFilesInfo = new EventEmitter<any>();
  


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
    if(files.length === 0 ) return
    this.handleFiles(files);
  }

  uploadedFiles : FileList;
  handleFiles(files: FileList) {
  
    let isValid = this.validate(files);

    if(!isValid){
      return;
    }
  
    console.log({
      isValid,
      files
    })
    this.uploadedFiles = files

    
    let formData = new FormData();
    for (let i = 0; i < files.length; i++){
      formData.append("files[" + [i] + "]", files[i]);
    }

    formData.append('projectId', this.pid);
    formData.append('virtual_file_path', this.virtual_file_path);
    formData.append('append_date_to_filename', this.append_date_to_filename.toString());
    
    if(this.methodCall){
      formData.append('methodCall', this.methodCall);   
    }
    
    if(this.gc_budget_line_item_id){
      formData.append('gc_budget_line_item_id', this.gc_budget_line_item_id.toString());
    }

    this.fileUpload(formData)
    // if(this.uploadFromParentComponent){
    //   this.uploadedFilesInfo.emit({
    //     isValid,
    //     files
    //   })
    // }

    // this.toaster.showSuccessToaster('Uploaded Successfully', '');
  }

  // resetFilesInput : any = '';
 
  fileUpload(uploadData) : any {
    this.loader.show();
    this.uploading = true;
    this.httpClient.post(Constant.BE_URL+this.fileUploadUrl, uploadData, {
      reportProgress: true, 
      observe: 'events'
    }).subscribe(
      (data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          const progress = Math.round((data.loaded / data.total) * 100);
          this.updateFileUploadProgress(progress);
        }else if(data.type === HttpEventType.ResponseHeader){
          this.uploading = false;
          this.fileUploadProgress = null;
        } 
        else if (data.type === HttpEventType.Response) {
          // this.handleResponse(data);
          this.toaster.showSuccessToaster('Uploaded Sucessfully', '');
          this.uploadedFilesInfo.emit(data)
          // console.log(data);
          this.fileInput.nativeElement.value = ''
          // this.resetFilesInput = '';
          this.loader.hide();
        }
      },
      (err: Error) => {
        console.log(err)
        this.toaster.showFailToaster('Unable to upload!', '')
        this.loader.hide();
      }
    );;
  }

  private updateFileUploadProgress(progress: number) {
    this.fileUploadProgress = progress;
    this.fileUploadProgressStatus = progress === 100 ? 'Uploading...' : `${progress} % Uploaded...`;
  }

  validate(files: FileList) : boolean{

    //Max Files Allowed to uploade at once
    if(files.length > this.max_files_allowed_at_once){
      this.toaster.showFailToaster(`You can upload maximum of ${+this.max_files_allowed_at_once} file(s) at once.`, '')
      return false
    }

    if(!this.validateExtension(files)){
      this.toaster.showFailToaster(`Allowed file type(s) : ${this.allowed_extensions.join(', ')}`, '')
      return false
    }

    if(!this.validateFileSize(files)){
      let maxFileSize = this.maxFileSize ? +this.maxFileSize : 20;
      this.toaster.showFailToaster(`Max file size allowed : ${maxFileSize} MB`, '')
      return false;
    }

    if(!this.validateTotalUploadSize(files)){
      let maxTotalSizeAllowed = this.maxSize_uploaded_at_once ? +this.maxSize_uploaded_at_once : 100
      this.toaster.showFailToaster(`Max Total size allowed to upload at once : ${maxTotalSizeAllowed} MB`, '')
      return false;
    }

    return true;
  }

  validateExtension(files : FileList): boolean{
    for (const file of files) {
      let fileName = file.name;
      let ext = '.'+fileName.split('.').pop();
      
      if(!this.allowed_extensions.includes(ext)){
        return false;
      }
    }
    return true
  }

  validateFileSize(files : FileList): boolean{
    let maxFileSize = this.maxFileSize ? +this.maxFileSize : 20;
    for(const file of files){
      if((+file.size/1024) > (maxFileSize*1024)){
        return false
      }
    }
    return true;
  }

  validateTotalUploadSize(files: FileList): boolean{
    let totalSizeOfUplodedFiles = 0;
    for(const file of files){
      totalSizeOfUplodedFiles += +file.size;
    }

    let maxTotalSizeAllowed = this.maxSize_uploaded_at_once ? +this.maxSize_uploaded_at_once : 100
    if((totalSizeOfUplodedFiles/1024 )> (maxTotalSizeAllowed * 1024)){
      return false
    }

    return true;
  }
}
