import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotpasswordComponent } from './forgotpassword.component';
import { ForgotpasswordRoutingModule } from './forgotpassword-routing.module';


@NgModule({
  declarations: [ForgotpasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ForgotpasswordRoutingModule
  ]
})
export class ForgotpasswordModule { }
