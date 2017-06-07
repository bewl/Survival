import {ItemModule} from '../item-module';

export class Bandage extends ItemModule {
    constructor() {
        super();
    }

    use() {
        if(this.player.health.value('head') + 3 <= this.player.health.maxHealth )

        {
            this.player.health.heal('head', 3);
            return true;
        }

        return false;
    }
}