import {inject} from 'aurelia-framework';
import {Player} from './player';

@inject(Player)
export class ItemModule {
    constructor() {
        //this.player = player
    }

    Wield() {
        //this.player.inventory.
    }

    Use() {
        return null;
    }
    
}