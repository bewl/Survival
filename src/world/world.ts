import { inject, Container } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Tile } from '../tile/tile';

import { Perlin, Random, Vector2, Bounds, KeyValuePair } from '../helpers';

export class World {
    public chunks: Chunk[];
    public activeChunks: Chunk[][]; //the chunks including and surrounding the camera viewport
    public activeTiles: Tile[][];
    public activeChunkSize: number; //the amount of active chunks in a given direction
    public chunkSize: Vector2;
    public seed: number;
    public viewPortAspectRatio: number;
    public viewportScale: number;
    private perlin: Perlin;
    playerTile: Tile;


    constructor() {
        this.viewportScale = 7;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.chunkSize = new Vector2(100, 100);
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
        let chunk = this.getChunk(chunkPos);

        let targetTile = chunk.getTileByWorldPosition(position);

        return targetTile;
    }

    getChunk(position: Vector2): Chunk {
        let chunk: Chunk = this.chunks.find(a => a.chunkId == position.toString());

        if (chunk == null) {
            chunk = new Chunk(new Vector2(this.chunkSize.x, this.chunkSize.y), new Vector2(position.x, position.y));
            this.chunks.push(chunk);
        }
        return chunk;
    }
}