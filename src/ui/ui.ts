import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Tile} from '../tile/tile';
@inject(EventAggregator)
export class UI {
    eventAggregator: EventAggregator;
    currentTile: Tile;

    constructor(ea: EventAggregator) {
        this.eventAggregator = ea;
        
        ea.subscribe("TileInfo", (tile: Tile) => {
            this.currentTile = tile;
        })
    }
}