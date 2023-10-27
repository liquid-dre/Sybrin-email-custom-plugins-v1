import { NgModule } from '@angular/core';
import { ImgsolCustomMailboxDesignComponent } from './imgsol-custom-mailbox-design.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    declarations: [ImgsolCustomMailboxDesignComponent],
    imports: [ 
        EditorModule
    ],
    exports: [ImgsolCustomMailboxDesignComponent]
})
export class ImgsolCustomMailboxDesignModule { }
