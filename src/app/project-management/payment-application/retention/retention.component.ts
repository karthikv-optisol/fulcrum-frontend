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
  retentions: any;
  retentionItems: any;
  actions: any;
  actionId: any = '';
  actionOptions: any;
  totalSchedule: any = 0;
  totalCurrentRet: any = 0;
  totalPrevRet: any = 0;
  totalAmount: any = 0;

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

    this.loader.show();
    this.paymentService.getRetDrawsInfo(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status == true) {
          this.retentionItems = res.body.original.data;

          this.retentions = res.body.original.retention;

          this.actions = res.body.original.actions;

          let total_schedule: any = 0;
          let total_curr_ret: any = 0;
          let total_prev_ret: any = 0;
          let total_amount: any = 0;

          res.body.original.data.map(element => {

            if (element.scheduled_retention_value) {
              total_schedule = parseFloat(total_schedule) + parseFloat(element.scheduled_retention_value)
              this.totalSchedule = parseFloat(total_schedule)
            }

            
            if (element.current_retainage) {
              total_curr_ret = parseFloat(total_curr_ret) + parseFloat(element.current_retainage)
              this.totalCurrentRet = parseFloat(total_curr_ret)
            }

            
            if (element.previous_retainage) {
              total_prev_ret = parseFloat(total_prev_ret) + parseFloat(element.previous_retainage)
              this.totalPrevRet = parseFloat(total_prev_ret)
            }

            
            if (element.current_retainer_value) {
              total_amount = parseFloat(total_amount) + parseFloat(element.current_retainer_value)
              this.totalAmount = parseFloat(total_amount)
            }


          })
        }
      }
      this.loader.hide();
    })
  }

  scheduledValue(a, b) {
    return parseFloat(a) + parseFloat(b);
  }

  completionPer(a, b) {
    return a * b;
  }

  addingValues(a, b) {
    return parseFloat(a) + parseFloat(b);
  }

  historyBack() {
    window.history.back();
  }

  changeOptions(event: any) {
    let value = event.target.value;

    let data = {
      projectId: this.pid,
      actionId: this.actionId
    }

    this.paymentService.getDrawActionType(data).subscribe((res) => {

      if (res.status == true) {
        if (res.body.original.status == true) {
          this.actionOptions = res.body.original.data
        }
      }
    })
  }

}
