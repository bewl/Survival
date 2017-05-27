import { inject } from 'aurelia-framework';
import { Item } from './item/item';
import * as helpers from './helpers'
import { Game } from './game';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RenderEvent } from './events/render-event';

@inject(Game, EventAggregator)
export class App {
  public itemList: Array<Item>;
  public item: Item;
  public game: Game;
  public itemCategories: Array<string>;
  public itemLifespan: number = 0 //infinite;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  _eventAggregator: EventAggregator;
  constructor(game: Game, eventAggregator: EventAggregator) {
    //this.itemCategories = helpers.GetEnumElements(ItemEnums.ItemCategories);
    this._eventAggregator = eventAggregator;
    this.game = game;
    //this.item.lifespan = 30;
  }

  attached() {

    this.ctx = this.canvas.getContext("2d");
    this.draw();
    this.game.init();
  }

  AddItem(item) {
    this.game.player.inventory.addItem(item);
  }

  RemoveItem(item) {
    this.game.player.inventory.removeItem(item);
  }

  UseItem(item: Item) {
    let i = this.game.player.inventory.getItemById(item.id);
    i.use();
  }

  toggleCollision() {
    this.game.player.toggleCollision();
  }

  draw() {
    this._eventAggregator.subscribe('RenderEvent', (event: RenderEvent) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let cellSize = 10;
      this.ctx.lineWidth = 20;
      this.ctx.font = '14px verdana';

      for (let y: number = 0; y < event.symbols.length; y++) {
        let row = event.symbols[y];
        for (let x: number = 0; x < row.length; x++) {
          this.ctx.fillStyle = event.symbols[y][x].isPlayer ? "blue" : event.symbols[y][x].color;
          let symbol = event.symbols[y][x].isPlayer ? "@" : event.symbols[y][x].symbol;
          this.ctx.fillText(symbol, (x * cellSize) + (cellSize / 2), (y * cellSize) + (cellSize / 2));
        }
      }
    });
  }
  //Change out options based on category selected (i.e. Weapon (what ammo type?))

  /********
   identify lists for category selections
  ********/
  //- Item category

  //Lifetime timer (optional random)
  //add item
  //remove item
  //select item
  //save item
  //sort items
}
