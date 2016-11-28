import {Item} from "./item";
import items from "./items";
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