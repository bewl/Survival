import {ItemModule} from '../item-module';

export class Bandage extends ItemModule {
    constructor() {
        super();
    }

    use() {
        this.player.health.heal('head', 3);
    }
}