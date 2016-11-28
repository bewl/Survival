import {Container} from 'aurelia-framework';
import {HuntingKnife} from './modules/hunting-knife';
import {Knife} from './modules/knife';

export function RegisterItemModules() {
    Container.instance.registerInstance('hunting-knife', new HuntingKnife());
    Container.instance.registerInstance('knife', new Knife());
}