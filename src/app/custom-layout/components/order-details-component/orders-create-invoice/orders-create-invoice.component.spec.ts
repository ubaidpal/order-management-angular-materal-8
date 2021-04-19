import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCreateInvoiceComponent } from './orders-create-invoice.component';

describe('OrdersCreateInvoiceComponent', () => {
  let component: OrdersCreateInvoiceComponent;
  let fixture: ComponentFixture<OrdersCreateInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersCreateInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCreateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
