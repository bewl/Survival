import {Container} from 'aurelia-framework';
import {World} from '../world/world';
import {Inventory} from '../inventory/inventory';
import {Health} from './health';
import {Vector} from '../helpers';

export class Actor {
    public world:World;
    public inventory:Inventory = null;
    public health:Health;
    public position:Vector;
    public symbol:string;
    public color:string;

    constructor() {
        this.world = Container.instance.get(World);
        this.inventory = new Inventory();
        this.health = new Health();
    }

    setPosition(value: Vector) {
        this.position = value;
    }

    move(direction: string, distance: number) {
        
        let destination = new Vector();
        let currentX = this.position.x;
        let currentY = this.position.y;

        switch(direction) {
            case 'n':
                destination.x = currentX;
                destination.y = currentY - 1;
                break;
            case 's':
                destination.x = currentX;
                destination.y = currentY + 1;
                break;
            case 'e':
                destination.x = currentX + 1;
                destination.y = currentY;
                break;
            case 'w': 
                destination.x = currentX - 1;
                destination.y = currentY;
                break;
            case 'nw': 
                destination.x = currentX - 1;
                destination.y = currentY -1;
                break; 
            case 'sw': 
                destination.x = currentX - 1;
                destination.y = currentY + 1;
                break;
            case 'se':
                destination.x = currentX + 1;
                destination.y = currentY + 1;
                break;
            case 'ne':
                destination.x = currentX + 1;
                destination.y = currentY - 1;
                break;
            default: break;
        }

        
        this.setPosition(destination);
        this.world.setIsPlayer(destination);        
    }
}