
import { variable } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { PluginDesignBase, PluginComponent, PluginType, PluginInstanceService, VariableBindingType } from '@sybrin/plugin-client';
        
import { ImgsolCustomMailboxProperties } from 'imgsol-custom-mailbox-common';
import { first } from 'rxjs/operators';

// Do not remove the @dynamic comment, it's required to build successfully.
//@dynamic       
@Component({
    selector: 'imgsol-custom-mailbox-design',
    templateUrl: './imgsol-custom-mailbox-design.component.html',
    styleUrls: ['./imgsol-custom-mailbox-design.component.scss']
}) 
@PluginComponent({ pluginKey: 'imgsol-custom-mailbox', type: PluginType.Design })
export class ImgsolCustomMailboxDesignComponent extends PluginDesignBase<ImgsolCustomMailboxProperties> {

    constructor(private instanceService: PluginInstanceService) {
        super();
    } 
}
