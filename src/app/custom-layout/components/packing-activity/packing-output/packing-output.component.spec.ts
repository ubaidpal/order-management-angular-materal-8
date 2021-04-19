import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingOutputComponent } from './packing-output.component';

describe('PackingOutputComponent', () => {
  let component: PackingOutputComponent;
  let fixture: ComponentFixture<PackingOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
