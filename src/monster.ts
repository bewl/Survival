import {Container} from 'aurelia-framework';
import {Player} from './player';

export class Monster extends Player {
    constructor() {
        super();
        this.enemy = Container.instance.get(Player) as Player;
    }

    attack() {
        
    }
}