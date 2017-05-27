import { Container } from 'aurelia-framework';
import { Tile } from '../tile/tile';
import { Random, Perlin, Vector2 } from '../helpers';
import tiles from '../tile/data/tiles';
const TileData = tiles;

export class Chunk {
    public tiles: Tile[][];
    public seed: number;
    public worldPosition: Vector2;
    public chunkSize: Vector2;
    public position: Vector2 = null;

    private perlin: Perlin;

constructor(chunkSize: Vector2, position: Vector2 = new Vector2(), worldPosition?: Vector2) {
        this.chunkSize = chunkSize;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.tiles = [];
        this.position = position;
        this.worldPosition = worldPosition ? worldPosition : new Vector2((this.position.x * this.chunkSize.x), (position.y * this.chunkSize.y));
    }

    seedChunk() {
        if (this.position != null) {

        }
        //WRITE SOME DAMN COMMENTS YOU IDIOT WTF IS THIS 
        let weightMod = 100; //modifier to perlin noise result
        let weightRange = weightMod * 3.0; //used to modify normalized weight ranges for tiles to correspond to the modified perline noise result
        let perlinDivisor = 20; 

        let weightMap = [];

        TileData.forEach(tile => {
            //We are modifying the weight of the tile to correspond with the weightMod being applied to the perlin noise result.
            let min: number = tile.weight.min == null ? null : (tile.weight.min * weightRange) - weightMod;
            let max: number = tile.weight.max == null ? null : (tile.weight.max * weightRange) - weightMod;
            weightMap.push({ 
                id: tile.id, 
                random: tile.random, 
                randomPercent: tile.randomPercent, 
                layer: tile.layer, 
                weight: { 
                    min: min, 
                    max: max 
                }
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
                let tileWeight = Math.ceil(this.perlin.simplex2((x + this.worldPosition.x) / perlinDivisor, (y + this.worldPosition.y) / perlinDivisor) * weightMod);
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
                            let rnd = new Random((this.perlin.seedValue * 100) + tileWeight * 10000000);
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

                let tile = new Tile(new Vector2(x, y), new Vector2(x + this.worldPosition.x, y + this.worldPosition.y), tileWeight);

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

    getTileByWorldPosition(position: Vector2, chunkSize?: Vector2) {
        let size = chunkSize || this.chunkSize;
        let targetTileX = Math.floor(position.x % size.x);
        let targetTileY = Math.floor(position.y % size.y);

        let targetTile = this.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}
