import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerChangeOrderComponent } from './owner-change-order.component';

describe('OwnerChangeOrderComponent', () => {
  let component: OwnerChangeOrderComponent;
  let fixture: ComponentFixture<OwnerChangeOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerChangeOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerChangeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
