import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccountInfoComponent } from './change-account-info.component';

describe('ChangeAccountInfoComponent', () => {
  let component: ChangeAccountInfoComponent;
  let fixture: ComponentFixture<ChangeAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAccountInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
