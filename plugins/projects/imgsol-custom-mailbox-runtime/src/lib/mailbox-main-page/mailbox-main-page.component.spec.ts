import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxMainPageComponent } from './mailbox-main-page.component';

describe('MailboxMainPageComponent', () => {
  let component: MailboxMainPageComponent;
  let fixture: ComponentFixture<MailboxMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
