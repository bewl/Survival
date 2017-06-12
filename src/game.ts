import { inject } from 'aurelia-framework';
import { Player } from './actor/player';
import { ItemContext } from './item/item-context';
import { World } from './world/world';
import { Vector2 } from './helpers';
import { Input } from './input/input';
import { Camera} from './camera';
import { GenerateHashCode } from './helpers'
import {EventAggregator} from 'aurelia-event-aggregator';
import {UI} from './ui/ui';

@inject(Player, World, ItemContext, Input, Camera, EventAggregator, UI)
export class Game {
    player: Player = null;
    itemContext: ItemContext = null;
    world: World = null;
    input: Input = null;
    seed: string = "Test seed";
    maxWorldSize: number;
    camera: Camera;
    isUIActive: boolean;
    eventAggregator: EventAggregator;
    ui: UI;


    constructor(player: Player, world: World, itemContext: ItemContext, input: Input, camera: Camera, ea: EventAggregator, ui: UI) {

        this.itemContext = itemContext;
        this.player = player;
        this.world = world;
        this.input = input;
        this.maxWorldSize = 200;
        this.camera = camera;
        this.isUIActive = false;
        this.eventAggregator = ea;
        this.ui = ui;
    }

    init() {
        this.world.generateSeed(GenerateHashCode(this.seed));
        this.world.chunks = [];
        let position = new Vector2(10000, 100000);
        //Vector2.zero();//new Vector2((this.world.chunkSize.x * this.maxWorldSize) / 2, (this.world.chunkSize.y * this.maxWorldSize) / 2);
        
        this.player.setPlayerPosition(position);

        //this.camera.updateViewport();
    }

}

