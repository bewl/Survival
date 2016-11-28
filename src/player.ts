import {inject} from 'aurelia-framework';
import {Inventory} from './inventory';
import {Health} from './health';
import {Item} from './item/item';

@inject(Inventory)
export class Player {
    public inventory:Inventory = null;
    public health:Health;

    constructor(inventory) {
        this.health = new Health();
        this.inventory = inventory;
    }

    damage(part:string, value:number) {

    }

    pickUp(item:Item) {
        this.inventory.addItem(item);
    }
}