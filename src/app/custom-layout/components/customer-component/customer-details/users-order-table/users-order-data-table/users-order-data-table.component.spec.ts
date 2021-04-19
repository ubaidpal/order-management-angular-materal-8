import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOrderDataTableComponent } from './users-order-data-table.component';

describe('UsersTableComponent', () => {
  let component: UsersOrderDataTableComponent;
  let fixture: ComponentFixture<UsersOrderDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersOrderDataTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersOrderDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
