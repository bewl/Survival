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
        if (this.position != null) {

        }

        let weightMod = 750;
        let weightRange = weightMod - (-Math.abs(weightMod));
        let modX = 20;
        let modY = 20;

        let weightMap = [];

        TileData.forEach(tile => {
            tile.weight.forEach(weight => {
                weightMap.push({ id: tile.id, weight: {min: weight.min == null ? null : (weight.min * weightRange) + (-Math.abs(weightMod)), max: weight.max == null ? null : (weight.max * weightRange) + (-Math.abs(weightMod))}, layer: tile.layer });
            });
        });

        weightMap = weightMap.sort((a, b) => {
            if (a.layer > b.layer) {
                return -1;
            } else if (a.layer < b.layer) {
                return 1;
            }
            return 0;
        });

        for (let y = 0; y < this.chunkSize.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.chunkSize.x; x++) {

                let tileWeight = Math.ceil(this.perlin.simplex2((x + this.worldPosition.x) / modX, (y + this.worldPosition.y) / modY) * weightMod);
                
                let tileType = null;

                //TODO: This could be optimized
                let tileData = weightMap.find(tile => {
                        return (tile.weight.max >= tileWeight || tile.weight.max == null)
                            && (tile.weight.min <= tileWeight || tile.weight.min == null);
                });
                tileType = TileData.find(tile => tile.id == tileData.id);

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
