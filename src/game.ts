import {inject} from 'aurelia-framework';
import {Player} from './player';
import {ItemContext} from './item/item-context';


@inject(Player, ItemContext)
export class Game {
    player: Player = null;
    itemContext: ItemContext = null;

    constructor(player: Player, itemContext: ItemContext){
        this.player = player;
        this.itemContext = itemContext;
    }
}