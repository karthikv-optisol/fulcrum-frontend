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
  actionType: any = '';
  drawId: any;
  report_option: any = [];
  invoice_date: any;
  through_date: any;
  status: any;
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

  exportPrintDraw() {

    this.loader.show();
    let data = {
      projectId: this.pid,
      actionOptionsId: this.actionType,
      actionId: this.actionId,
      drawId: this.retentionId,
      report_option: this.report_option
    }

    this.paymentService.exportPrintRetention(data).subscribe((res) => {

      if (res.status == true) {
        if (res.body.original.status == true) {
          if (res.body.original.data) {
            window.open(res.body.original.data, '_blank');
          }
        }
        this.loader.hide();
      }
    })


  }

  onDateSelect(event, name) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    console.log(name, finalDate);
    this[name] = finalDate;
  }


  dateChange(date: any) {
    return date.year + "-" + date.month + "-" + date.day;
  }

  updateRetention(status) {
    let data: any = {
      projectId: this.pid,
      retId: this.retentionId
    }

    if (this.invoice_date) {
      data.invoice_date = this.invoice_date;
    }

    if (this.through_date) {
      data.through_date = this.through_date;
    }

    if (status) {
      data.status = status;
    }

    this.loader.show();
    this.paymentService.updateRetention(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status) {
          this.getDrawsInfo();
          this.toaster.showSuccessToaster(res.body.original.message, '')
        }
      }
      else {
        this.toaster.showFailToaster(res.body.original.message, '')
      }

      this.loader.hide();
    })

  }

}
