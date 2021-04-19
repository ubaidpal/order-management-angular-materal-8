import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutoWithArrayComponent } from './input-auto-with-array.component';

describe('InputAutoWithArrayComponent', () => {
  let component: InputAutoWithArrayComponent;
  let fixture: ComponentFixture<InputAutoWithArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputAutoWithArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAutoWithArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
