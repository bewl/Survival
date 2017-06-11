import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { RenderEvent } from './events/render-event';
import { Game } from './game';
import { Vector2 } from './helpers';
import { UI } from './ui/ui';

@inject(EventAggregator, Game, UI)
export class Renderer {
    _eventAggregator: EventAggregator;
    canvas: HTMLCanvasElement;
    game: Game;
    ctx: CanvasRenderingContext2D;
    imageRepo: ImageRepo;
    ui: UI;

    constructor(ea: EventAggregator, game: Game, ui: UI) {
        this._eventAggregator = ea;
        this.game = game;
        this.ui = ui;
        this._eventAggregator.subscribe('RenderEvent', (event: RenderEvent) => {
            this.draw(event);
        });

        this.imageRepo = new ImageRepo();
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    };

    public draw(event: RenderEvent) {
        let offscreen = document.createElement('canvas');
        offscreen.width = this.canvas.width;
        offscreen.height = this.canvas.height;
        let offscreenCtx = offscreen.getContext('2d');

        offscreenCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        let cellSizeX = Math.ceil(offscreen.width / event.viewportSize.x);
        let cellSizeY = Math.ceil(offscreen.height / event.viewportSize.y);

        for (let y: number = 0; y < event.symbols.length; y++) {
            let row = event.symbols[y];
            for (let x: number = 0; x < row.length; x++) {
                let currentTile = event.symbols[y][x];
                let currentPos = new Vector2(x * cellSizeX, y * cellSizeY)


                offscreenCtx.fillStyle = this.game.player.position.equals(currentTile.worldPosition) ? "blue" : currentTile.color;
                offscreenCtx.fillRect(currentPos.x, currentPos.y, cellSizeX, cellSizeY);

                if (currentTile.image != null) {
                    let img = this.imageRepo.getImage('/images/' + currentTile.image);
                    offscreenCtx.drawImage(img, currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                }

                if (currentTile.chunkIndex.y == 0) {
                    offscreenCtx.moveTo(currentPos.x, currentPos.y);
                    offscreenCtx.lineTo(currentPos.x + cellSizeX, currentPos.y)
                    offscreenCtx.strokeStyle = "grey";
                    offscreenCtx.stroke();
                }

                if (currentTile.chunkIndex.x == 0) {
                    offscreenCtx.moveTo(currentPos.x, currentPos.y);
                    offscreenCtx.lineTo(currentPos.x, currentPos.y + cellSizeY)
                    offscreenCtx.strokeStyle = "grey";
                    offscreenCtx.stroke();
                }



                if (this.game.player.position.equals(currentTile.worldPosition)) {
                    offscreenCtx.fillStyle = "blue";
                    offscreenCtx.fillRect(currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                }

                if (currentTile.isSelected) {
                    let thickness = 1;
                    this.ui.selectTile(currentTile);
                    offscreenCtx.fillStyle = '#00ffff';
                    offscreenCtx.globalAlpha = 0.2;
                    offscreenCtx.fillRect(currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                    offscreenCtx.globalAlpha = 1.0;
                }
            }
        }

        this.ctx.drawImage(offscreen, 0, 0)

    }

}

class ImageRepo {
    public images: any[] = [];


    getImage(imagePath: string) {
        let image = this.images.find(a => a.path == imagePath);

        if (image == null) {
            let img = new Image();
            img.src = imagePath;

            image = { path: imagePath, image: img };
            this.images.push(image)
        }

        return image.image;
    }
}