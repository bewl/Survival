import {Container} from 'aurelia-framework';
import {HuntingKnife} from './modules/hunting-knife';
import {Knife} from './modules/knife';
import {Bandage} from './modules/bandage';

export function RegisterItemModules() {
    Container.instance.registerInstance('hunting-knife', new HuntingKnife());
    Container.instance.registerInstance('knife', new Knife());
    Container.instance.registerInstance('bandage', new Bandage());
}
