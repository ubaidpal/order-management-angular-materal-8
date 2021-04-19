import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOrderTableMenuComponent } from './users-order-table-menu.component';

describe('UsersTableMenuComponent', () => {
  let component: UsersOrderTableMenuComponent;
  let fixture: ComponentFixture<UsersOrderTableMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersOrderTableMenuComponent]
    }) 
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersOrderTableMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
