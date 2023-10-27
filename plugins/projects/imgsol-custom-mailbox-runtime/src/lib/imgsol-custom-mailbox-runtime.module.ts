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
import { ImgsolCustomMailboxCommonModule } from 'imgsol-custom-mailbox-common';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';

// import { JoditAngularModule } from 'jodit-angular/lib/jodit-angular.module';



@NgModule({
    declarations: [ImgsolCustomMailboxRuntimeComponent,
        MailboxMainPageComponent,
        MailboxActionsComponent, MailMaillistSectionComponent,
        MailboxEmailcontentComponent,
        ExamplesPageComponent],
    imports: [
        FormsModule, ImgsolCustomMailboxCommonModule, CommonModule, NgbModule.forRoot(), HttpClientModule, EditorModule,FormsModule
    ],
    exports: [ImgsolCustomMailboxRuntimeComponent]
})
export class ImgsolCustomMailboxRuntimeModule { }
