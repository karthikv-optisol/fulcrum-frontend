import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { SubmittalService } from 'src/app/services/submittal.service';

@Component({
  selector: 'app-submittals',
  templateUrl: './submittals.component.html',
  styleUrls: ['./submittals.component.scss']
})
export class SubmittalsComponent implements OnInit {

  submittalListData: any;

  p = 1;

  constructor(public modalService: NgbModal, private submittalsService: SubmittalService) { }

  ngOnInit(): void {
  this.submittalsList();
  }

  loadNewSubmittalDialog(MasterCodeList) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);
  }

  submittalsList(){
    var _jsonURL = '../../../assets/JSON/submittalsList.json'
    this.submittalsService.submittalsList(_jsonURL).subscribe(data => {
      this.submittalListData = data.body.submittalsListData;
    })
  }

  dateFormat(value) {
    return moment(value).format('L');
  }

}
