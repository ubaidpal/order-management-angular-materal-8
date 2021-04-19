import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesGridComponent } from './branches-grid.component';

describe('BranchesGridComponent', () => {
  let component: BranchesGridComponent;
  let fixture: ComponentFixture<BranchesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
