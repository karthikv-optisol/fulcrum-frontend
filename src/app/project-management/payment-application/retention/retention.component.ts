import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../../constant/constant'
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { PaymentApplicationService } from 'src/app/services/payment-application.service';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.scss']
})
export class RetentionComponent implements OnInit {

  pid: any;
  currentlySelectedProjectName: any;
  retentionId: any;
  retentionItems:any;
  constructor(private route: ActivatedRoute, private paymentService: PaymentApplicationService, private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService,) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      this.retentionId = params['retentionId'];
    });
  }

  ngOnInit(): void {

    let userdata = JSON.parse(localStorage.getItem("users"));

    this.currentlySelectedProjectName = userdata['currentlySelectedProjectName'];

    this.getDrawsInfo();
  }

  getDrawsInfo() {
    let data = {
      projectId: this.pid,
      retentionId: this.retentionId
    }

    this.paymentService.getRetDrawsInfo(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status == true) {
          this.retentionItems = res.body.original.data;
        }
      }
    })
  }

  scheduledValue(a, b) {
    return parseFloat(a) + parseFloat(b);
  }

  completionPer(a, b) {
    return a * b;
  }

  addingValues(a,b)
  {
    return parseFloat(a) + parseFloat(b);
  }

}
