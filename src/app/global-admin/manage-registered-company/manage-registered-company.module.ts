import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRegisteredCompanyRoutingModule } from './manage-registered-company-routing.module';
import { ManageRegisteredCompanyComponent } from './manage-registered-company.component';
import { SidemenuModule } from '../../share/sidemenu/sidemenu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageRegisteredCompanyComponent
  ],
  imports: [
    CommonModule,
    ManageRegisteredCompanyRoutingModule,
    SidemenuModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageRegisteredCompanyModule { }
