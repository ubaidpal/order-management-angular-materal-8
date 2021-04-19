import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsTabComponent } from './invoice-details-tab.component';

describe('InvoiceDetailsTabComponent', () => {
  let component: InvoiceDetailsTabComponent;
  let fixture: ComponentFixture<InvoiceDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
