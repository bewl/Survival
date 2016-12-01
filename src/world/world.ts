import {Chunk} from './chunk';
export class World {
    public chunks: Chunk[][];
    public worldSizeX: number;
    public worldSizeY: number;
    constructor() {
        this.worldSizeX = 1;
        this.worldSizeY = 1;
        this.chunks = [];

    }   

    generateWorld() {
        for (var y = 0; y < this.worldSizeX; y++) {
            this.chunks[y] = [];
            for (var x = 0; x < this.worldSizeY; x++) {
                this.chunks[y][x] = new Chunk(0);
            }
        }
    }
}