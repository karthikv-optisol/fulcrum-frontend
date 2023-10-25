import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordsuccessComponent } from './forgotpasswordsuccess.component';

describe('ForgotpasswordsuccessComponent', () => {
  let component: ForgotpasswordsuccessComponent;
  let fixture: ComponentFixture<ForgotpasswordsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotpasswordsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpasswordsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
