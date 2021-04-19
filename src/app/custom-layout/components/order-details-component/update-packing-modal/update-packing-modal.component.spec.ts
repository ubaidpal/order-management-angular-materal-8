import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePackingModalComponent } from './update-packing-modal.component';

describe('UpdatePackingModalComponent', () => {
  let component: UpdatePackingModalComponent;
  let fixture: ComponentFixture<UpdatePackingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePackingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePackingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
