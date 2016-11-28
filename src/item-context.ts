import {Item} from "./item";
import items from "./items";

export class ItemContext {
    public items:Array<Item> = null;

    constructor() {
        this.LoadItems();
    }

    LoadItems() {
        items.forEach(item => {
            this.AddItem(item);
        })
    }

    AddItem(item:Item) {
        this.items.push(item);
    }

    GetItemByTitle(title:string):Item {
        return this.items.find(item => item.title === title);
    }
}