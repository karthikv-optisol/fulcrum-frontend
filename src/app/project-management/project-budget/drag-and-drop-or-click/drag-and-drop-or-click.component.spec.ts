import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropOrClickComponent } from './drag-and-drop-or-click.component';

describe('DragAndDropOrClickComponent', () => {
  let component: DragAndDropOrClickComponent;
  let fixture: ComponentFixture<DragAndDropOrClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragAndDropOrClickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropOrClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
