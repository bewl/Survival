import {inject} from 'aurelia-framework';
import {Player} from './player';
import {ItemContext} from './item/item-context';
import {World} from './world/world';

@inject(Player, World, ItemContext)
export class Game {
    player: Player = null;
    itemContext: ItemContext = null;
    world:World = null;

    constructor(player: Player, world: World, itemContext: ItemContext){
        this.player = player;
        this.itemContext = itemContext;
        this.world = world;

        this.world.generateWorld();
    }
}