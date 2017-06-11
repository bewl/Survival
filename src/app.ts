import { inject } from 'aurelia-framework';
import { Item } from './item/item';
import { Game } from './game';
import { Renderer } from './renderer';
import { RenderEvent } from './events/render-event';

@inject(Game, Renderer)
export class App {
  public game: Game;
  public renderer: Renderer;
  canvas: HTMLCanvasElement;
public ui: HTMLElement;

  constructor(game: Game, renderer: Renderer) {
    this.renderer = renderer;
    this.game = game;
  }

  attached() {
    this.renderer.init(this.canvas);
    this.init();
     window.addEventListener('resize', () => {
       
       this.game.camera.updateViewport()
     }, false);

     this.ui.addEventListener('mouseenter', () => { this.game.isUIActive = true; });
     this.ui.addEventListener('mouseleave', () => { this.game.isUIActive = false; });
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
