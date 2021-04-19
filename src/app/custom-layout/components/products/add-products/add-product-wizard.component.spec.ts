import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductWizardComponent } from './add-product-wizard.component';

describe('AddProductWizardComponent', () => {
  let component: AddProductWizardComponent;
  let fixture: ComponentFixture<AddProductWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
