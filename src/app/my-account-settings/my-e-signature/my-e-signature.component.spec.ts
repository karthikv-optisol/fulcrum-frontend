import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyESignatureComponent } from './my-e-signature.component';

describe('MyESignatureComponent', () => {
  let component: MyESignatureComponent;
  let fixture: ComponentFixture<MyESignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyESignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyESignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
