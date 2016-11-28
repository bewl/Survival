import {Item} from "./item/item";
import items from "./item/data/items";
import {Guid} from './helpers';

export class ItemContext {
    items:Array<Item>;

    constructor() {
        this.items = [];
        this.LoadItems();
    }

    LoadItems() {
        items.forEach(data => {
            let item = Item.map(data);
            this.AddItem(item);
        })
    }

    AddItem(item:Item) {
        this.items.push(item);
    }

    

    
}