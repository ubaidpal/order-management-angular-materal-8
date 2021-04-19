import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpdatePackingComponent } from './order-update-packing.component';

describe('OrderUpdatePackingComponent', () => {
  let component: OrderUpdatePackingComponent;
  let fixture: ComponentFixture<OrderUpdatePackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderUpdatePackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpdatePackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
