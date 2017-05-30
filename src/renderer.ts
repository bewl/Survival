import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { RenderEvent } from './events/render-event';
import { Game } from './game';

@inject(EventAggregator, Game)
export class Renderer {
    _eventAggregator: EventAggregator;
    canvas: HTMLCanvasElement;
    game: Game;
    ctx: CanvasRenderingContext2D;

    constructor(ea: EventAggregator, game: Game) {
        this._eventAggregator = ea;
        this.game = game;

        this._eventAggregator.subscribe('RenderEvent', (event: RenderEvent) => {
            this.draw(event);
        });
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    };

    public draw(event: RenderEvent) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cellSizeX = 8;//Math.ceil(this.canvas.clientWidth / this.game.world.chunkSize.x) / 2;
        let cellSizeY = 16;//Math.ceil(this.canvas.clientHeight / this.game.world.chunkSize.y) / 2;
        this.ctx.lineWidth = 20;
        this.ctx.font = '11px Courier New';
        this.ctx.textAlign = "center";

        for (let y: number = 0; y < event.symbols.length; y++) {
            let row = event.symbols[y];
            for (let x: number = 0; x < row.length; x++) {
                this.ctx.fillStyle = event.symbols[y][x].isPlayer ? "blue" : event.symbols[y][x].color;
                let symbol = event.symbols[y][x].isPlayer ? "@" : event.symbols[y][x].symbol;
                if (event.symbols[y][x].isPlayer) {
                    this.ctx.shadowColor = "white";
                    this.ctx.shadowBlur = 12;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeText(symbol, x * cellSizeX, y * cellSizeY)
                } else {
                    this.ctx.shadowBlur = 0;
                }
                this.ctx.fillText(symbol, x * cellSizeX, y * cellSizeY);
            }
        }
    }
}