import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordsuccessComponent } from './forgotpasswordsuccess.component';

const routes: Routes = [
  { path: '', component: ForgotpasswordsuccessComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotpasswordsuccessRoutingModule { }
