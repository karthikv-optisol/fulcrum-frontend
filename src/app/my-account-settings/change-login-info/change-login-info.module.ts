import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeLoginInfoRoutingModule } from './change-login-info-routing.module';
import { ChangeLoginInfoComponent } from './change-login-info.component';
import { SidemenuModule } from '../../share/sidemenu/sidemenu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupByPipe } from './groupby.pipe';


@NgModule({
  declarations: [
    ChangeLoginInfoComponent,
    GroupByPipe
  ],
  imports: [
    CommonModule,
    ChangeLoginInfoRoutingModule,
    SidemenuModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangeLoginInfoModule { }
