import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrivacyComponent } from './privacy.component';
import { PrivacyRoutingModule } from './privacy-routing.module';


@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrivacyRoutingModule
  ]
})
export class PrivacyModule { }
