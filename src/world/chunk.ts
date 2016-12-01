import {Container} from 'aurelia-framework';
import { Tile } from '../tile/tile';
import { Random, Perlin, Vector } from '../helpers';
import tiles from '../tile/data/tiles';
const TileData = tiles;

export class Chunk {
    public tiles: Tile[][];
    public seed: number;
    public chunkPosition: Vector;
    public worldPosition: Vector;
    public chunkSize: Vector;

    private perlin: Perlin;
    constructor(position:Vector, chunkSize:Vector) {
        this.chunkSize = chunkSize;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.tiles = [];
        this.chunkPosition = position;
        this.worldPosition = new Vector((position.x * this.chunkSize.x) + position.x, (position.y * this.chunkSize.y) + position.y);

        this.seedChunk();
    }

    seedChunk() {
        for (let y = 0; y < this.chunkSize.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.chunkSize.x; x++) {

                let value = this.perlin.simplex2((x + this.worldPosition.x) / 25, (y + this.worldPosition.y) / 25) * 500;

                let tileType = null;

                if (value < 100) {
                    tileType = TileData.find(tile => tile.title === 'grass');
                }
                if(value >= 100 && value < 200) {
                    tileType = TileData.find(tile => tile.title === 'slope');
                }
                if(value >= 200 && value < 300) {
                    tileType = TileData.find(tile => tile.title === 'slope2');
                }
                if(value >= 300 && value < 400) {
                    tileType = TileData.find(tile => tile.title === 'slope3');
                }
                if(value >= 400 && value < 500) {
                    tileType = TileData.find(tile => tile.title === 'ridge');
                }

                let tile = new Tile(new Vector(x, y), new Vector(x + this.worldPosition.x, y + this.worldPosition.y));

                tile.color = tileType.color;
                tile.movementCost = tileType.movementCost;
                tile.title = tileType.title;
                tile.symbol = String.fromCharCode(tileType.symbol);
                
                this.tiles[y][x] = tile;
            }


        }
    }
}
