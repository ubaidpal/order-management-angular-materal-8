import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderGridComponent } from './customer-order-grid.component';

describe('CustomerOrderGridComponent', () => {
  let component: CustomerOrderGridComponent;
  let fixture: ComponentFixture<CustomerOrderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerOrderGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
