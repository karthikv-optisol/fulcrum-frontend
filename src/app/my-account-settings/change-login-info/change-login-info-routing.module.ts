import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeLoginInfoComponent } from './change-login-info.component';

const routes: Routes = [{ path: '', component: ChangeLoginInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeLoginInfoRoutingModule { }
