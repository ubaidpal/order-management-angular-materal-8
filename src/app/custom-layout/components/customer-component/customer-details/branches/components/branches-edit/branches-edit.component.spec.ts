import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesEditComponent } from './branches-edit.component';

describe('BranchesEditComponent', () => {
  let component: BranchesEditComponent;
  let fixture: ComponentFixture<BranchesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
