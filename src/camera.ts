import { inject, Container } from 'aurelia-framework';
import { Player } from './actor/player';
import { Vector2 } from './helpers';
import { World } from './world/world';
import { Chunk } from './world/chunk';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RenderEvent} from './events/render-event';
import {PlayerMovedEvent} from './events/player-moved-event';

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
    viewport: Chunk;
    

    constructor(world, eventAggregator) {
        this._eventAggregator = eventAggregator;
        this.position = null;
        this.world = world;
        this.viewportSize = this.world.chunkSize //1960x950 = 2.02 aspect ratio
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
        let playerTile = this.viewport.getTileByWorldPosition(tile);
        playerTile.isPlayer = true;
    }

    updateViewport(startPos: Vector2, playerPos: Vector2) {
        //needs heavy optimization here
        this.viewport = new Chunk(new Vector2(this.viewportSize.x, this.viewportSize.y), null, startPos)
        this.viewport.seedChunk();

        let playerTile = this.viewport.tiles[Math.floor(this.viewportSize.y / 2)][Math.floor(this.viewportSize.x / 2)];
        playerTile.isPlayer = true;
        let flattendTiles = [].concat(...this.viewport.tiles);
         this._eventAggregator.publish('RenderEvent', new RenderEvent(this.viewport.tiles, this.viewportScale));
         
    }
}