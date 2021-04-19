import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFormElementsComponent } from './company-form-elements.component';

describe('FormElementsComponent', () => {
  let component: CompanyFormElementsComponent;
  let fixture: ComponentFixture<CompanyFormElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyFormElementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFormElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
