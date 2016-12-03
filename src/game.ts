import { inject } from 'aurelia-framework';
import { Player } from './actor/player';
import { ItemContext } from './item/item-context';
import { World } from './world/world';
import { Vector } from './helpers';
import { Input } from './input/input';
import { Camera} from './camera';

@inject(Player, World, ItemContext, Input, Camera)
export class Game {
    player: Player = null;
    itemContext: ItemContext = null;
    world: World = null;
    input: Input = null;
    maxWorldSize: number;
    camera: Camera;
    constructor(player: Player, world: World, itemContext: ItemContext, input: Input, camera: Camera) {

        this.itemContext = itemContext;
        this.player = player;
        this.world = world;
        this.input = input;
        this.maxWorldSize = 200;
        this.camera = camera;
        //TODO: clean this up
        
        //this.world.generateWorld();]
        let position = new Vector((this.world.chunkSize.x * this.maxWorldSize) / 2, (this.world.chunkSize.y * this.maxWorldSize) / 2);
        
        this.player.setPlayerPosition(position);

    }

}