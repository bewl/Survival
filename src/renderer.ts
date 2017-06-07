import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { RenderEvent } from './events/render-event';
import { Game } from './game';
import { Vector2 } from './helpers';

@inject(EventAggregator, Game)
export class Renderer {
    _eventAggregator: EventAggregator;
    canvas: HTMLCanvasElement;
    game: Game;
    ctx: CanvasRenderingContext2D;
    imageRepo: ImageRepo;

    constructor(ea: EventAggregator, game: Game) {
        this._eventAggregator = ea;
        this.game = game;

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
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cellSizeX = Math.ceil(this.canvas.width / event.viewportSize.x);
        let cellSizeY = Math.ceil(this.canvas.height / event.viewportSize.y);

        for (let y: number = 0; y < event.symbols.length; y++) {
            let row = event.symbols[y];
            for (let x: number = 0; x < row.length; x++) {
                let currentTile = event.symbols[y][x];
                let currentPos = new Vector2(x * cellSizeX, y * cellSizeY)
                this.ctx.fillStyle = currentTile.isPlayer ? "blue" : currentTile.color;
                this.ctx.fillRect(currentPos.x, currentPos.y, cellSizeX, cellSizeY);

                if(currentTile.image != null) {
                    let img = this.imageRepo.getImage('/images/' + currentTile.image);
                    this.ctx.drawImage(img, currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                }

                if(currentTile.chunkIndex.y == 0) {
                    this.ctx.moveTo(currentPos.x, currentPos.y);
                    this.ctx.lineTo(currentPos.x + cellSizeX, currentPos.y)
                    this.ctx.strokeStyle = "grey";
                    this.ctx.stroke();
                }

                if(currentTile.chunkIndex.x == 0) {
                    this.ctx.moveTo(currentPos.x, currentPos.y);
                    this.ctx.lineTo(currentPos.x, currentPos.y + cellSizeY)
                    this.ctx.strokeStyle = "grey";
                    this.ctx.stroke();
                }
            }
        }
    }

}

class ImageRepo {
    public images: any[] = [];


    getImage(imagePath: string) {
        let image = this.images.find(a => a.path == imagePath);
        
        if(image == null) {
            let img = new Image();
            img.src = imagePath;

            image = {path: imagePath, image: img};
            this.images.push(image)
        } 
        
        return image.image;
    }
}