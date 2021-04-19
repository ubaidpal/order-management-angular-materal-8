import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDataTableComponent } from './users-data-table.component';

describe('UsersTableComponent', () => {
  let component: UsersDataTableComponent;
  let fixture: ComponentFixture<UsersDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersDataTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
