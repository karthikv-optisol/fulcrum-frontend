import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractTrackingComponent } from './subcontract-tracking.component';

describe('SubcontractTrackingComponent', () => {
  let component: SubcontractTrackingComponent;
  let fixture: ComponentFixture<SubcontractTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcontractTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcontractTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
