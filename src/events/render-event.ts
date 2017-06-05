import {Tile} from '../tile/tile';
import { Vector2 } from '../helpers'; 

export class RenderEvent {
    symbols: Tile[][];
    viewportSize: Vector2;

    constructor(symbols: Tile[][], viewportSize: Vector2) {
        this.symbols = symbols;
        this.viewportSize = viewportSize;
    }
}