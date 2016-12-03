import { inject, Container } from 'aurelia-framework';
import { Inventory } from '../inventory/inventory';
import { Health } from './health';
import { Item } from '../item/item';
import { Monster } from './monster';
import { Vector } from '../helpers';
import { World } from '../world/world';
import { Actor } from './actor';
import { Camera } from '../camera';

export class Player extends Actor {
    public enemy: Monster;
    public world: World;
    public camera: Camera;

    constructor() {
        super();
        this.enemy = null;
        this.camera = Container.instance.get(Camera);
    }

    pickUp(item: Item) {
        this.inventory.addItem(item);

    }

    attack() {

    }

    equip(item: Item) {

    }

    setPlayerPosition(value: Vector) {
        this.camera.move(value);
        this.position = value;
    }

    move(direction: string, distance: number) {

        let destination = new Vector();
        let currentX = this.position.x;
        let currentY = this.position.y;

        switch (direction) {
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
                destination.y = currentY - 1;
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

        if (this.world.getTileByWorldPosition(destination).movementCost > -1) {
            this.setPlayerPosition(destination);
            //48this.camera.setIsPlayer(destination);
        }
    }
}