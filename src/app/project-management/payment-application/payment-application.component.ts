import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../constant/constant';
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { PaymentApplicationService } from 'src/app/services/payment-application.service';



@Component({
  selector: 'app-payment-application',
  templateUrl: './payment-application.component.html',
  styleUrls: ['./payment-application.component.scss'],
})
export class PaymentApplicationComponent implements OnInit {



  constructor(private route: ActivatedRoute, private paymentService: PaymentApplicationService, private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService,) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }

  entrieValues: any = [5, 10, 25, 50, 100]
  page: any = 25;
  p = 1;
  currentlySelectedProjectName: string;
  pid: any;
  headings: any[] = ['#Draw', 'Through Date', 'Status', 'PCSV value', "Approved CO's", 'Total Sch.Val', 'Billed To Date', '% Comp', 'Curr. App', 'Curr. Ret	', 'Total Ret', 'Action'];
  status: any = 6;
  drawList: any = [];
  retentionList: any = [];
  totalList: any = 0;

  ngOnInit(): void {

    let userdata = JSON.parse(localStorage.getItem("users"));

    this.currentlySelectedProjectName = userdata['currentlySelectedProjectName'];

    this.getDrawList();

    document.title = 'Draws - '+this.currentlySelectedProjectName
  }

  getDrawList() {
    let data = {
      projectId: this.pid,
      status: this.status
    }

    this.loader.show();

    this.paymentService.getDrawList(data).subscribe((res) => {

      if (res.status == true) {
        if (res.body.draws || res.body.retention) {

          this.retentionList = res.body.retention;
          
          this.drawList = res.body.draws;

          if (res.body.draws && res.body.retention) {
            this.totalList = res.body.draws.length + res.body.retention.length
          }
          else if (res.body.draws) {
            this.totalList = res.body.draws.length
            this.retentionList = [];
          }
          else if (res.body.retention) {
            this.totalList = res.body.retention.length
            this.drawList = [];
          }
          else {
            this.totalList = 0;
            this.retentionList = [];
            this.drawList = [];
          }

        }
        this.loader.hide();
      }

    })
  }

  filterStatus(event: any) {
    this.status = event.target.value;

    this.getDrawList();
  }

  searchRFI(event: any) {

  }

  createDraws() {

    this.loader.show();
    let data = {
      projectId: this.pid,
    }

    this.paymentService.createDraw(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body && res.body.original.status == false) {
          this.toaster.showFailToaster(res.body.original.message, '')
          this.loader.hide();
          return;
        }
        if (res.body && res.body.original.status == true) {
          this.toaster.showSuccessToaster(res.body.original.message, '')
          // window.open('');
          this.getDrawList();
          return;
        }
      }

    })
  }

  createRetentions() {

    this.loader.show();

    let data = {
      projectId: this.pid,
    }

    this.paymentService.createRetention(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body && res.body.original.status == false) {
          this.toaster.showFailToaster(res.body.original.message, '')
          this.loader.hide();
          return;
        }
        if (res.body && res.body.original.status == true) {
          this.toaster.showSuccessToaster(res.body.original.message, '')
          this.getDrawList();
          return;
        }
      }
    })
  }

  deleteDraw(draw) {
    console.log(draw, 'draw');
  }

  editDrawItems(items) {
    window.open('/#/project-management/payment-applications/edit-draws?pid='+this.pid+'&drawId=' + items.id, '_self')
  }

  editRetentionItems(items) {
    window.open('/#/project-management/payment-applications/edit-retention?pid='+this.pid+'&retentionId=' + items.id, '_self')
  }
}
