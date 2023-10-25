import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ShareModule } from '../share/share.module';
import { ActiveProjectsComponent } from './active-projects/active-projects.component';


@NgModule({
  declarations: [DashboardComponent, ActiveProjectsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,ShareModule
  ]
})
export class DashboardModule { }
