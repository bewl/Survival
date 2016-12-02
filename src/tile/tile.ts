import { Vector } from '../helpers';
import { Inventory } from '../inventory/inventory';

export class Tile {
    public inventory: Inventory;
    public title: string;
    public movementCost: number;
    public symbol: string;
    public color: string;
    public chunkPosition: Vector;
    public worldPosition: Vector;
    public isPlayer: boolean;
    public tileWieght: number;

    constructor(chunkPosition: Vector, worldPosition: Vector) {
        this.worldPosition = worldPosition;
        this.chunkPosition = chunkPosition;
        this.inventory = new Inventory();
        this.isPlayer = false;
    }
}