import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerOptionsComponent } from './file-manager-options.component';

describe('FileManagerOptionsComponent', () => {
  let component: FileManagerOptionsComponent;
  let fixture: ComponentFixture<FileManagerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
