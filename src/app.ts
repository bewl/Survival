import { inject } from 'aurelia-framework';
import * as ItemEnums from './itemenums';
import { Item } from './item';
import * as helpers from './helpers'

export class App {
  public itemList:Array<Item>;
  public item: Item;
  public itemCategories: Array<string>;
  public itemLifespan: number = 0 //infinite;

  constructor(item) {
    this.itemCategories = helpers.GetEnumElements(ItemEnums.ItemCategories);
    this.item = item;

    this.item.lifespan = 30;
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
