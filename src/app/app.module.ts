//import * as $ from "jquery";
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorInterceptor } from './auth/auth-interceptor.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { AuthGuard } from './services/auth.guard';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { jsPDF } from 'jspdf';
import { ShareModule } from './share/share.module';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { DatePickerDirective } from './services/date-picker.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CdnComponent } from './cdn/cdn.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    DatePickerDirective,
    CdnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRippleModule,
    ShareModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      extendedTimeOut: 2000,
      positionClass: 'toast-top-center',
      enableHtml: false,
      closeButton: false,
      tapToDismiss: true,
    })
  ],
  providers: [{
    provide: MatDialogRef,
    useValue: {}
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true
  }, { provide: LocationStrategy, useClass: HashLocationStrategy }, AuthGuard, Title,],
  bootstrap: [AppComponent]
})
export class AppModule { }
