import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidderReportListComponent } from './bidder-report-list.component';
const routes: Routes = [
  { path: '', component: BidderReportListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidderReportListRoutingModule { }
