import { Container } from 'aurelia-framework';
import { Tile } from '../tile/tile';
import { Random, Perlin, Vector2 } from '../helpers';
import tileData from '../tile/data/tiles';
const TileData = tileData;

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

        this.seedChunk();
    }

    seedChunk() {
        let weightMap = this.generateWeightMap();
        let distanceBuffers = [];

        for (let y = 0; y < this.chunkSize.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.chunkSize.x; x++) {
                let worldPosition = new Vector2(x + this.worldPosition.x, y + this.worldPosition.y);

                let tile = this.generateTile(worldPosition, this.position, weightMap);
                
                this.tiles[y][x] = tile;
            }
        }
    }

    generateWeightMap() {
        let weightMap = [];

        TileData.tiles.forEach(tile => {
            //We are modifying the weight of the tile to correspond with the weightMod being applied to the perlin noise result.
            let min: number = tile.weight.min == null ? null : (tile.weight.min * tileData.weightRange) - tileData.weightMod;
            let max: number = tile.weight.max == null ? null : (tile.weight.max * tileData.weightRange) - tileData.weightMod;
            weightMap.push({
                id: tile.id,
                random: tile.random,
                randomPercent: tile.randomPercent,
                layer: tile.layer,
                //distanceBuffer: tile.,
                weight: {
                    min: min,
                    max: max
                }
            });
        });

        return weightMap.sort((a, b) => {
            if (a.layer > b.layer) {
                return -1;
            } else if (a.layer < b.layer) {
                return 1;
            }
            return 0;
        });
    }

    generateTile(worldPosition: Vector2, chunkPosition: Vector2, weightMap: any[]): Tile {
        let perlinDivisor = 40;

        let tileWeight = Math.ceil(this.perlin.simplex2(worldPosition.x / perlinDivisor, worldPosition.y / perlinDivisor) * TileData.weightMod);
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
                if (tile.randomPercent != null && tile.randomPercent != 0) {
                    let show = true;
                    let rnd = new Random((this.perlin.seedValue * parseInt('' + worldPosition.x + worldPosition.y)) + tileWeight * 10000000);
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

        tileType = TileData.tiles.find(tile => tile.id == tileData.id);

        let tile: Tile = new Tile(chunkPosition, new Vector2(worldPosition.x, worldPosition.y), tileWeight);

        tile.movementCost = tileType.movementCost;
        tile.title = tileType.title;

        if (!tile.color)
            tile.color = tileType.color;

        if (!tile.symbol)
            tile.symbol = String.fromCharCode(tileType.symbol);

        return tile;
    }

    getTileByWorldPosition(position: Vector2, chunkSize?: Vector2) {
        let size = chunkSize || this.chunkSize;
        let targetTileX = Math.floor(position.x % size.x);
        let targetTileY = Math.floor(position.y % size.y);

        let targetTile = this.tiles[targetTileY][targetTileX];

        return targetTile;
    }
}
