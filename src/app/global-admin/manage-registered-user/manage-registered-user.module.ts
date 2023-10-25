import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRegisteredUserRoutingModule } from './manage-registered-user-routing.module';
import { ManageRegisteredUserComponent } from './manage-registered-user.component';
import { SidemenuModule } from '../../share/sidemenu/sidemenu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageRegisteredUserComponent
  ],
  imports: [
    CommonModule,
    ManageRegisteredUserRoutingModule,
    SidemenuModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageRegisteredUserModule { }
