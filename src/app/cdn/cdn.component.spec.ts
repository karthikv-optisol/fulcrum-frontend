import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdnComponent } from './cdn.component';

describe('CdnComponent', () => {
  let component: CdnComponent;
  let fixture: ComponentFixture<CdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
