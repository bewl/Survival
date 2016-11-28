import {Knife} from './knife';
import {noView} from 'aurelia-framework'; 

@noView
export class HuntingKnife extends Knife {
    constructor() {
        super();
    }
    Wield() {
        super.Wield();
    }
}