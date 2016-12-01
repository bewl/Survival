import { Tile } from '../tile/tile';
import { Random, Perlin, Vector } from '../helpers';
import tiles from '../tile/data/tiles';
const TileData = tiles;

export class Chunk {
    public tiles: Tile[][];
    public seed: number;
    public chunkSizeX: number;
    public chunkSizeY: number;

    private perlin: Perlin;
    constructor(seed) {
        this.chunkSizeX = 50;
        this.chunkSizeY = 38;
        this.perlin = new Perlin();
        this.tiles = [];
        this.seed = 329048; //new Random(Math.floor(Math.random() * 32000)).nextDouble();

        this.seedChunk();
    }

    seedChunk() {
        this.perlin.seed(this.seed);

        for (var y = 0; y < this.chunkSizeY; y++) {
            this.tiles[y] = [];
            for (var x = 0; x < this.chunkSizeX; x++) {
                

                let value = this.perlin.simplex2(x / 50, y / 50) * 500;

                let tileType = null;
                if (value < 100) {
                    tileType = TileData.find(tile => tile.title === 'grass');
                }

                if(value >= 100 && value < 200) {
                    tileType = TileData.find(tile => tile.title === 'slope');
                }

                if(value >= 200 && value < 300) {
                    tileType = TileData.find(tile => tile.title === 'slope2');
                }

                if(value >= 300 && value < 400) {
                    tileType = TileData.find(tile => tile.title === 'slope3');
                }
                if(value >= 400 && value < 500) {
                    tileType = TileData.find(tile => tile.title === 'ridge');
                }
                if(value >= 500 && value < 200) {
                    tileType = TileData.find(tile => tile.title === 'slope');
                }
                let tile = new Tile();
                tile.color = tileType.color;
                tile.movementCost = tileType.movementCost;
                tile.position = new Vector(x, y);
                tile.title = tileType.title;
                tile.symbol = String.fromCharCode(tileType.symbol);
                this.tiles[y][x] = tile;
            }


        }
    }
}
