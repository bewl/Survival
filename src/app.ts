import { inject } from 'aurelia-framework';
import { Item } from './item/item';
import * as helpers from './helpers'
import { Game } from './game';
import { Renderer } from './renderer';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RenderEvent } from './events/render-event';

@inject(Game, EventAggregator, Renderer)
export class App {
  public game: Game;
  public renderer: Renderer;
  canvas: HTMLCanvasElement;

  _eventAggregator: EventAggregator;
  constructor(game: Game, eventAggregator: EventAggregator, renderer: Renderer) {
    this._eventAggregator = eventAggregator;
    this.renderer = renderer;
    this.game = game;
  }

  attached() {
    this.renderer.init(this.canvas);
    this.init();
  }

  init() {
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
}
