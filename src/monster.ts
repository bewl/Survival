import {Container} from 'aurelia-framework';
import {Actor} from './actor';

export class Monster extends Actor {
    constructor() {
        super();
        //this.enemy = Container.instance.get(Player) as Player;
    }

    attack() {
        
    }
}