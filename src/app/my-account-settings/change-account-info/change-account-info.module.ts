import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeAccountInfoRoutingModule } from './change-account-info-routing.module';
import { ChangeAccountInfoComponent } from './change-account-info.component';
import { SidemenuModule } from '../../share/sidemenu/sidemenu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChangeAccountInfoComponent
  ],
  imports: [
    CommonModule,
    ChangeAccountInfoRoutingModule,
    SidemenuModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangeAccountInfoModule { }
