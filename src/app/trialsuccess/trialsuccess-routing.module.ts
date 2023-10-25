import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrialsuccessComponent } from './trialsuccess.component';

const routes: Routes = [
  { path: '', component: TrialsuccessComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrialsuccessRoutingModule { }
