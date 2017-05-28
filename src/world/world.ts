import { inject, Container } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Tile } from '../tile/tile';

import { Perlin, Random, Vector2 } from '../helpers';

export class World {
    public chunks: Chunk[][];
    public worldSize: Vector2;
    public chunkSize: Vector2;
    public seed: number;
    public viewPortAspectRatio: number;
    public viewportScale: number;
    private perlin: Perlin;
    playerTile: Tile;


    constructor() {
        this.viewportScale = 7;
        this.viewPortAspectRatio = 2.02;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.worldSize = new Vector2(2, 1);
        this.chunkSize = new Vector2(this.viewportScale * (Math.floor(9 * this.viewPortAspectRatio)), Math.floor(this.viewportScale * 9)); //TODO: put this in a setting so other modules can access it
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();
        this.playerTile = null;

        //this.generateSeed();
    }

    generateSeed(seed: number = null) {
        this.perlin.seed(seed == null ? this.seed : seed);

        // for (let y = 0; y < this.worldSize.y; y++) {
        //     this.chunks[y] = [];
        //     for (let x = 0; x < this.worldSize.x; x++) {
        //         this.chunks[y][x] = new Chunk(new Vector(x, y), new Vector(this.chunkSize.x, this.chunkSize.y));
        //     }
        // }
    }

    getChunkPositionFromTilePosition(position: Vector2): Vector2 {
        let chunk = new Vector2();

        chunk.x = Math.floor(position.x / this.chunkSize.x);
        chunk.y = Math.floor(position.y / this.chunkSize.y);

        return chunk;
    }
    
    getChunk(position: Vector2): Chunk {
        let chunk: Chunk = null;

        if (this.chunks[position.y] && this.chunks[position.y][position.x]) {
            chunk = this.chunks[position.y][position.x];
        } else {

            chunk = new Chunk(new Vector2(this.chunkSize.x, this.chunkSize.y), new Vector2(position.x, position.y));
            chunk.seedChunk();

            if (!this.chunks[position.y])
                this.chunks[position.y] = [];

            this.chunks[position.y][position.x] = chunk;
        }

        return chunk;
    }

    getChunks(start: Vector2, end: Vector2): Chunk[][] {
        let numChunksX = end.x - start.x;
        let numChunksY = start.y - end.y;

        let chunks: Chunk[][] = [];

        for (let y = start.y; y <= end.y; y++) {
            chunks[y] = [];
            for (let x = start.x; x <= end.x; x++) {
                if (this.chunks[y] && this.chunks[y][x]) {
                    chunks[y][x] = this.chunks[y][x];
                } else {

                    chunks[y][x] = new Chunk(new Vector2(this.chunkSize.x, this.chunkSize.y), new Vector2(x, y));
                    chunks[y][x].seedChunk();

                    if (!this.chunks[y])
                        this.chunks[y] = [];

                    this.chunks[y][x] = chunks[y][x];
                }
            }
        }

        return chunks
    }

    

    getTileByWorldPosition(position: Vector2) {
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
            targetChunk = this.getChunk(new Vector2(targetChunkX, targetChunkY));
        }

        targetTile = targetChunk.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}