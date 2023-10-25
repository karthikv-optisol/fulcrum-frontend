import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericPagesRoutingModule } from './generic-pages-routing.module';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotpasswordsuccessComponent } from './forgotpasswordsuccess/forgotpasswordsuccess.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { Login1Component } from './login1/login1.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RegisterComponent } from './register/register.component';
import { SupportComponent } from './support/support.component';
import { TrialsuccessComponent } from './trialsuccess/trialsuccess.component';
import { GenericPagesComponent } from './generic-pages.component';
import { ShareModule } from '../share/share.module';


@NgModule({
  declarations: [
    GenericPagesComponent,
    ForgotpasswordComponent, 
    ForgotpasswordsuccessComponent, 
    HelpComponent, 
    HomeComponent, 
    Login1Component, 
    PrivacyComponent, 
    RegisterComponent, 
    SupportComponent,
    TrialsuccessComponent],
  imports: [
    CommonModule,
    GenericPagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareModule
  ]
})
export class GenericPagesModule { }
