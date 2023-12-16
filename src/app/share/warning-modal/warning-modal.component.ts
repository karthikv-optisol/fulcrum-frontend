import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss']
})
export class WarningModalComponent implements OnInit {

  @Output() public formSubmit = new EventEmitter<boolean>();

  @Output() public modalClose = new EventEmitter<boolean>();

  @Input() public modalTitle: string;

  @Input() public modalQuestion: string;

  @Input() public modalLabel: string;

  @Input() public modalContent: string;

  @Input() public modalButton: string;

  @Input() public modalArray1?: any[];

  @Input() public modalArray2?: any[];

  constructor() { }

  ngOnInit(): void {
    console.log("");
  }

}
