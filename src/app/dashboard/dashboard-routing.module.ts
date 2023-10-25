import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ActiveProjectsComponent } from './active-projects/active-projects.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        // path: 'active_projects',
        path: '',
        component: ActiveProjectsComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
