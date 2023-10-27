import { NgModule } from '@angular/core';
import { AddressBookComponent } from './address-book/address-book.component';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({ declarations: [AddressBookComponent], imports: [CommonModule,  
    EditorModule ], exports: [AddressBookComponent] })
export class ImgsolCustomMailboxCommonModule {

}