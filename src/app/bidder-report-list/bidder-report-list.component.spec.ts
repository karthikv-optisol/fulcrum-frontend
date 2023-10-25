import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidderReportListComponent } from './bidder-report-list.component';

describe('BidderReportListComponent', () => {
  let component: BidderReportListComponent;
  let fixture: ComponentFixture<BidderReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidderReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidderReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
