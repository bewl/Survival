import {inject, Container} from 'aurelia-framework';
import {Player} from '../player';

export class ItemModule {
    player:Player;
    constructor() {
        this.player = Container.instance.get(Player);
    }

    wield() {
        //this.player.inventory.
    }

    use() {
        return null;
    }
    
}