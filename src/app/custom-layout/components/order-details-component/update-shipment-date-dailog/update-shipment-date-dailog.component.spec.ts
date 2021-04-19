import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShipmentDateDailogComponent } from './update-shipment-date-dailog.component';

describe('UpdateShipmentDateDailogComponent', () => {
  let component: UpdateShipmentDateDailogComponent;
  let fixture: ComponentFixture<UpdateShipmentDateDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateShipmentDateDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShipmentDateDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
