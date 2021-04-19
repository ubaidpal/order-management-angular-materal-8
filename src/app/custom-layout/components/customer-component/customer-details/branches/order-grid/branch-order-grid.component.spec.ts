import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOrderGridComponent } from './branch-order-grid.component';

describe('CustomerOrderGridComponent', () => {
  let component: BranchOrderGridComponent;
  let fixture: ComponentFixture<BranchOrderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchOrderGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchOrderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
