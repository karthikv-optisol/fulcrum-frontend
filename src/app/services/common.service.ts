import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public selectedMenuName = new BehaviorSubject({
    isSelected: false,
    title: ''
  });

  constructor() { }

  validateEmail(email: string): boolean {
    let isValid = true;
    const atIndex = email.lastIndexOf("@");
    if (typeof atIndex === "boolean" && !atIndex) {
      isValid = false;
    } else {
      const domain = email.substr(atIndex + 1);
      const local = email.substr(0, atIndex);
      const localLen = local.length;
      const domainLen = domain.length;
      if (localLen < 1 || localLen > 64) {
        // local part length exceeded
        isValid = false;
      } else if (domainLen < 1 || domainLen > 255) {
        // domain part length exceeded
        isValid = false;
      } else if (local[0] === "." || local[localLen - 1] === ".") {
        // local part starts or ends with '.'
        isValid = false;
      } else if (/\.\./.test(local)) {
        // local part has two consecutive dots
        isValid = false;
      } else if (!/^[A-Za-z0-9\-\.]+$/.test(domain)) {
        // character not valid in domain part
        isValid = false;
      } else if (/\.\./.test(domain)) {
        // domain part has two consecutive dots
        isValid = false;
      } else if (!/^(\.|[A-Za-z0-9!#%&`_=\/$'*+?^{}|~.-])+$/.test(local.replace(/\\/g, ""))) {
        // character not valid in local part unless
        // local part is quoted
        if (!/^"(\\"|[^"])+?"$/.test(local.replace(/\\/g, ""))) {
          isValid = false;
        }
      }
      if (isValid && !(this.checkDnsRecord(domain, "MX") || this.checkDnsRecord(domain, "A"))) {
        // domain not found in DNS
        isValid = false;
      }
    }
  
    return isValid;
  }
  
  checkDnsRecord(domain: string, recordType: string): boolean {
    // Implement your own logic to check DNS records in Angular
    // This is just a placeholder implementation
    return true;
  }
}
