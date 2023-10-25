import { Directive, OnChanges, OnInit,  ElementRef, HostListener, Input, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appDatePicker]'
})
export class DatePickerDirective {

  @Input('formName') formName : FormGroup
  @Input('controlName') controlName : string;
  constructor(private e: ElementRef) { }

  @HostListener('ngModelChange', ['$event']) dateChange(value) {
    console.log('blur', this.e);
    const year = value.year;
    const date = value.day;
    const month = value.month;
    let newDate = new Date(year, month -1, date);
    let fdate = moment(newDate).format('YYYY-MM-DD');
    this.formName.get(this.controlName).setValue(fdate)
  }

}