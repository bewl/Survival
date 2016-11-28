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
            let item = new Item();
            item.category = data.category;
            item.description = data.description;
            item.lifespan = data.lifespan;
            item.module = data.module;
            item.title = data.title;
            item.volume = data.volume;
            item.weight = data.weight;

            this.AddItem(item);
        })
    }

    AddItem(item:Item) {
        this.items.push(item);
    }

    

    
}