import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HelpRoutingModule
  ]
})
export class HelpModule { }
