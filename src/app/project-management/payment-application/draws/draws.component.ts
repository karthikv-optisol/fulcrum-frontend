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
  selector: 'app-draws',
  templateUrl: './draws.component.html',
  styleUrls: ['./draws.component.scss']
})
export class DrawsComponent implements OnInit {

  pid: any;
  currentlySelectedProjectName: any;
  drawId: any;
  drawItems: any;
  actionId: any = "";
  actions: any;
  actionOptions: any;
  actionType: any = '';
  totalScheduleValue: any = 0;
  totalPreviousApp: any = 0;
  totalCompletePer: any = 0;
  totalCurrentApp: any = 0;
  totalCurrentRet: any = 0;
  totalCompletedApp: any = 0;
  totalRetention: any = 0;
  showRealloc: boolean = false;
  report_option:any = [];
  draws: any;
  constructor(private route: ActivatedRoute, private paymentService: PaymentApplicationService, private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService,) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      this.drawId = params['drawId'];
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
      drawId: this.drawId
    }

    this.loader.show();

    this.paymentService.getDrawsInfo(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status == true) {
          this.drawItems = res.body.original.data;
          let total: any = 0;
          let total_previous: any = 0;
          let total_complete: any = 0;
          let total_current_app: any = 0;
          let total_current_ret: any = 0;
          let total_completed_app: any = 0;
          let total_retention: any = 0;

          this.draws = res.body.original.draws;

          this.actions = res.body.original.actions;

          res.body.original.data.map(element => {
            //total schedule value
            total = parseFloat(total) + parseFloat(element.scheduled_value);
            this.totalScheduleValue = total;

            //total previous 
            total_previous = parseFloat(total_previous) + parseFloat(element.previousDraw.pcurrent_app);
            this.totalPreviousApp = total_previous;

            //total complete percentage
            if (element.completed_percent) {
              total_complete = parseFloat(total_complete) + parseFloat(element.completed_percent);
              this.totalCompletePer = total_complete;
              console.log("totalCompletePer", this.totalCompletePer)
            }


            //total current app
            if (element.current_app) {
              total_current_app = parseFloat(total_current_app) + parseFloat(element.current_app);
              this.totalCurrentApp = total_current_app;
              console.log("total_current_app", this.totalCurrentApp)
            }

            //total current retainer
            if (element.current_retainer_value) {
              total_current_ret = parseFloat(total_current_ret) + parseFloat(element.current_retainer_value);

              this.totalCurrentRet = total_current_ret;
              console.log("totalCurrentRet", this.totalCurrentRet)
            }

            //total prev and current app

            if (element.current_app && element.previousDraw.pcurrent_app) {
              total_completed_app = parseFloat(total_completed_app) + this.addingValues(element.previousDraw.pcurrent_app, element.current_app)
              this.totalCompletedApp = total_completed_app;
            }

            if (element.current_app && !element.previousDraw.pcurrent_app) {
              total_completed_app = parseFloat(total_completed_app) + parseFloat(element.current_app);
              this.totalCompletedApp = total_completed_app;
            }

            if (!element.current_app && element.previousDraw.pcurrent_app) {
              total_completed_app = parseFloat(total_completed_app) + parseFloat(element.previousDraw.pcurrent_app);
              this.totalCompletedApp = total_completed_app;
            }

            if (element.previousDraw.pcurrent_retainer_value && element.current_retainer_value) {
              total_retention = parseFloat(total_retention) + (this.addingValues(element.previousDraw.pcurrent_retainer_value, element.current_retainer_value))
              this.totalRetention = total_retention;
              console.log("totalRetention1", this.totalRetention)
            }


            if (!element.previousDraw.pcurrent_retainer_value && element.current_retainer_value) {
              total_retention = parseFloat(total_retention);
              this.totalRetention = total_retention;
              console.log("totalRetention2", this.totalRetention)
            }

            if (element.previousDraw.pcurrent_retainer_value && !element.current_retainer_value) {
              total_retention = element.previousDraw.pcurrent_retainer_value;
              this.totalRetention = total_retention;
              console.log("totalRetention3", this.totalRetention)
            }


            this.loader.hide();

          });

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


    this.actionType = '';

    this.paymentService.getDrawActionType(data).subscribe((res) => {

      if (res.status == true) {
        if (res.body.original.status == true) {
          this.actionOptions = res.body.original.data
        }
      }
    })
  }

  changeAllocations() {
    this.showRealloc = !this.showRealloc;
  }

  exportPrintDraw() {

    this.loader.show();
    let data = {
      projectId: this.pid,
      actionOptionsId: this.actionType,
      actionId: this.actionId,
      drawId: this.drawId,
      report_option:this.report_option
    }

    this.paymentService.exportPrintDraw(data).subscribe((res) => {

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
}
