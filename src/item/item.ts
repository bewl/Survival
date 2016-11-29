import { ItemModule } from './item-module';
import { Aurelia, inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Player } from '../player';
import { ItemStats} from './stats/item-stats';
import { WeaponStats} from './stats/weapon-stats';

export class Item {
    id: string;
    title: string;
    description: string;
    category: string;
    module: string;
    stats:ItemStats;
    weaponStats : WeaponStats;
    container: Container;


    constructor() {
        //TODO need a mapper for this
        this.container = Container.instance;
        this.id = "";
        this.title = "";
        this.description = "";
        this.category = "";
        this.module = "";
        this.stats = null;
        this.weaponStats = null;
    }

    static mapItem(data) {
        let item = new Item();
        item.category = data.category;
        item.description = data.description;
        item.module = data.module;
        item.title = data.title;
        
        return item;
    }

    static mapItemStats(data) {
        let stats = new ItemStats();
        stats.charges = data.charges;
        stats.decay = data.decay;
        stats.volume = data.volume;
        stats.weight = data.weight;
        stats.durability = data.durability;

        return stats;
    }

    static mapWeaponStats(data) {
        let stats = new WeaponStats();
        stats.ammoType = data.ammoType;
        stats.bash = data.bash;
        stats.pierce = data.pierce;
        stats.range = data.range;
        stats.slash = data.slash;

        return stats;
    }

    use() {
        let mod = this.container.get(this.module) as ItemModule;
        mod.use();

        //handle if there are charges on this item or not
        if (this.stats.charges !== -1) {
            if (this.stats.charges > 0) {
                if (this.stats.charges === 1) {
                    let player = this.container.get(Player) as Player;
                    player.inventory.removeItem(this);
                }

                this.stats.charges -= 1;
            }
        }
    }
}
