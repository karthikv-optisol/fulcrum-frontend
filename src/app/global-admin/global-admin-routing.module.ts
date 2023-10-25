import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalAdminComponent } from './global-admin.component';
import { ManageRegisteredCompanyComponent } from './manage-registered-company/manage-registered-company.component';
import { ManageRegisteredUserComponent } from './manage-registered-user/manage-registered-user.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalAdminComponent,
    children: [
      {
        path: 'manage_registered_company',
        component: ManageRegisteredCompanyComponent,
      },
      {
        path: 'manage_registered_user',
        component: ManageRegisteredUserComponent,
      },  
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalAdminRoutingModule { }
