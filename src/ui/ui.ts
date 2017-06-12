import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Tile} from '../tile/tile';
@inject(EventAggregator)
export class UI {
    eventAggregator: EventAggregator;
    currentTile: Tile;
    selectedTiles: Tile[] = [];

    constructor(ea: EventAggregator) {
        this.eventAggregator = ea;
        
        ea.subscribe("TileInfo", (tile: Tile) => {
            this.currentTile = tile;
        });
    }
    selectTile(tile: Tile) {
        this.selectedTiles.push(tile);
    }

    get isSelecting() {
        return this.selectedTiles.length > 0;
    }

    deselectTiles() {
        this.selectedTiles.forEach(tile => {
            tile.isSelected = false;
        });

        this.selectedTiles = [];
    }
}