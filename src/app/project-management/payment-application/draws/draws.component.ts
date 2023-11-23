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
  totalScheduleValue:any;
  totalPreviousApp:any;
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

    this.paymentService.getDrawsInfo(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status == true) {
          this.drawItems = res.body.original.data;
          let total:any = 0;
          let total_previous:any = 0;


          res.body.original.data.map(element => {
            total = parseFloat(total)+parseFloat(element.scheduled_value);
            this.totalScheduleValue = total;
          });

          
          res.body.original.data.map(element => {
            total_previous = parseFloat(total_previous)+parseFloat(element.previousDraw.pcurrent_app);
            this.totalPreviousApp = total_previous;
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

  addingValues(a,b)
  {
    return parseFloat(a) + parseFloat(b);
  }
}
