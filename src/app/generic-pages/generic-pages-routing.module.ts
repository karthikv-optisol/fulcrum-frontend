import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ForgotpasswordsuccessComponent } from './forgotpasswordsuccess/forgotpasswordsuccess.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { Login1Component } from './login1/login1.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RegisterComponent } from './register/register.component';
import { SupportComponent } from './support/support.component';
import { TrialsuccessComponent } from './trialsuccess/trialsuccess.component';
import { GenericPagesComponent } from './generic-pages.component';

const routes: Routes = [
  {
    path: '',
    component: GenericPagesComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'mobile',
        component: SupportComponent,
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
      },
      {
        path: 'login-form',
        component: Login1Component,
      },
      {
        path: 'trailsucess',
        component: TrialsuccessComponent,
      },
      {
        path: 'password-retrieval-form',
        component: ForgotpasswordComponent,
      },
      {
        path: 'password-retrieval-success',
        component: ForgotpasswordsuccessComponent,
      },
      {
        path: 'trialsignup',
        component: RegisterComponent,
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericPagesRoutingModule { }
