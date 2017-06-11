import { inject, Container } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Tile } from '../tile/tile';
import { Player } from '../actor/player';
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
    playerTileCache: Tile;
    private perlin: Perlin;
    playerPositionCache: Vector2;
    playerTile: Tile;


    constructor() {
        this.viewportScale = 7;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.chunkSize = new Vector2(64, 64);
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
        for (let y = 0; y <= maxY - startPos.y; y++) {
            activeChunks[y] = [];
            for (let x = 0; x <= maxX - startPos.x; x++) {
                let position: Vector2 = new Vector2(minX + x, minY + y);
                let chunk = this.chunks[position.y][position.x];

                if (chunk == null)
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
    getViewport(viewportSize: Vector2, center: Vector2 ) : Tile[][]  {
        let startTilePos: Vector2 = new Vector2(center.x - Math.floor(viewportSize.x / 2), center.y - Math.floor(viewportSize.y / 2));
        let endTilePos: Vector2 = new Vector2(startTilePos.x + viewportSize.x, startTilePos.y + viewportSize.y);

        let topLeftChunkPos = this.getChunkPositionFromWorldPosition(startTilePos);
        let bottomRightChunkPos = this.getChunkPositionFromWorldPosition(endTilePos);


        let viewportBuffer: Tile[][] = [];
        //getting the intersecting chunks
        for (let y = topLeftChunkPos.y; y <= bottomRightChunkPos.y; y++) {
            let yPos = y - topLeftChunkPos.y;
            let yCount = viewportBuffer.length;
            for (let x = topLeftChunkPos.x; x <= bottomRightChunkPos.x; x++) {
                let xPos = x - topLeftChunkPos.x;
                let chunks = this.getChunk(new Vector2(x, y))
                let startTile = startTilePos;
                let endTile = endTilePos;
                let tiles = chunks.getTileSubset(new Bounds(startTile, endTile));
                //setting the viewport tiles
                let yy = 0;
                for (yy; yy < tiles.length; yy++) {
                    let yBuffer = yy + yCount;
                    if (viewportBuffer[yBuffer] == undefined)
                        viewportBuffer[yBuffer] = [];

                    viewportBuffer[yBuffer] = viewportBuffer[yBuffer].concat(tiles[yy]);
                }
            }
        }
        return viewportBuffer;
    }
    setViewport(viewportSize: Vector2, playerPosition: Vector2): Tile[][] {
        let viewportBuffer: Tile[][] = this.getViewport(viewportSize, playerPosition);

        return viewportBuffer;
    }
}