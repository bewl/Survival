import {inject} from 'aurelia-framework';
import {Item} from './item';


export class Inventory {
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

    AddItem() {
        //update volumeCurrent
        //update weightCurrent
        //run any 'equip' script associated with item
    }

    RemoveItem(item:Item) {
        //update volumeCurrent
        //update weightCurrent
        //run any 'remove' script associated with item
    }

}