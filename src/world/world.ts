import { inject } from 'aurelia-framework';
import { Chunk } from './chunk';
import { Perlin, Random, Vector } from '../helpers';

@inject(Perlin)
export class World {
    public chunks: Chunk[][];
    public worldSize: Vector;
    public chunkSize: Vector;
    public seed: number;
    private perlin: Perlin;

    constructor(perlin) {
        this.perlin = perlin;
        this.worldSize = new Vector(2, 2);
        this.chunkSize = new Vector(50, 38);
        this.chunks = [];
        this.seed = new Random(Math.floor(Math.random() * 32000)).nextDouble();

    }

    generateWorld() {
        this.perlin.seed(this.seed);

        for (let y = 0; y < this.worldSize.y; y++) {
            this.chunks[y] = [];
            for (let x = 0; x < this.worldSize.x; x++) {
                this.chunks[y][x] = new Chunk(new Vector(x, y), new Vector(this.chunkSize.x, this.chunkSize.y));
            }
        }
    }
}