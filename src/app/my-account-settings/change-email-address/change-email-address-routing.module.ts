import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeEmailAddressComponent } from './change-email-address.component';

const routes: Routes = [
  { path: '', component: ChangeEmailAddressComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeEmailAddressRoutingModule { }
