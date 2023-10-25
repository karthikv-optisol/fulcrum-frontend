import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidderReportListComponent } from './bidder-report-list.component';
import { BidderReportListRoutingModule } from './bidder-report-list.routing.module';


@NgModule({
  declarations: [
    BidderReportListComponent
  ],
  imports: [
    CommonModule,
    BidderReportListRoutingModule
  ]
})
export class BidderReportListModule { }
