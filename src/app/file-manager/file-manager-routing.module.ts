import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileManagerOptionsComponent } from './file-manager-options/file-manager-options.component';
import { FileManagerComponent } from './file-manager.component';

const routes: Routes = [
  {
    path: '',
    component: FileManagerComponent,
    children: [
      {
        path: '',
        component: FileManagerOptionsComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRoutingModule { }
