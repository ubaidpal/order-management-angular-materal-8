import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchFormElementsComponent } from './branch-form-elements.component';

describe('FormElementsComponent', () => {
  let component: BranchFormElementsComponent;
  let fixture: ComponentFixture<BranchFormElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchFormElementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchFormElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
