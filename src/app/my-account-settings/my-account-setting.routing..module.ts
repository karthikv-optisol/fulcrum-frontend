import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountSettingsComponent } from './my-account-settings.component';
import { ChangeAccountInfoComponent } from './change-account-info/change-account-info.component';
import { ChangeEmailAddressComponent } from './change-email-address/change-email-address.component';
import { ChangeLoginInfoComponent } from './change-login-info/change-login-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyESignatureComponent } from './my-e-signature/my-e-signature.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountSettingsComponent,
    children: [
      {
        path: 'change_account_info',
        component: ChangeAccountInfoComponent,
      },
      {
        path: 'change_email_address',
        component: ChangeEmailAddressComponent,
      },
      {
        path: 'change_login_info',
        component: ChangeLoginInfoComponent,
      },
      {
        path: 'change_password',
        component: ChangePasswordComponent,
      },
      {
        path: 'my_e_signature',
        component: MyESignatureComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountSettingsRoutingModule { }
