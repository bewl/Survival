import { inject, Container } from 'aurelia-framework';
import { Player } from './actor/player';
import { Vector2, Bounds } from './helpers';
import { World } from './world/world';
import { Chunk } from './world/chunk';
import { Tile } from './tile/tile';

import { EventAggregator } from 'aurelia-event-aggregator';
import { RenderEvent } from './events/render-event';
import { PlayerMovedEvent } from './events/player-moved-event';

@inject(World, EventAggregator, Player)
export class Camera {
    _eventAggregator: EventAggregator;

    position: Vector2;
    playerPositionCache: Vector2;
    scale: Vector2;
    viewportSize: Vector2;
    viewportScale: number;
    zoomLevel: number;
    bounds: Array<Vector2>;
    world: World;
    chunks: Chunk[][];
    //viewport: Chunk;
    player: Player;
    viewport: Tile[][];


    constructor(world, eventAggregator, player) {
        this._eventAggregator = eventAggregator;
        this.position = null;
        this.world = world;
        this.zoomLevel = 7;
        this.viewportSize = new Vector2(128, 64); //this.world.chunkSize //1960x950 = 2.02 aspect ratio
        //this.scale = new Vector2(2, 2);
        this.viewport = null;
        this.player = player;
        this._eventAggregator.subscribe('PlayerMoved', (event: PlayerMovedEvent) => {
            this.translate(event.position)
        });

        this._eventAggregator.subscribe('Update', (playerPos?: Vector2) => {
            this.updateViewport(playerPos);
        });

       

        this._eventAggregator.subscribe('ZoomChanged', (dir: number) => {
            let minSize = 16;
            let maxSize = 256;
            if (dir == 1) {
                var x = Math.pow(2, this.zoomLevel - 1) / 2;
                if (x > minSize) {
                    this.viewportSize.x = x;
                    this.viewportSize.y = x / 2;

                    this.zoomLevel--;
                    this.updateViewport(this.player.position);
                }
            }
            else if (dir == -1) {
                var x = Math.pow(2, this.zoomLevel + 1) / 2;
                if (x < maxSize) {
                    this.viewportSize.x = x;
                    this.viewportSize.y = x / 2;

                    this.zoomLevel++;

                    this.updateViewport(this.player.position);
                }
            }
        });
    }

    translate(position: Vector2) {
        this.updateViewport(position);

        this.position = position;
    }

    setIsPlayer(tile: Vector2) {
        let playerTile = this.world.getTileByWorldPosition(tile)// this.viewport.getTileByWorldPosition(tile);
        playerTile.isPlayer = true;
    }

updateViewport(playerPosition?: Vector2) {
        let canvas: any = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.viewportSize = new Vector2(Math.pow(2, this.zoomLevel), Math.pow(2, this.zoomLevel) / 2);
        let playerPos = playerPosition || this.playerPositionCache;
        //needs heavy optimization here
        //get top left and bottom right bounds in world positions
        let startTilePos: Vector2 = new Vector2(playerPos.x - Math.floor(this.viewportSize.x / 2), playerPos.y - Math.floor(this.viewportSize.y / 2));
        let endTilePos: Vector2 = new Vector2(startTilePos.x + this.viewportSize.x, startTilePos.y + this.viewportSize.y);

        let topLeftChunkPos = this.world.getChunkPositionFromWorldPosition(startTilePos);
        let bottomRightChunkPos = this.world.getChunkPositionFromWorldPosition(endTilePos);
        if (playerPosition != null) {
            let viewportBuffer: Tile[][] = [];
            //getting the intersecting chunks
            //squares represent chunks, #'s represent the chunk's tiles 
            //with '1' meaning the tiles we are interested in stitching together for our viewport

            //______________________________________________
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000111111111|1111111110000000000000|
            //|0000000000000111111111|1111111110000000000000|
            //|0000000000000111111111|1111111110000000000000|
            //______________________________________________
            //|0000000000000111111111|1111111110000000000000|
            //|0000000000000111111111|1111111110000000000000|
            //|0000000000000111111111|1111111110000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //|0000000000000000000000|0000000000000000000000|
            //
            for (let y = topLeftChunkPos.y; y <= bottomRightChunkPos.y; y++) {
                let yPos = y - topLeftChunkPos.y;
                let yCount = viewportBuffer.length;
                for (let x = topLeftChunkPos.x; x <= bottomRightChunkPos.x; x++) {
                    let xPos = x - topLeftChunkPos.x;
                    let chunks = this.world.getChunk(new Vector2(x, y))
                    let startTile = startTilePos;
                    let endTile = endTilePos;
                    let tiles = chunks.getTileSubset(new Bounds(new Vector2(startTile.x, startTile.y), new Vector2(endTile.x, endTile.y)));
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

            let playerTileCache = null;

            if (this.viewport != null)
                playerTileCache = this.viewport[Math.floor(this.viewport.length / 2)][Math.floor(this.viewportSize.x / 2)];

            this.viewport = [];
            this.viewport = viewportBuffer;

            if (playerTileCache)
                playerTileCache.isPlayer = false;
        }
        let playerTile = this.viewport[Math.floor(this.viewportSize.y / 2)][Math.floor(this.viewportSize.x / 2)];
        playerTile.isPlayer = true;

        this.playerPositionCache = playerTile.worldPosition;

        let flattendTiles = [].concat(...this.viewport);
        this._eventAggregator.publish('RenderEvent', new RenderEvent(this.viewport, this.viewportSize));

    }
}