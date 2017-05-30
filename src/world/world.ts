import { inject, Container } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Tile } from '../tile/tile';

import { Perlin, Random, Vector2, Bounds } from '../helpers';

export class World {
    public chunks: Chunk[][];
    public activeChunks: Chunk[][]; //the chunks including and surrounding the camera viewport
    public activeTiles: Tile[][];
    public activeChunkSize: number; //the amount of active chunks in a given direction
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
        this.chunkSize = new Vector2(100, 100);//new Vector2(this.viewportScale * (Math.floor(9 * this.viewPortAspectRatio)), Math.floor(this.viewportScale * 9)); //TODO: put this in a setting so other modules can access it
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();
        this.playerTile = null;
    }

    generateSeed(seed: number = null) {
        this.perlin.seed(seed == null ? this.seed : seed);
    }

    generateActiveChunks(startPos: Vector2) {
        let minY = startPos.y - this.activeChunkSize;
        let maxY = startPos.y + this.activeChunkSize;
        let minX = startPos.x - this.activeChunkSize;
        let maxX = startPos.x + this.activeChunkSize;
        let activeChunks: Chunk[][] = [];
        let activeTiles: Tile[][] = [];
        for(let y = 0; y <= maxY - startPos.y; y++) {
            activeChunks[y] = [];
            for(let x = 0; x <= maxX - startPos.x; x++) {
                let position: Vector2 = new Vector2(minX + x, minY + y);
                let chunk = this.chunks[position.y][position.x];
                
                if(chunk == null) 
                    chunk = this.chunks[position.y][position.x] = new Chunk(this.chunkSize, position);
                
                activeChunks[y][x] = chunk; 
                activeTiles = activeTiles.concat(chunk.tiles);
            }
        }

        this.activeChunks = activeChunks;
        this.activeTiles = activeTiles;
    }   

    getActiveChunkBounds(viewportSize: number): Bounds {

        let topLeft = this.activeChunks[0][0]
                            .getWorldPositionBounds()
                            .topLeft;
        let bottomRight = this.activeChunks[this.activeChunks.length - 1][this.activeChunkSize - 1]
                            .getWorldPositionBounds()
                            .bottomRight;

        
        return new Bounds(topLeft, bottomRight);
    }

    getChunkPositionFromWorldPosition(position: Vector2): Vector2 {
        let chunk = new Vector2();

        chunk.x = Math.floor(position.x / this.chunkSize.x);
        chunk.y = Math.floor(position.y / this.chunkSize.y);

        return chunk;
    }

    getTileByWorldPosition(position: Vector2, chunkSize?: Vector2) {
        let chunkPos = this.getChunkPositionFromWorldPosition(position);
        let chunk = this.chunks[chunkPos.y][chunkPos.x];

        let size = chunkSize || this.chunkSize;
        let targetTileX = Math.floor(position.x % size.x);
        let targetTileY = Math.floor(position.y % size.y);

        let targetTile = chunk.tiles[targetTileY][targetTileX];

        return targetTile;
    }

    getChunk(position: Vector2): Chunk {
        let chunk: Chunk = null;

        if (this.chunks[position.y] && this.chunks[position.y][position.x]) {
            chunk = this.chunks[position.y][position.x];
        } else {

            chunk = new Chunk(new Vector2(this.chunkSize.x, this.chunkSize.y), new Vector2(position.x, position.y));

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

                    if (!this.chunks[y])
                        this.chunks[y] = [];

                    this.chunks[y][x] = chunks[y][x];
                }
            }
        }
        return chunks
    }
}