import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountSettingsComponent } from './my-account-settings.component';
import { MyAccountSettingsRoutingModule } from './my-account-setting.routing..module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeAccountInfoComponent } from './change-account-info/change-account-info.component';
import { ShareModule } from '../share/share.module';
import { ChangeEmailAddressComponent } from './change-email-address/change-email-address.component';
import { ChangeLoginInfoComponent } from './change-login-info/change-login-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyESignatureComponent } from './my-e-signature/my-e-signature.component';

@NgModule({
  declarations: [
    MyAccountSettingsComponent,
    ChangeAccountInfoComponent,
    ChangeEmailAddressComponent,
    ChangeLoginInfoComponent,
    ChangePasswordComponent,
    MyESignatureComponent
  ],
  imports: [
    CommonModule,
    MyAccountSettingsRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
  ]
})
export class MyAccountSettingsModule { }
