import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrderDropdownComponent } from './product-order-dropdown.component';

describe('ProductOrderDropdownComponent', () => {
  let component: ProductOrderDropdownComponent;
  let fixture: ComponentFixture<ProductOrderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOrderDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOrderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
