import { Container } from 'aurelia-framework';
import { World } from '../world/world';
import { Inventory } from '../inventory/inventory';
import { Health } from './health';
import { Vector2 } from '../helpers';

export class Actor {
    public world: World;
    public inventory: Inventory = null;
    public health: Health;
    public position: Vector2;
    public symbol: string;
    public color: string;

    constructor() {
        this.world = Container.instance.get(World);
        this.inventory = new Inventory();
        this.health = new Health();
    }

    

   
}