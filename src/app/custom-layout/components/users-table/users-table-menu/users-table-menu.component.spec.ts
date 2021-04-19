import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableMenuComponent } from './users-table-menu.component';

describe('UsersTableMenuComponent', () => {
  let component: UsersTableMenuComponent;
  let fixture: ComponentFixture<UsersTableMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersTableMenuComponent]
    }) 
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
