import { inject, Container } from 'aurelia-framework';
import { Inventory } from '../inventory/inventory';
import { Health } from './health';
import { Item } from '../item/item';
import { Monster } from './monster';
import { Vector2, Bounds } from '../helpers';
import { World } from '../world/world';
import { Actor } from './actor';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PlayerMovedEvent } from '../events/player-moved-event';

export class Player extends Actor {
    public enemy: Monster;
    public world: World;
    public collisionEnabled: boolean = false;
    public eventAggregator: EventAggregator;
    public inspectRadius: number = 1;

    constructor() {
        super();
        this.enemy = null;
        this.eventAggregator = Container.instance.get(EventAggregator);
    }

    pickUp(item: Item) {
        this.inventory.addItem(item);

    }

    attack() {

    }

    use() {
        //let chunkPos = this.world.getChunkPositionFromWorldPosition(this.position) //this.glowColor = ""
        let chunk = this.world.getChunk(this.world.getChunkPositionFromWorldPosition(this.position))
        let inspectBounds = new Bounds(this.position.add(-(this.inspectRadius)), this.position.add(this.inspectRadius))
        let size = this.inspectRadius * 2 + 1;
        let availTiles = this.world.getViewport(new Vector2(size, size), this.position); 
        for (let y = 0; y < this.inspectRadius * 2 + 1; y++ ) {
            for(let x = 0; x < this.inspectRadius * 2 + 1; x++) {
                availTiles[y][x].isSelected = true;
            }
        }
        this.eventAggregator.publish('Update')
    }

    checkVicinity() {
        
    }

    equip(item: Item) {

    }
    toggleCollision() {
        this.collisionEnabled = !this.collisionEnabled;
    }
    
    setPlayerPosition(value: Vector2) {
        //this.camera.translate(value);
        this.position = value;
        this.eventAggregator.publish('PlayerMoved', new PlayerMovedEvent(value))
    }

    move(direction: string, distance: number) {

        let destination = new Vector2();
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

        if (!this.collisionEnabled || this.world.getTileByWorldPosition(destination).movementCost > -1) {
            this.setPlayerPosition(destination);
        }
    }
}