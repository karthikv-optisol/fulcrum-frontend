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
}
