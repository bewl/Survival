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
        //WRITE SOME DAMN COMMENTS YOU IDIOT WTF IS THIS 
        let weightMod = 100; //modifier to perlin noise result
        let weightRange = weightMod * 2; //used to modify normalized weight ranges for tiles to correspond to the modified perline noise result
        let modX = 140;
        let modY = 140;

        let weightMap = [];

        TileData.forEach(tile => {
            //We are modifying the weight of the tile to correspond with the weightMod being applied to the perlin noise result.
            weightMap.push({ id: tile.id, random: tile.random, randomPercent: tile.randomPercent, weight: { min: tile.weight.min == null ? null : (tile.weight.min * weightRange) - weightMod, max: tile.weight.max == null ? null : (tile.weight.max * weightRange) - weightMod }, layer: tile.layer });
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

                let maxLayer = 1000;
                let currentLayer = maxLayer;
                //TODO: This could be optimized
                let tileData;
                tileData = weightMap.find(tile => {
                    //tileweight falls in tile weight range
                    if (((tile.weight.max >= tileWeight) || tile.weight.max == null)
                        && ((tile.weight.min <= tileWeight) || tile.weight.min == null)) {
                        //is this tile randomized to show?
                        if (tile.random === true) {
                            let show = true;
                            let rnd = new Random(this.perlin.seedValue + tileWeight * 1000000);
                            let num = rnd.nextInt(1, 100);
                            show = num <= tile.randomPercent * 100;
                            //If we are not going to randomly show the tile then
                            //We need to go down to the NEXT layer, and not the next decrement of the same layer 
                            //(e.g. layer 2.1 is not showing, we need to go to Layer 0.* and not Layer 1.0)

                            return show;
                        }
                            return true;
                    }

                    return false;

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
