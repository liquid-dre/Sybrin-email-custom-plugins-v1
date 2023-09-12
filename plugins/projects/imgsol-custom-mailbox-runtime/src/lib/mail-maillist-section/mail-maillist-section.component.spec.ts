import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailMaillistSectionComponent } from './mail-maillist-section.component';

describe('MailMaillistSectionComponent', () => {
  let component: MailMaillistSectionComponent;
  let fixture: ComponentFixture<MailMaillistSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailMaillistSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailMaillistSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
