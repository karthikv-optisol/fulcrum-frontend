import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../constant/constant';


@Component({
    selector: 'app-file-attachment',
    templateUrl: './file-attachment.component.html',
    styleUrls: ['./file-attachment.component.scss']
  })

  export class FileAttachmentComponent implements OnInit {

    @Input() public file_array:any = [];

    @Input() public efile_array:any = [];

    @Output() public formSubmit = new EventEmitter<boolean>(); 



    ngOnInit(): void {
        console.log("tested file attachment");
    }
  }