import {Container} from 'aurelia-framework';
import {World} from './world/world';
import {Inventory} from './inventory/inventory';
import {Health} from './health';
import {Vector} from './helpers';

export class Actor {
    public world:World;
    public inventory:Inventory = null;
    public health:Health;
    public position:Vector;
    public symbol:string;
    public color:string;

    constructor() {
        this.world = Container.instance.get(World);
    }
}