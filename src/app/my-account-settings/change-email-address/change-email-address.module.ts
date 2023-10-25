import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeEmailAddressRoutingModule } from './change-email-address-routing.module';
import { ChangeEmailAddressComponent } from './change-email-address.component';
import { SidemenuModule } from './../../share/sidemenu/sidemenu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChangeEmailAddressComponent
  ],
  imports: [
    CommonModule,
    SidemenuModule,
    ChangeEmailAddressRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangeEmailAddressModule { }
