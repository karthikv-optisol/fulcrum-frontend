import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropImportCostCodesComponent } from './drag-and-drop-import-cost-codes.component';

describe('DragAndDropImportCostCodesComponent', () => {
  let component: DragAndDropImportCostCodesComponent;
  let fixture: ComponentFixture<DragAndDropImportCostCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragAndDropImportCostCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropImportCostCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
