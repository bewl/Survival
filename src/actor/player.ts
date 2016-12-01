import {inject} from 'aurelia-framework';
import {Inventory} from '../inventory/inventory';
import {Health} from './health';
import {Item} from '../item/item';
import {Monster} from './monster';
import {Vector} from '../helpers';
import {World} from '../world/world';
import {Actor} from './actor';

export class Player extends Actor{
    public enemy:Monster;
    public world:World;
    
    constructor() {
        super();
        this.enemy = null;

    }

    pickUp(item:Item) {
        this.inventory.addItem(item);
        
    }

    attack() {

    }
}