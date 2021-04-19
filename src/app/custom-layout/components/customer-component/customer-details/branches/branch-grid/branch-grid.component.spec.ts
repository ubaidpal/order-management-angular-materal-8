import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchGridComponent } from './branch-grid.component';

describe('CustomerGridComponent', () => {
  let component: BranchGridComponent;
  let fixture: ComponentFixture<BranchGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
