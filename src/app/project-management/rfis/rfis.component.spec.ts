import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFIsComponent } from './rfis.component';

describe('RFIsComponent', () => {
  let component: RFIsComponent;
  let fixture: ComponentFixture<RFIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RFIsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RFIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
