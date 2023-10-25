import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidderReportListComponent } from './bidder-report-list/bidder-report-list.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectManagementComponent } from './project-management.component';
import { PunchListComponent } from './punch-list/punch-list.component';
import { RFIsComponent } from './rfis/rfis.component';
import { SubmittalsComponent } from './submittals/submittals.component';
import * as path from 'path';
import { SubcontractTrackingComponent } from './subcontract-tracking/subcontract-tracking.component';
import { OwnerChangeOrderComponent } from './owner-change-order/owner-change-order.component';

const routes: Routes = [
  {
    path: 'punch_list',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: PunchListComponent,
      },
    ],
  },
  {
    path: 'modules-gc-budget-form',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: ProjectBudgetComponent,
      },
    ],
  },
  {
    path: 'modules-purchasing-bidder-list-report',
    children: [
      {
        path: '',
        component: BidderReportListComponent,
      },
    ],
  },
  {
    path: 'submittals',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: SubmittalsComponent,
      },
    ],
  },
  {
    path: 'Meetings',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: MeetingsComponent,
      },
    ],
  },
  {
    path: 'RFIs',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: RFIsComponent,
      },
    ],
  },
  {
    path: 'contract-tracking',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        component: SubcontractTrackingComponent
      }
    ]
  },
  {
    path: 'owner-change-order',
    component: ProjectManagementComponent,
    children:[
      {
        path: '',
        component: OwnerChangeOrderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
