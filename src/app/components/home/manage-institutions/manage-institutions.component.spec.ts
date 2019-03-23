import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInstitutionsComponent } from './manage-institutions.component';

describe('ManageInstitutionsComponent', () => {
  let component: ManageInstitutionsComponent;
  let fixture: ComponentFixture<ManageInstitutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageInstitutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
