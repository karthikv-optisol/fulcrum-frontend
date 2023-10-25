import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectBudgetService } from 'src/app/services/project-budget.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { FileUrlList } from '../project-budget.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-upload-purchasefiles-by-company-list',
  templateUrl: './upload-purchasefiles-by-company-list.component.html',
  styleUrls: ['./upload-purchasefiles-by-company-list.component.scss'],
})
export class UploadPurchasefilesByCompanyListComponent implements OnInit {
  @Input() fileUrlList: FileUrlList;

  constructor(
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private ProjectBudgetService: ProjectBudgetService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {}

  deletePurchaseFile(
    fileId,
    subcontractor_bid_document_id,
    subcontractor_bid_document_type_id
  ) {
    this.loader.show();

    let data = {
      file_id: fileId,
      SubdocId: subcontractor_bid_document_id,
    };

    this.loader.show();
    this.ProjectBudgetService.deletesubcontractorbidsPurchaseFile(
      data,
      subcontractor_bid_document_type_id
    ).subscribe(
      (data: any) => {
        if (!data.status) {
          this.toaster.showFailToaster('Unable to delete!', '');
        } else {
          this.toaster.showSuccessToaster(data.body.message, '');
        }
        this.loader.hide();
      },
      (err: Error) => {
        this.toaster.showFailToaster('Unable to process', '');
        this.loader.hide();
      }
    );
  }
}
