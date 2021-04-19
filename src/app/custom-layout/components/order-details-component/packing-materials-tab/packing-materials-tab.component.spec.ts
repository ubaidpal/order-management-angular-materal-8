import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingMaterialsTabComponent } from './packing-materials-tab.component';

describe('PackingMaterialsTabComponent', () => {
  let component: PackingMaterialsTabComponent;
  let fixture: ComponentFixture<PackingMaterialsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingMaterialsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingMaterialsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
