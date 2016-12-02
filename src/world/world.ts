import { inject } from 'aurelia-framework';
import { Chunk } from './chunk';
import {Tile} from '../tile/tile';

import { Perlin, Random, Vector } from '../helpers';

@inject(Perlin)
export class World {
    public chunks: Chunk[][];
    public worldSize: Vector;
    public chunkSize: Vector;
    public seed: number;
    private perlin: Perlin;
    playerTile: Tile;


    constructor(perlin) {

        this.perlin = perlin;
        this.worldSize = new Vector(2, 2);
        this.chunkSize = new Vector(38, 50);
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();
        this.playerTile = null;

    }

    generateWorld() {
        this.perlin.seed(this.seed);

        for (let y = 0; y < this.worldSize.y; y++) {
            this.chunks[y] = [];
            for (let x = 0; x < this.worldSize.x; x++) {
                this.chunks[y][x] = new Chunk(new Vector(x, y), new Vector(this.chunkSize.x, this.chunkSize.y));
            }
        }
    }

    setIsPlayer(tile:Vector){
        if(this.playerTile) {
            this.playerTile.isPlayer = false;
        }
        this.playerTile = this.getTile(tile);
        this.playerTile.isPlayer = true;
    }

    getTile(position:Vector) {
        let targetChunkX = Math.floor(position.x / this.chunkSize.x)
        let targetChunkY = Math.floor(position.y / this.chunkSize.y);
        let targetTileX = Math.floor(position.x % this.chunkSize.x);
        let targetTileY = Math.floor(position.y % this.chunkSize.y);

        let targetChunk = this.chunks[targetChunkY][targetChunkX];
        let targetTile = targetChunk.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}