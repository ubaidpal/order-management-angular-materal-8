import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductsDailogComponent } from './add-products-dailog.component';

describe('AddProductsDailogComponent', () => {
  let component: AddProductsDailogComponent;
  let fixture: ComponentFixture<AddProductsDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductsDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductsDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
