import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgsolCustomMailboxRuntimeComponent } from './imgsol-custom-mailbox-runtime.component';

describe('ImgsolCustomMailboxRuntimeComponent', () => {
  let component: ImgsolCustomMailboxRuntimeComponent;
  let fixture: ComponentFixture<ImgsolCustomMailboxRuntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgsolCustomMailboxRuntimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgsolCustomMailboxRuntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
