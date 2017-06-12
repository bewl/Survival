import {Knife} from './knife';
import {noView} from 'aurelia-framework'; 

@noView
export class HuntingKnife extends Knife {
    constructor() {
        super();
    }
    wield() {
        super.wield();
        
    }

    use() {
        super.use();
        this.player.health.damage("head", 5);

        return true;
    }
}