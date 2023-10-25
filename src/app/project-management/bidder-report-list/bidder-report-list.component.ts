import { Component, OnInit } from '@angular/core';
import { ProjectBudgetService } from '../../services/project-budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { first } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-bidder-report-list',
  templateUrl: './bidder-report-list.component.html',
  styleUrls: ['./bidder-report-list.component.scss']
})
export class BidderReportListComponent implements OnInit {
  arrBidders : any = [];
  getSubcontractorBidLists : any = [];
  constructor(
    private route: ActivatedRoute,
    private ProjectBudgetService: ProjectBudgetService,
    private router: Router,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.getSubcontractorBidStatus();
  }
  getSubcontractorBidStatus(){
    this.last = "";
    this.loader.show();
    this.ProjectBudgetService.getSubcontractorBidStatus()
    .pipe(first())
    .subscribe(
      (data: any) => {
        this.loader.hide()
        if (data['status']) {
          this.getSubcontractorBidLists = data['body']['getSubcontractorBidStatus'];
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      },
      (err: Error) => {
        this.loader.hide()
        console.log(err);
      }
    );
  }
  updateBidderListReport(){
    this.arrBidders = [];
    this.loader.show()
    this.last = "";
    let ddlStatus = $("#ddlStatus").val();
    let ddlSortBy = $("#ddlSortBy").val();
    var ddlStatusString = ddlStatus.reduce((current, value, index) => {
      if(index > 0)
            current += ',';
        return current + value;
      }, '');

    this.ProjectBudgetService.updateBidderListReport(ddlStatusString,ddlSortBy)
    .pipe(first())
    .subscribe(
      (data: any) => {
        this.loader.hide()
        if (data['status']) {
          this.arrBidders = data['body']['arrBidders'];
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      },
      (err: Error) => {
        this.loader.hide();
        console.log(err);
      }
    );
  }

  checkSortOrder(){
    let ddlSortBy = $("#ddlSortBy").val().split(",");
    let check_data=ddlSortBy[1].toLowerCase();
    if (check_data =='cost_code') {
      return true;
    }else{
      return false;
    }
  }

  last:any = "";
  checkDisplay(old:any){
    let result : boolean;
    let ddlSortBy = $("#ddlSortBy").val();
    if(this.last == ''){
      this.last = old;
      return true;
    }else{
      if(this.last != '' && this.last != old && ddlSortBy !="email"){
        this.last = old;
        return true;
      }else{
        this.last = old;
        return false;
      }
    }

  }
  getBidAmount(value:any,value2:any){
    let result : any = "";
    if(value && value2){
      let values = value * value2;
      result = values;
    }else{
      result = ""
    }
    return result
  }
}
