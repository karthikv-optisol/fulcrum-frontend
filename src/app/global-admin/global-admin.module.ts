import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalAdminRoutingModule } from './global-admin-routing.module';
import { GlobalAdminComponent } from './global-admin.component';
import { ManageRegisteredUserComponent } from './manage-registered-user/manage-registered-user.component';
import { ManageRegisteredCompanyComponent } from './manage-registered-company/manage-registered-company.component';
import { ShareModule } from '../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GlobalAdminComponent,
    ManageRegisteredCompanyComponent,
    ManageRegisteredUserComponent
  ],
  imports: [
    CommonModule,
    GlobalAdminRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GlobalAdminModule { }
