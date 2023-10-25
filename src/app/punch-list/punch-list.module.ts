import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PunchListComponent } from './punch-list.component';
import { PunchListRoutingModule } from './punch-list-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SidemenuModule } from '../share/sidemenu/sidemenu.module';
@NgModule({
  declarations: [PunchListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,SidemenuModule,
    FormsModule,
    PunchListRoutingModule,   NgxPaginationModule
    , Ng2SearchPipeModule,MatDialogModule,
  ], providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
 ],
})
export class PunchListModule { }
