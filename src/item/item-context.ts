import {Item} from "./item";
import items from "./data/items";
import weaponStats from "./data/weapon-stats";
import {Guid} from '../helpers';

export class ItemContext {
    items:Array<Item>;

    constructor() {
        this.items = [];
        this.LoadItems();
    }

    LoadItems() {
        items.forEach(data => {
            let stats = weaponStats.find(s => s.id === data.module);
            let item = Item.mapItem(data);
            this.AddItem(item);
        })
    }

    AddItem(item:Item) {
        this.items.push(item);
    }

    

    
}