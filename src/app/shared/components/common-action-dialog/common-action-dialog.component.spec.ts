import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonActionDialogComponent } from './common-action-dialog.component';

describe('CommonActionDialogComponent', () => {
  let component: CommonActionDialogComponent;
  let fixture: ComponentFixture<CommonActionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonActionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
