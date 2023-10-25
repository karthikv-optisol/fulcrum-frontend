import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRegisteredCompanyComponent } from './manage-registered-company.component';

const routes: Routes = [
  { path: '', component: ManageRegisteredCompanyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRegisteredCompanyRoutingModule { }
