import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRegisteredUserComponent } from './manage-registered-user.component';


const routes: Routes = [
  { path: '', component: ManageRegisteredUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRegisteredUserRoutingModule { }
