import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [

    {
      path: '',
      children: [
        {
          path: '',
          loadChildren: () => import('./generic-pages/generic-pages.module').then((m) => m.GenericPagesModule),
        },
      ],
    },

    {
      path: 'dashboard',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
          canActivate: [AuthGuard]
        },
      ],
    },

    {
      path: 'modules-file-manager-file-browser',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./file-manager/file-manager.module').then((m) => m.FileManagerModule),
          canActivate: [AuthGuard]
        },
      ],
    },

    {
      path: 'modules-report-form',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
          canActivate: [AuthGuard]
        },
      ],
    },


    {
      path: 'my_account_setting',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./my-account-settings/my-account-settings.module').then((m) => m.MyAccountSettingsModule),
          canActivate: [AuthGuard]
        },
      ],
    },

    {
      path: 'global_admin',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./global-admin/global-admin.module').then((m) => m.GlobalAdminModule),
          canActivate: [AuthGuard]
        },
      ],
    },

    {
      path: 'project-management',
      component: PageLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./project-management/project-management.module').then((m) => m.ProjectManagementModule),
          canActivate: [AuthGuard]
        },
      ],
    },    
  
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
