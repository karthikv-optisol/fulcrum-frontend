import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLoginInfoComponent } from './change-login-info.component';

describe('ChangeLoginInfoComponent', () => {
  let component: ChangeLoginInfoComponent;
  let fixture: ComponentFixture<ChangeLoginInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeLoginInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLoginInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
