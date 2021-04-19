import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentSummaryTabComponent } from './shipment-summary-tab.component';

describe('ShipmentSummaryTabComponent', () => {
  let component: ShipmentSummaryTabComponent;
  let fixture: ComponentFixture<ShipmentSummaryTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentSummaryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentSummaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
