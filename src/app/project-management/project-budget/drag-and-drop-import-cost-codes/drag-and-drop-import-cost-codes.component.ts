import { HttpResponse } from '@angular/common/http';
import { Component, Input, EventEmitter, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-drag-and-drop-import-cost-codes',
  templateUrl: './drag-and-drop-import-cost-codes.component.html',
  styleUrls: ['./drag-and-drop-import-cost-codes.component.scss']
})
export class DragAndDropImportCostCodesComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) { }

  @Output() uploadComplete = new EventEmitter<any>();
  @Output() uploadedFilesInfo = new EventEmitter<{
    isValid : boolean,
    files : FileList
  }>();

  uploading : boolean = false;
  dragOver : boolean = false;
  @Input('multiple') isMultiple: boolean;
  @Input() allowed_extensions: string[] = [];
  @Input() max_files_allowed_at_once: number;
  @Input() min_files_allowed_at_once: number;
  @Input() maxFileSize: number
  @Input() maxSize_uploaded_at_once: number
  @Input() uploadFromParentComponent: boolean
  @Input() initialValue: any
  @Input() isAlreadyUplodedFilesInfo : {
    isValid : boolean,
    files : FileList
  }

  ngOnInit(): void {
    if(this.isAlreadyUplodedFilesInfo){
      this.uploadedFiles = this.isAlreadyUplodedFilesInfo.files
    }
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
  
    this.uploadedFiles = files
    if(this.uploadFromParentComponent){
      this.uploadedFilesInfo.emit({
        isValid,
        files
      })
    }

    // this.toaster.showSuccessToaster('Uploaded Successfully', '');
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


  removeFilesFromtheList(index : number){
    const filesArray = Array.from(this.uploadedFiles);
    filesArray.splice(index, 1);

    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));

    this.uploadedFiles = dataTransfer.files;
    this.fileInput.nativeElement.value = '';

    if(this.uploadFromParentComponent){
      this.uploadedFilesInfo.emit({
        isValid: false,
        files : this.uploadedFiles
      })
    }
  }
}
