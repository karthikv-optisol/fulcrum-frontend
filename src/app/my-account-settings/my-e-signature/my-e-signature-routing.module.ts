import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyESignatureComponent } from './my-e-signature.component';

const routes: Routes = [{ path: '', component: MyESignatureComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyESignatureRoutingModule { }
