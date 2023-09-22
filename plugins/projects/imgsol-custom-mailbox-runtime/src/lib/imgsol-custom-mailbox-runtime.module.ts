import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImgsolCustomMailboxRuntimeComponent } from './imgsol-custom-mailbox-runtime.component';
import { MailboxMainPageComponent } from './mailbox-main-page/mailbox-main-page.component';
import { MailboxActionsComponent } from './mailbox-actions/mailbox-actions.component';
import { MailMaillistSectionComponent } from './mail-maillist-section/mail-maillist-section.component';
import { MailboxEmailcontentComponent } from './mailbox-emailcontent/mailbox-emailcontent.component';
import { CommonModule } from '@angular/common';
import { ExamplesPageComponent } from './custom-components/examples-page/examples-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule } from 'angular-froala-wysiwyg/editor/editor.module.js';
import { FroalaViewModule } from 'angular-froala-wysiwyg/view/view.module.js';
import { ImgsolCustomMailboxCommonModule } from 'imgsol-custom-mailbox-common';

// import { JoditAngularModule } from 'jodit-angular/lib/jodit-angular.module';



@NgModule({
    declarations: [ImgsolCustomMailboxRuntimeComponent,
        MailboxMainPageComponent,
        MailboxActionsComponent, MailMaillistSectionComponent,
        MailboxEmailcontentComponent,
        ExamplesPageComponent],
    imports: [
        FormsModule, ImgsolCustomMailboxCommonModule, CommonModule, NgbModule, FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
    ],
    exports: [ImgsolCustomMailboxRuntimeComponent]
})
export class ImgsolCustomMailboxRuntimeModule { }
