import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPurchasefilesByCompanyListComponent } from './upload-purchasefiles-by-company-list.component';

describe('UploadPurchasefilesByCompanyListComponent', () => {
  let component: UploadPurchasefilesByCompanyListComponent;
  let fixture: ComponentFixture<UploadPurchasefilesByCompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPurchasefilesByCompanyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPurchasefilesByCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
