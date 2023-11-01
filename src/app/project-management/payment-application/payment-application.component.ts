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
  styleUrls: ['./payment-application.component.scss']
})
export class PaymentApplicationComponent implements OnInit {

 

  constructor(private route: ActivatedRoute,private paymentService: PaymentApplicationService,private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService,) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
   }

   currentlySelectedProjectName: string;
   pid:any;
   headings:any[] = ['#Draw', 'Through Date', 'Status', 'PCSV value', "Approved CO's", 'Total Sch.Val', 'Billed To Date', '% Comp', 'Curr. App', 'Curr. Ret	', 'Total Ret', 'Action'];

   drawList:any;
   retentionList:any;
  

  ngOnInit(): void {

    let userdata = JSON.parse(localStorage.getItem("users"));

    this.currentlySelectedProjectName = userdata['currentlySelectedProjectName'];

    this.getDrawList();
  }

  getDrawList()
  {
      let data = {
        projectId:this.pid,
      }

      this.paymentService.getDrawList(data).subscribe((res)=>{

        if(res.status == true)
        {
            if(res.body.draws || res.body.retention)
            {
                this.drawList = res.body.draws;
                this.retentionList = res.body.retention
            }
        }

      })
  }

}
