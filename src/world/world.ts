import { inject, Container } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Tile } from '../tile/tile';

import { Perlin, Random, Vector } from '../helpers';

export class World {
    public chunks: Chunk[][];
    public worldSize: Vector;
    public chunkSize: Vector;
    public seed: number;
    private perlin: Perlin;
    playerTile: Tile;


    constructor() {

        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.worldSize = new Vector(2, 1);
        this.chunkSize = new Vector(50, 38); //TODO: put this in a setting so other modules can access it
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();
        this.playerTile = null;

        this.generateSeed();
    }

    generateSeed() {
        this.perlin.seed(this.seed);

        // for (let y = 0; y < this.worldSize.y; y++) {
        //     this.chunks[y] = [];
        //     for (let x = 0; x < this.worldSize.x; x++) {
        //         this.chunks[y][x] = new Chunk(new Vector(x, y), new Vector(this.chunkSize.x, this.chunkSize.y));
        //     }
        // }
    }

    getChunkPositionFromTilePosition(position: Vector): Vector {
        let chunk = new Vector();

        chunk.x = Math.floor(position.x / this.chunkSize.x);
        chunk.y = Math.floor(position.y / this.chunkSize.y);

        return chunk;
    }
    getChunk(position: Vector): Chunk {
        let chunk: Chunk = null;

        if (this.chunks[position.y] && this.chunks[position.y][position.x]) {
            chunk = this.chunks[position.y][position.x];
        } else {

            chunk = new Chunk(new Vector(this.chunkSize.x, this.chunkSize.y), new Vector(position.x, position.y));
            chunk.seedChunk();

            if (!this.chunks[position.y])
                this.chunks[position.y] = [];

            this.chunks[position.y][position.x] = chunk;
        }

        return chunk;
    }

    getChunks(start: Vector, end: Vector): Chunk[][] {
        let numChunksX = end.x - start.x;
        let numChunksY = start.y - end.y;

        let chunks: Chunk[][] = [];

        for (let y = start.y; y <= end.y; y++) {
            chunks[y] = [];
            for (let x = start.x; x <= end.x; x++) {
                if (this.chunks[y] && this.chunks[y][x]) {
                    chunks[y][x] = this.chunks[y][x];
                } else {

                    chunks[y][x] = new Chunk(new Vector(this.chunkSize.x, this.chunkSize.y), new Vector(x, y));
                    chunks[y][x].seedChunk();

                    if (!this.chunks[y])
                        this.chunks[y] = [];

                    this.chunks[y][x] = chunks[y][x];
                }
            }
        }

        return chunks
    }

    

    getTileByWorldPosition(position: Vector) {
        let targetChunkX = Math.floor(position.x / this.chunkSize.x)
        let targetChunkY = Math.floor(position.y / this.chunkSize.y);
        let targetTileX = Math.floor(position.x % this.chunkSize.x);
        let targetTileY = Math.floor(position.y % this.chunkSize.y);

        let targetChunk = null;
        let targetTile = null;

        if (this.chunks[targetChunkY]) {
            if (this.chunks[targetChunkY][targetChunkX]) {
                targetChunk = this.chunks[targetChunkY][targetChunkX];
            }
        }

        if (targetChunk === null) {
            targetChunk = this.getChunk(new Vector(targetChunkX, targetChunkY));
        }

        targetTile = targetChunk.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}