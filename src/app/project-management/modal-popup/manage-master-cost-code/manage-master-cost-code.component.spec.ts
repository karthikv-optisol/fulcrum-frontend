import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMasterCostCodeComponent } from './manage-master-cost-code.component';

describe('ManageMasterCostCodeComponent', () => {
  let component: ManageMasterCostCodeComponent;
  let fixture: ComponentFixture<ManageMasterCostCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMasterCostCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMasterCostCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
