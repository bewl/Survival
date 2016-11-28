import {Aurelia} from 'aurelia-framework';
import {HuntingKnife} from './resources/item-modules/hunting-knife';
import {Knife} from './resources/item-modules/knife';

export function RegisterItemModules(aurelia: Aurelia) {
    aurelia.container.registerInstance('hunting-knife', new HuntingKnife());
    aurelia.container.registerInstance('knife', new Knife());
}