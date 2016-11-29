import {Container} from 'aurelia-framework';
import {Player} from './player';

export class Monster extends Player {
    player:Player;

    constructor() {
        super();
        this.player = Container.instance.get(Player) as Player;
    }

    attack(
}