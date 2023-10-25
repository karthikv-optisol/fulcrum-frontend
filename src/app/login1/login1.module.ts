import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Login1Component } from './login1.component';
import { Login1RoutingModule } from './login1-routing.module';


@NgModule({
  declarations: [Login1Component],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Login1RoutingModule
  ]
})
export class Login1Module { }
