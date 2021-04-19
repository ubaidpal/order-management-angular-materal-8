import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrderGearComponent } from './gear-order.component';

describe('ProductOrderGearComponent', () => {
  let component: ProductOrderGearComponent;
  let fixture: ComponentFixture<ProductOrderGearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOrderGearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOrderGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
