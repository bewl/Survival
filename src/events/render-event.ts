import {Tile} from '../tile/tile';

export class RenderEvent {
    symbols: Tile[][];
    scaleX: number;

    constructor(symbols: Tile[][], scaleX:number) {
        this.scaleX = scaleX;
        this.symbols = symbols;
    }
}