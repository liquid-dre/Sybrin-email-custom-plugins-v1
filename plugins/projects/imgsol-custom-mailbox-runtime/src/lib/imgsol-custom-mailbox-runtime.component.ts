import { ImgsolCustomMailboxProperties, DataModelHelper } from 'imgsol-custom-mailbox-common';
import { Component, HostBinding, OnInit } from '@angular/core';
import {
    BindingService,
    EntityDefinition,
    IDataVariable,
    ObjectState,
    PluginComponent,
    PluginRuntimeBase,
    PluginType,
    VariableBindingConfig,
    VariableService,
    VariableTypes,
    Workitem
} from '@sybrin/plugin-client';
import { distinctUntilChanged, first, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


// Do not remove the @dynamic comment, it's required to build successfully.
//@dynamic
@Component({
    selector: 'imgsol-custom-mailbox-runtime',
    templateUrl: './imgsol-custom-mailbox-runtime.component.html',
    styleUrls: ['./imgsol-custom-mailbox-runtime.component.scss']
})
@PluginComponent({ pluginKey: 'imgsol-custom-mailbox', type: PluginType.Runtime })
export class ImgsolCustomMailboxRuntimeComponent extends PluginRuntimeBase<ImgsolCustomMailboxProperties> implements OnInit {

    @HostBinding('attr.data-style')
    public get style(): string { return this.properties.styleSelector || 'default'; }

    registerDTO: IRegisterDTO = { consent: true };

    addressBookVar$: Observable<{
        variable: IDataVariable;
        workitems: Workitem[]; entityDefinition: EntityDefinition
    }>;

    // emailsToDisplay:Observable<{variable: IDataVariable; workitems: Workitem[]; entityDefinition: EntityDefinition}>;



    constructor(private variableService: VariableService,
        private bindingService: BindingService) {
        super();
    }
    ngOnInit(): void {

        this.addressBookVar$ = this.bindingService.get(this.properties.addressBookBindingConfig);
        this.addressBookVar$.subscribe((v) => {
            console.log("V: ", v);
        })
    }

    async submit() {
        var variableId = this.properties.dataBindingConfig.variableId;

        var vworkItems = await this.variableService.createNewWorkItemsForVariable({
            createCount: 1, variableId: variableId
        });

        /*
       Workitem properties being updated using the DataModel helper to reference the entity fields.
       These values are assigned from the model bound to the capture form.
   */
        const workItem = vworkItems[0];
        workItem.properties['AccountID'] = '2050c98d-32da-4139-9d92-e3c4e6ec032b'
        workItem.properties['FolderID'] = '1'
        workItem.properties['Folder'] = 'Outbox'
        workItem.properties['EmailType'] = '0'
        workItem.properties['To'] = 'tgutsa@imgsol.co.zw'
        workItem.properties['From'] = 'tawandagutsa@outlook.com'
        workItem.properties['ReplyTo'] = 'NULL'
        workItem.properties['CC'] = ''
        //workItem.properties['ReferenceID'] = ''
        //workItem.properties['MessageID'] = ''
        workItem.properties['Subject'] = 'We try again'
        workItem.properties['MessageBody'] = 'Thanos'
        workItem.properties['Importance'] = 'Normal',
            workItem.properties['Sensitivity'] = 'Normal',
            workItem.properties['Importance'] = 'Priority',

            console.log(vworkItems.length)
        console.log("Heloooooo")

        /*
            A list of updates to apply to the variable workitems.
        */

        const updates = [];

        updates.push({
            properties: { ...workItem.properties },
            State: ObjectState.Created,
            ID: workItem.ID
        });

        await this.variableService.updateVariableWorkitems(variableId, updates);


        await this.variableService.saveVariableData(variableId, this.properties.instanceInfo);
        this.reset();
    }

    reset() {
        this.registerDTO = {};
    }


}

interface IRegisterDTO {
    email?: string;
    consent?: boolean;
}
