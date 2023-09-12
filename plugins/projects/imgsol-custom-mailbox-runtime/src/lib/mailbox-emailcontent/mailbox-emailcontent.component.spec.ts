import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxEmailcontentComponent } from './mailbox-emailcontent.component';

describe('MailboxEmailcontentComponent', () => {
  let component: MailboxEmailcontentComponent;
  let fixture: ComponentFixture<MailboxEmailcontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxEmailcontentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxEmailcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
