import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TrialsuccessComponent } from './trialsuccess.component';
import { TrialsuccessRoutingModule } from './trialsuccess-routing.module';


@NgModule({
  declarations: [TrialsuccessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TrialsuccessRoutingModule
  ]
})
export class TrialsuccessModule { }
