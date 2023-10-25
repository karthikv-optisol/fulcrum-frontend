import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {
  NgbDate,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { FileManagerFile } from '../project-budget.component';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-gcb-subcontractor-management',
  templateUrl: './gcb-subcontractor-management.component.html',
  styleUrls: ['./gcb-subcontractor-management.component.scss']
})
export class GcbSubcontractorManagement implements OnInit {

  @Output() dismissModal = new EventEmitter<any>();
  @Input() dialogTitle : string;
  @Input() costCode : string;
  @Input() costCodeDescription : string;
  @Input() gc_budget_line_item_id : number;
  @Input() gcBudgetfilesList : FileManagerFile[];
  @Input() gcBudgetUnsignedScopefilesList : FileManagerFile[];
  @Input() projectInvitationfilesList : FileManagerFile[];
  
  
  pid: string;
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;

  constructor(
    // public modalService: NgbModal
    private route: ActivatedRoute,
    
  ) { 

    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(
          params['currentlySelectedProjectName']
        );
      }
    });

  }



  ngOnInit(): void {

  }


}
