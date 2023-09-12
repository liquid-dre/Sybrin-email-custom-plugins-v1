import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgsolCustomMailboxDesignComponent } from './imgsol-custom-mailbox-design.component';

describe('ImgsolCustomMailboxDesignComponent', () => {
  let component: ImgsolCustomMailboxDesignComponent;
  let fixture: ComponentFixture<ImgsolCustomMailboxDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgsolCustomMailboxDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgsolCustomMailboxDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
