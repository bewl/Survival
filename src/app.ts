import { inject } from 'aurelia-framework';
import { Item } from './item/item';
import * as helpers from './helpers'
import {Game} from './game';

@inject(Game)
export class App {
  public itemList:Array<Item>;
  public item: Item;
  public game: Game;
  public itemCategories: Array<string>;
  public itemLifespan: number = 0 //infinite;

  constructor(game: Game) {
    //this.itemCategories = helpers.GetEnumElements(ItemEnums.ItemCategories);
    this.game = game;
    //this.item = item;

    //this.item.lifespan = 30;
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
