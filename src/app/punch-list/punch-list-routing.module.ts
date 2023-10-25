import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PunchListComponent } from './punch-list.component';

const routes: Routes = [
  { path: '', component: PunchListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PunchListRoutingModule { }
