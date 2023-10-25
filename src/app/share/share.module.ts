import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageloaderComponent } from './pageloader/pageloader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WarningModalComponent } from './warning-modal/warning-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileAttachmentComponent } from '../project-management/file-attachment/file-attachment.component';
@NgModule({
  declarations: [SidemenuComponent, HeaderComponent, FooterComponent, PageloaderComponent, WarningModalComponent,FileAttachmentComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  exports: [SidemenuComponent, FooterComponent, HeaderComponent, PageloaderComponent, NgxPaginationModule, WarningModalComponent,
    NgSelectModule],

})
export class ShareModule { }
