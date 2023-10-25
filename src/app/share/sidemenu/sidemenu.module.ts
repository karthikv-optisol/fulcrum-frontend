import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidemenuComponent } from './sidemenu.component';

@NgModule({
  declarations: [SidemenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [SidemenuComponent
  ],
 
})
export class SidemenuModule { }
