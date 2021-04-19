import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsTabComponent } from './order-details-tab.component';

describe('OrderDetailsTabComponent', () => {
  let component: OrderDetailsTabComponent;
  let fixture: ComponentFixture<OrderDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
