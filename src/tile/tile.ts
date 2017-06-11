import { Vector2 } from '../helpers';
import { Inventory } from '../inventory/inventory';

export class Tile {
    public inventory: Inventory;
    public title: string;
    public movementCost: number;
    public symbol: string;
    public color: string;
    public chunkPosition: Vector2;
    public worldPosition: Vector2;
    public chunkIndex: Vector2;
    public isPlayer: boolean;
    public tileWeight: number;
    public image: string;
    public isSelected: boolean;
    
    constructor(chunkPosition: Vector2, worldPosition: Vector2, tileWeight: number, chunkIndex: Vector2) {
        this.worldPosition = worldPosition;
        this.chunkPosition = chunkPosition;
        this.inventory = new Inventory();
        this.isPlayer = false;
        this.tileWeight = tileWeight;
        this.chunkIndex = chunkIndex;
    }
}