import {Item} from "./item";
import items from "./data/items";
import weaponStats from "./data/weapon-stats";
import itemStats from "./data/item-stats";
import {Guid} from '../helpers';

export class ItemContext {
    items:Array<Item>;

    constructor() {
        this.items = [];
        this.LoadItems();
    }

    LoadItems() {
        items.forEach(data => {
            let iStats = itemStats.find(s => s.id === data.module);
            let wStats = weaponStats.find(s => s.id === data.module);
            
            let item = Item.mapItem(data);
            
            if(iStats) {
                item.stats = Item.mapItemStats(iStats);
            }

            if(wStats) {
                item.weaponStats = Item.mapWeaponStats(wStats);
            }
            
            this.AddItem(item);
        })
    }

    AddItem(item:Item) {
        this.items.push(item);
    }

    

    
}