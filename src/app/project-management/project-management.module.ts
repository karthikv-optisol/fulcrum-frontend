import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../share/share.module';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { PunchListComponent } from './punch-list/punch-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgbDateCustomParserFormatter } from './dateformat';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BidderReportListComponent } from './bidder-report-list/bidder-report-list.component';
import { ManageMasterCostCodeComponent } from './modal-popup/manage-master-cost-code/manage-master-cost-code.component';
import { SubmittalsComponent } from './submittals/submittals.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { RFIsComponent } from './rfis/rfis.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FilterMeetingEmailContactsList } from './filter-meetingEmailContactsList.pipe';
import { SubcontractTrackingComponent } from './subcontract-tracking/subcontract-tracking.component';
import { OwnerChangeOrderComponent } from './owner-change-order/owner-change-order.component';

const materialModules = [
  CdkTreeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  MatBadgeModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    FilterMeetingEmailContactsList,
    ProjectManagementComponent,
    ProjectBudgetComponent,
    PunchListComponent,
    BidderReportListComponent,
    ManageMasterCostCodeComponent,
    SubmittalsComponent,
    MeetingsComponent,
    RFIsComponent,
    SubcontractTrackingComponent,
    OwnerChangeOrderComponent
  ],
  imports:
    [
      CommonModule,
      ProjectManagementRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      ShareModule,
      NgbModule, NgxMatSelectSearchModule,
      NgxPaginationModule,
      Ng2SearchPipeModule,
      MatInputModule,
      MatAutocompleteModule,
      ...materialModules,
      MatDialogModule,
      AccordionModule.forRoot(),    
    ],
  exports: [MatDatepickerModule,
    ...materialModules
  ],
  providers: [MatDatepickerModule,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    {
      provide: MatDialogRef,
      useValue: {}
    }],
})
export class ProjectManagementModule { }
