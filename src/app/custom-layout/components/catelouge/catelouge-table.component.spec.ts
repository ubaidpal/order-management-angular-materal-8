import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelougeTableComponent } from './catelouge-table.component';

describe('CatelougeTableComponent', () => {
  let component: CatelougeTableComponent;
  let fixture: ComponentFixture<CatelougeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatelougeTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelougeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
