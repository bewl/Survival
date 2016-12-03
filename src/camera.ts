import { inject, Container } from 'aurelia-framework';
import { Player } from './actor/player';
import { Vector } from './helpers';
import { World } from './world/world';
import { Chunk } from './world/chunk';

@inject(World)
export class Camera {
    position: Vector;
    scale: Vector;
    viewportScale: Vector;
    bounds: Array<Vector>;
    world: World;
    chunks: Chunk[][];
    viewport: Chunk;

    constructor(world) {
        this.position = null;
        this.viewportScale = new Vector(80, 32)
        this.scale = new Vector(2, 2);
        this.world = world;
        this.viewport = null;

    }

    move(position: Vector) {
        //get chunk bounds coordinates
        let startChunk = new Vector(position.x - Math.floor(this.viewportScale.x / 2), position.y - Math.floor(this.viewportScale.y / 2)); //new Vector(chunk.x - this.scale.x, chunk.y - this.scale.y);

        this.updateViewport(startChunk, position);

        this.position = position;
    }

    setIsPlayer(tile: Vector) {
        let playerTile = this.viewport.getTileByWorldPosition(tile);
        playerTile.isPlayer = true;
    }

    updateViewport(startChunk: Vector, playerPosition: Vector) {
        this.viewport = new Chunk(new Vector(this.viewportScale.x, this.viewportScale.y), null, startChunk)
        this.viewport.seedChunk();

        let playerTile = this.viewport.tiles[Math.floor(this.viewportScale.y / 2)][Math.floor(this.viewportScale.x / 2)];
        playerTile.isPlayer = true;
    }
}