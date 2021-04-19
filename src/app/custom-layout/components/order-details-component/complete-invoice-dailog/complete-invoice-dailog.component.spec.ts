import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteInvoiceDailogComponent } from './complete-invoice-dailog.component';

describe('CompleteInvoiceDailogComponent', () => {
  let component: CompleteInvoiceDailogComponent;
  let fixture: ComponentFixture<CompleteInvoiceDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteInvoiceDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteInvoiceDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
