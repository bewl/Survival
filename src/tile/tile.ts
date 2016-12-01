import {Vector} from '../helpers';
import {Inventory} from '../inventory/inventory';

export class Tile {
    public position: Vector;
    public inventory: Inventory;
    public title:string;
    public movementCost:number;
    public symbol:string;
    public color:string;
    
    constructor() {
        this.inventory = new Inventory();
    }   
}