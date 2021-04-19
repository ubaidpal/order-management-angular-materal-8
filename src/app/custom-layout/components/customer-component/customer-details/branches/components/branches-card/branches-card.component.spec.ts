import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesCardComponent } from './branches-card.component';

describe('BranchesCardComponent', () => {
  let component: BranchesCardComponent;
  let fixture: ComponentFixture<BranchesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
