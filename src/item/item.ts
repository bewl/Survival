import { ItemInterface } from './item-interface';
import { ItemModule } from './item-module';
import { Aurelia, inject } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Player } from '../player';

export class Item implements ItemInterface {
    id: string;
    title: string;
    description: string;
    category: string;
    lifespan: number;
    volume: number;
    weight: number;
    module: string;
    container: Container;
    charges: number;

    constructor() {
        //TODO need a mapper for this
        this.container = Container.instance;
        this.id = "";
        this.title = "";
        this.description = "";
        this.category = "";
        this.lifespan = 0;
        this.volume = 0;
        this.weight = 0;
        this.module = "";
        this.charges = -1;
    }

    static map(data) {
        let item = new Item();
        item.category = data.category;
        item.description = data.description;
        item.lifespan = data.lifespan;
        item.module = data.module;
        item.title = data.title;
        item.volume = data.volume;
        item.weight = data.weight;
        item.charges = data.charges;
        return item;
    }

    use() {
        let mod = this.container.get(this.module) as ItemModule;
        mod.use();

        if (this.charges !== -1) {
            if (this.charges > 0) {
                if (this.charges === 1) {
                    let player = this.container.get(Player) as Player;
                    player.inventory.removeItem(this);
                }
                
                this.charges -= 1;
            }


        }
    }
}