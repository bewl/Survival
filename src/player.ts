import {inject} from 'aurelia-framework';
import {Inventory} from './inventory';
import {Health} from './health';
import {Item} from './item/item';
import {Monster} from './monster';

export class Player {
    public inventory:Inventory = null;
    public health:Health;
    public enemy:Monster;

    constructor() {
        this.health = new Health();
        this.inventory = new Inventory();
        this.enemy = null;
    }

    pickUp(item:Item) {
        this.inventory.addItem(item);
        
    }

    attack() {

    }
}