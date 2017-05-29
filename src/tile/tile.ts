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
    public isPlayer: boolean;
    public tileWeight: number;

    constructor(chunkPosition: Vector2, worldPosition: Vector2, tileWeight: number) {
        this.worldPosition = worldPosition;
        this.chunkPosition = chunkPosition;
        this.inventory = new Inventory();
        this.isPlayer = false;
        this.tileWeight = tileWeight;
        
        this.generateData()
    }

    generateData() {
        // let data = tileData.find(tile => tile.weight.find(weight => weight.min <= this.tileWeight && weight.max >= this.tileWeight) != null );

        // if(data) {
        //     this.color = data.color;
        //     this.symbol = String.fromCharCode(data.symbol);
        // }
    }
}