import {inject} from 'aurelia-framework';
import {Item} from './item';
import {Guid} from './helpers';

export class Inventory {

    private _items:Array<Item> = [];
    public get items():Array<Item> {
        return this._items;
    }
    public set items(value:Array<Item>) {
        this._items = value;
    }

    private _volumeCap:number = null;
    public get volumeCap():number {
        return this._volumeCap;
    }
    public set volumeCap(value:number) {
        this._volumeCap = value;
    }

    private _weightCap:number = null;
    public get weightCap():number {
        return this._weightCap;
    }
    public set weightCap(value:number) {
        this._weightCap = value;
    }

    currentVolume:number = 0;
    currentWeight:number = 0;

    constructor() {
        this.weightCap = 60;
        this.volumeCap = 15;
    }
    
    GetItemById(id:string):Item {
        return this.items.find(item => item.id === id);
    }

    AddItem(item: Item) {
        this.currentVolume += item.volume;
        this.currentWeight += item.weight;
        //let mod = require('./item-modules/' + item.module);
        let i = Object.assign(new Item(), item);
        i.id = Guid.newGuid();
        this.items.push(i);
        //update volumeCurrent
        //update weightCurrent
        //run any 'equip' script associated with item
    }

    RemoveItem(item:Item) {
        this.currentVolume -= item.volume;
        this.currentWeight -= item.weight;

        this.items = this.items.filter(i => i.id !== item.id);

        //update volumeCurrent
        //update weightCurrent
        //run any 'remove' script associated with item
    }

}