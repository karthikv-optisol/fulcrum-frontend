import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotpasswordsuccessComponent } from './forgotpasswordsuccess.component';
import { ForgotpasswordsuccessRoutingModule } from './forgotpasswordsuccess-routing.module';


@NgModule({
  declarations: [ForgotpasswordsuccessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ForgotpasswordsuccessRoutingModule
  ]
})
export class ForgotpasswordsuccessModule { }
