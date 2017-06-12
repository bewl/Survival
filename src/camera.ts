import { inject, Container } from 'aurelia-framework';
import { Player } from './actor/player';
import { Vector2, Bounds } from './helpers';
import { World } from './world/world';
import { Chunk } from './world/chunk';
import { Tile } from './tile/tile';
import { UI } from './ui/ui';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RenderEvent } from './events/render-event';
import { PlayerMovedEvent } from './events/player-moved-event';

@inject(World, EventAggregator, Player, UI)
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
    ui: UI;

    constructor(world, eventAggregator, player, ui) {
        this._eventAggregator = eventAggregator;
        this.ui = ui;
        this.position = null;
        this.world = world;
        this.zoomLevel = 7;
        this.viewportSize = new Vector2(128, 64); //this.world.chunkSize //1960x950 = 2.02 aspect ratio
        //this.scale = new Vector2(2, 2);
        this.viewport = null;
        this.player = player;
        this._eventAggregator.subscribe('PlayerMoved', (event: PlayerMovedEvent) => {
            this.ui.deselectTiles();
            this.translate(event.position);
            this.updateViewport();
        });

        this._eventAggregator.subscribe('Update', (playerPos?: Vector2) => {
            this.updateViewport();
        });

        this._eventAggregator.subscribe('ZoomChanged', (dir: number) => {
            let minSize = 16;
            let maxSize = 512;
            if (dir == 1) {
                var x = Math.pow(2, this.zoomLevel - 1) / 2;
                if (x >= minSize) {
                    this.viewportSize.x = x;
                    this.viewportSize.y = x / 2;

                    this.zoomLevel--;
                    this.updateViewport();
                }
            }
            else if (dir == -1) {
                var x = Math.pow(2, this.zoomLevel + 1) / 2;
                if (x <= maxSize) {
                    this.viewportSize.x = x;
                    this.viewportSize.y = x / 2;

                    this.zoomLevel++;

                    this.updateViewport();
                }
            }
        });
    }

    translate(position: Vector2) {
        this.position = position;
        //this.updateViewport();
    }

    setIsPlayer(tile: Vector2) {
        let playerTile = this.world.getTileByWorldPosition(tile)// this.viewport.getTileByWorldPosition(tile);
        playerTile.isPlayer = true;
    }

updateViewport() {
        let canvas: any = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.viewportSize = new Vector2(Math.pow(2, this.zoomLevel), Math.pow(2, this.zoomLevel) / 2);
           
        let viewportBuffer = this.world.getViewport(this.viewportSize, this.player.position);

        this.viewport = [];
        this.viewport = viewportBuffer;

        let flattendTiles = [].concat(...this.viewport);
        this._eventAggregator.publish('RenderEvent', new RenderEvent(this.viewport, this.viewportSize));

    }
}