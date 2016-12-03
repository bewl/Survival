import { Container } from 'aurelia-framework';
import { Tile } from '../tile/tile';
import { Random, Perlin, Vector } from '../helpers';
import tiles from '../tile/data/tiles';
const TileData = tiles;

export class Chunk {
    public tiles: Tile[][];
    public seed: number;
    public worldPosition: Vector;
    public chunkSize: Vector;
    public position: Vector = null;

    private perlin: Perlin;

    constructor(chunkSize: Vector, position: Vector = new Vector(), worldPosition?: Vector) {
        this.chunkSize = chunkSize;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.tiles = [];
        this.position = position;
        this.worldPosition = worldPosition ? worldPosition : new Vector((this.position.x * this.chunkSize.x), (position.y * this.chunkSize.y));
    }

    seedChunk() {
        if(this.position != null) {

        }
        for (let y = 0; y < this.chunkSize.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.chunkSize.x; x++) {

                let tileWeight = Math.ceil(this.perlin.simplex2((x + this.worldPosition.x) / 20, (y + this.worldPosition.y) / 20) * 500);

                let tileType = null;
                
                //TODO: This could be optimized
                tileType = TileData.filter(tile =>
                    tile.weight.some(weight =>
                        weight.max >= tileWeight && weight.min <= tileWeight
                    )
                ).sort((a, b) => {
                    if (a.layer > b.layer) {
                        return -1;
                    } else if (a.layer < b.layer) {
                        return 1;
                    }
                    return 0;
                })[0];

                let tile = new Tile(new Vector(x, y), new Vector(x + this.worldPosition.x, y + this.worldPosition.y), tileWeight);

                tile.movementCost = tileType.movementCost;
                tile.title = tileType.title;

                if (!tile.color)
                    tile.color = tileType.color;

                if (!tile.symbol)
                    tile.symbol = String.fromCharCode(tileType.symbol);

                this.tiles[y][x] = tile;
            }


        }
    }

    getTileByWorldPosition(position: Vector, chunkSize?: Vector) {
        let size = chunkSize || this.chunkSize;
        let targetTileX = Math.floor(position.x % size.x);
        let targetTileY = Math.floor(position.y % size.y);

        let targetTile = this.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}
