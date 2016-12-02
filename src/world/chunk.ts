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

                let tileWeight = this.perlin.simplex2((x + this.worldPosition.x) / 20, (y + this.worldPosition.y) / 20) * 500;

                let tileType = null;

                if (tileWeight < 100) {
                    tileType = TileData.find(tile => tile.title === 'grass');
                }
                if(tileWeight >= 100 && tileWeight < 200) {
                    tileType = TileData.find(tile => tile.title === 'slope');
                }
                if(tileWeight >= 200 && tileWeight < 300) {
                    tileType = TileData.find(tile => tile.title === 'slope2');
                }
                if(tileWeight >= 300 && tileWeight < 400) {
                    tileType = TileData.find(tile => tile.title === 'slope3');
                }
                if(tileWeight >= 400 && tileWeight < 500) {
                    tileType = TileData.find(tile => tile.title === 'ridge');
                }

                let tile = new Tile(new Vector(x, y), new Vector(x + this.worldPosition.x, y + this.worldPosition.y), tileWeight);
                if(!tile.color) 
                    tile.color = tileType.color;
                tile.movementCost = tileType.movementCost;
                tile.title = tileType.title;
                if(!tile.symbol)
                    tile.symbol = String.fromCharCode(tileType.symbol);

                this.tiles[y][x] = tile;
            }


        }
    }
}
