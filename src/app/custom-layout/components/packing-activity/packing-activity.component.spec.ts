import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingActivityComponent } from './packing-activity.component';

describe('PackingActivityComponent', () => {
  let component: PackingActivityComponent;
  let fixture: ComponentFixture<PackingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
