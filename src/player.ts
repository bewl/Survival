import {inject} from 'aurelia-framework';
import {Inventory} from './inventory';


@inject(Inventory)
export class Player {
    public inventory:Inventory = null;

    constructor(inventory) {
        this.inventory = inventory;
    }

    AddItem(item) {
        this.inventory.AddItem(item);
    } 
}