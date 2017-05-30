import { inject, Container } from 'aurelia-framework';
import { Player } from './actor/player';
import { Vector2, Bounds } from './helpers';
import { World } from './world/world';
import { Chunk } from './world/chunk';
import { Tile } from './tile/tile';

import { EventAggregator } from 'aurelia-event-aggregator';
import { RenderEvent } from './events/render-event';
import { PlayerMovedEvent } from './events/player-moved-event';

@inject(World, EventAggregator)
export class Camera {
    _eventAggregator: EventAggregator;

    position: Vector2;
    scale: Vector2;
    viewportSize: Vector2;
    viewportScale: number;
    bounds: Array<Vector2>;
    world: World;
    chunks: Chunk[][];
    //viewport: Chunk;

    viewport: Tile[][];


    constructor(world, eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.position = null;
        this.world = world;
        this.viewportSize = new Vector2(100, 50); //this.world.chunkSize //1960x950 = 2.02 aspect ratio
        this.scale = new Vector2(2, 2);
        this.viewport = null;

        this._eventAggregator.subscribe('PlayerMoved', (event: PlayerMovedEvent) => {
            this.translate(event.position)
        });
    }

    translate(position: Vector2) {
        //get chunk bounds coordinates
        let startChunk = new Vector2(position.x - Math.floor(this.viewportSize.x / 2), position.y - Math.floor(this.viewportSize.y / 2));

        this.updateViewport(startChunk, position);

        this.position = position;
    }

    setIsPlayer(tile: Vector2) {
        let playerTile = this.world.getTileByWorldPosition(tile)// this.viewport.getTileByWorldPosition(tile);
        playerTile.isPlayer = true;
    }

    updateViewport(startPos: Vector2, playerPos: Vector2) {
        //needs heavy optimization here
        //get top left and bottom right bounds in world positions
        let startTilePos: Vector2 = new Vector2(playerPos.x - Math.floor(this.viewportSize.x / 2), playerPos.y - Math.floor(this.viewportSize.y / 2));
        let endTilePos: Vector2 = new Vector2(startTilePos.x + this.viewportSize.x, startTilePos.y + this.viewportSize.y);

        let topLeftChunkPos = this.world.getChunkPositionFromWorldPosition(startTilePos);
        let bottomRightChunkPos = this.world.getChunkPositionFromWorldPosition(endTilePos);
        
        let viewportBuffer: Tile[][] = [];
        //getting the intersecting chunks
        for (let y = topLeftChunkPos.y; y <= bottomRightChunkPos.y; y++) {
            let yPos = y - topLeftChunkPos.y;
            let yCount = viewportBuffer.length;
            for (let x = topLeftChunkPos.x; x <= bottomRightChunkPos.x; x++) {
                let xPos = x - topLeftChunkPos.x;
                let chunks = this.world.getChunk(new Vector2(x, y))
                let startTile = startTilePos;
                let endTile = endTilePos;
                let tiles  = chunks.getTileSubset(new Bounds(new Vector2(startTile.x, startTile.y), new Vector2(endTile.x, endTile.y)));
                //setting the viewport tiles

                for (let yy = 0; yy < tiles.length; yy++) {
                    let yBuffer = yy + (yPos * yCount);
                    if(viewportBuffer[yBuffer] == undefined)
                        viewportBuffer[yBuffer] = [];

                    viewportBuffer[yBuffer] = viewportBuffer[yBuffer].concat(tiles[yy]);
                }
            }
        }
        
        let playerTileCache = null;
        
        if(this.viewport != null)
         playerTileCache = this.viewport[Math.floor(this.viewportSize.y / 2)][Math.floor(this.viewportSize.x / 2)];
        
        this.viewport = [];
        this.viewport = viewportBuffer;
        let playerTile = this.viewport[Math.floor(this.viewportSize.y / 2)][Math.floor(this.viewportSize.x / 2)];
        if(playerTileCache)
            playerTileCache.isPlayer = false;
        playerTile.isPlayer = true;

        let flattendTiles = [].concat(...this.viewport);
        this._eventAggregator.publish('RenderEvent', new RenderEvent(this.viewport, this.viewportScale));

    }
}