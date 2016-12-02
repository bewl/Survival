import {inject} from 'aurelia-framework';
import {Player} from './actor/player';
import {ItemContext} from './item/item-context';
import {World} from './world/world';
import {Vector} from './helpers';
import {Input} from './input/input';

@inject(Player, World, ItemContext, Input)
export class Game {
    player: Player = null;
    itemContext: ItemContext = null;
    world:World = null;
    input:Input = null;

    constructor(player: Player, world: World, itemContext: ItemContext, input: Input){
        
        this.itemContext = itemContext;
        this.world = world;
        this.player = player;
        this.input = input;
        
        //TODO: clean this up

        this.world.generateWorld();
        player.setPosition(new Vector((this.world.chunkSize.x * this.world.worldSize.x) / 2 , (this.world.chunkSize.y * this.world.worldSize.y) / 2));
    }

}