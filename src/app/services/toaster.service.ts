import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  // eslint-disable-next-line prettier/prettier
  constructor(private toastr: ToastrService) { }

  showSuccessToaster(message, title) {
    this.toastr.success(message, title, {
      positionClass: 'toast-top-center',
      enableHtml: false,
      closeButton: false,
    });
  }

  showFailToaster(message, title) {
    this.toastr.error(message, title, {
      positionClass: 'toast-top-center',
      enableHtml: false,
      closeButton: false,
    });
  }

  showInfoToaster(message, title) {
    this.toastr.info(message, title, {
      positionClass: 'toast-top-center',
      enableHtml: false,
      closeButton: false,
    });
  }
}
