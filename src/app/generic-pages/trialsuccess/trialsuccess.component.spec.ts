import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialsuccessComponent } from './trialsuccess.component';

describe('TrialsuccessComponent', () => {
  let component: TrialsuccessComponent;
  let fixture: ComponentFixture<TrialsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
