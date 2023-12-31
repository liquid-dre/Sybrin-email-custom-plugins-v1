import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntityDefinition, IDataVariable, Workitem } from '@sybrin/plugin-client';


@Component({
  selector: 'imgsol-custom-mailbox-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  @Input() addressBook: {
    variable: IDataVariable;
    workitems: Workitem[]; entityDefinition: EntityDefinition
  };

  @Output() itemClickEmitter: EventEmitter<string> = new EventEmitter();

  public address = [];

  constructor() { }

  ngOnInit() {
  }

  onselect(email?: string) {
    this.itemClickEmitter.emit(email);
  }


}



