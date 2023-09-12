import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxActionsComponent } from './mailbox-actions.component';

describe('MailboxActionsComponent', () => {
  let component: MailboxActionsComponent;
  let fixture: ComponentFixture<MailboxActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
