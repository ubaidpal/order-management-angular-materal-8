import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCreateShipmentDailogComponent } from './orders-create-shipment-dailog.component';

describe('OrdersCreateShipmentDailogComponent', () => {
  let component: OrdersCreateShipmentDailogComponent;
  let fixture: ComponentFixture<OrdersCreateShipmentDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersCreateShipmentDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCreateShipmentDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
