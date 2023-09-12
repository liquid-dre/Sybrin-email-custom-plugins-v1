import { Injector } from '@angular/core';
import {
  DataBindingConfig,
  FieldSelector,
  PluginConfig,
  PluginEvent,
  PluginEventConfig,
  PluginPropertyBase,
  PropertyCategory,
  ScriptingProperty,
  TextInput,
  VariableBindingConfig,
  VariableFieldBindingConfig
} from '@sybrin/plugin-client';
import { JsonObject, JsonProperty } from 'json2typescript';

// Do not remove the @dynamic comment, it's required to build successfully.
// @dynamic

// Both the JsonObject and Plugin Config decorators are required for your plugins to be serialized, saved, and usable in the AppBuilder.
@JsonObject
@PluginConfig({ pluginKey: 'imgsol-custom-mailbox', category: 'Custom Plugins', icon: 'fa-table' })
export class ImgsolCustomMailboxProperties extends PluginPropertyBase {


  readonly pluginKey: string = 'Plugin_Default';

  constructor(init?: Partial<ImgsolCustomMailboxProperties>) {
    super(init);
    if (init) {
      Object.assign(this, init);
    }
  }


  // Any properties required by the plugin can be added in this class.
  // If you want the properties to be displayed in the property grid you can add a decorator
  // above the property to dictate the type of input to be displayed on the property grid.

  // All input decorators take a partial object of properties that further modify the display of the input in the property grid.

  // If a member of your properties class needs to be saved into the database, ensure that the @JsonProperty() is added to the property
  // For more information on the usage of the @JsonProperty decorator see https://www.npmjs.com/package/json2typescript

  @TextInput({
    label: 'First Property',
    valueChanged: (context: ImgsolCustomMailboxProperties, injector: Injector, updateProperties, newValue, oldValue) => {
      console.log('Hit change event', context, newValue, oldValue);
      updateProperties(context);
    },
    subCategory: 'Basic Properties'
  })
  @JsonProperty()
  @ScriptingProperty({ propertyName: 'firstProperty', type: 'string' })
  firstProperty = 'this is initialized';

  @PluginEvent({ label: 'On Click Preview Button Event', subCategory: 'Events', category: PropertyCategory.Events })
  @JsonProperty('previewButton', PluginEventConfig, true)
  previewButton: PluginEventConfig = new PluginEventConfig();

  @PluginEvent({ label: 'On Click Inbox Attachment', subCategory: 'Events', category: PropertyCategory.Events })
  @JsonProperty('inboxPreviewButton', PluginEventConfig, true)
  inboxPreviewButton: PluginEventConfig = new PluginEventConfig();

  @PluginEvent({ label: 'On Send', subCategory: 'Events', category: PropertyCategory.Events })
  @JsonProperty('sendButton', PluginEventConfig, true)
  sendButton: PluginEventConfig = new PluginEventConfig();

  @PluginEvent({ label: 'Open Address Book', subCategory: 'Events', category: PropertyCategory.Events })
  @JsonProperty('addressBook', PluginEventConfig, true)
  addressBook: PluginEventConfig = new PluginEventConfig();

  @DataBindingConfig({
    label: 'Destination Binding',
    subCategory: 'Destination'
  })
  @JsonProperty('dataBindingConfig', VariableBindingConfig, true)
  dataBindingConfig: VariableBindingConfig = new VariableBindingConfig()

  @DataBindingConfig({
    label: 'Address Book Binding',
    subCategory: 'Destination'
  })
  @JsonProperty('addressBookBindingConfig', VariableBindingConfig, true)
  addressBookBindingConfig: VariableBindingConfig = new VariableBindingConfig()

  @FieldSelector({
    label: 'Category',
    subCategory: 'Display Binding',
    bindingProperty: 'destinationBinding'
  })
  @JsonProperty('categoryFieldID', String, true)
  categoryFieldID: string = '';


}

