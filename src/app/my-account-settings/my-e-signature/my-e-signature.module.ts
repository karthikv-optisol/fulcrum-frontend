import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyESignatureRoutingModule } from './my-e-signature-routing.module';
import { MyESignatureComponent } from './my-e-signature.component';
import { SidemenuModule } from '../../share/sidemenu/sidemenu.module';

@NgModule({
  declarations: [
    MyESignatureComponent,
  ],
  imports: [
    CommonModule,
    MyESignatureRoutingModule,
    SidemenuModule
  ]
})
export class MyESignatureModule { }
