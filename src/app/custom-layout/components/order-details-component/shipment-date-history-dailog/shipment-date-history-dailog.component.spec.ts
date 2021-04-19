import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDateHistoryDailogComponent } from './shipment-date-history-dailog.component';

describe('ShipmentDateHistoryDailogComponent', () => {
  let component: ShipmentDateHistoryDailogComponent;
  let fixture: ComponentFixture<ShipmentDateHistoryDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentDateHistoryDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentDateHistoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
