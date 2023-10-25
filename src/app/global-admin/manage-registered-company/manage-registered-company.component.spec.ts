import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegisteredCompanyComponent } from './manage-registered-company.component';

describe('ManageRegisteredCompanyComponent', () => {
  let component: ManageRegisteredCompanyComponent;
  let fixture: ComponentFixture<ManageRegisteredCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRegisteredCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRegisteredCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
