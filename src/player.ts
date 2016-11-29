import {inject} from 'aurelia-framework';
import {Inventory} from './inventory';
import {Health} from './health';
import {Item} from './item/item';

export class Player {
    public inventory:Inventory = null;
    public health:Health;

    constructor() {
        this.health = new Health();
        this.inventory = new Inventory();
    }

    pickUp(item:Item) {
        this.inventory.addItem(item);
    }

    attack() {

    }
}