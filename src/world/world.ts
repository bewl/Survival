import { inject } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Perlin, Random, Vector } from '../helpers';

@inject(Perlin)
export class World {
    public chunks: Chunk[][];
    public worldSizeX: number;
    public worldSizeY: number;
    public chunkSizeX: number;
    public chunkSizeY: number;
    public seed: number;
    private perlin: Perlin;

    constructor(perlin) {
        this.perlin = perlin;
        this.worldSizeX = 4;
        this.worldSizeY = 4;
        this.chunkSizeX = 50;
        this.chunkSizeY = 38;
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();

    }

    generateWorld() {
        this.perlin.seed(this.seed);

        for (var y = 0; y < this.worldSizeX; y++) {
            this.chunks[y] = [];
            for (var x = 0; x < this.worldSizeY; x++) {
                debugger;
                this.chunks[y][x] = new Chunk(new Vector(x, y), new Vector(this.chunkSizeX, this.chunkSizeY));
            }
        }
    }
}