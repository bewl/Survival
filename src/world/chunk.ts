import { Container } from 'aurelia-framework';
import { Tile } from '../tile/tile';
import { Random, Perlin, Vector2, Bounds } from '../helpers';
import tileData from '../tile/data/tiles';
const TileData = tileData;

export class Chunk {
    public tiles: Tile[][];
    public seed: number;
    public worldPosition: Vector2;
    public chunkSize: Vector2;
    public position: Vector2 = null;
    public chunkId: string;
    private perlin: Perlin;

    constructor(chunkSize: Vector2, position: Vector2 = new Vector2(), worldPosition?: Vector2) {
        this.chunkSize = chunkSize;
        this.perlin = Container.instance.get(Perlin) as Perlin;
        this.tiles = [];
        this.position = position;
        this.chunkId = position.toString();
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
                let chunkIndex = new Vector2(x, y);
                let tile = this.generateTile(worldPosition, this.position, weightMap, chunkIndex);

                this.tiles[y][x] = tile;
            }
        }
    }
    getWorldPositionBounds() {
        let l = this.tiles[0][0].worldPosition;
        let r = this.tiles[this.tiles.length - 1][this.chunkSize.x - 1].worldPosition;
        return new Bounds(l, r);
    }

    getTileSubset(bounds: Bounds): Tile[][] {
        let chunkBounds = this.getWorldPositionBounds();

        if (bounds.topLeft.y < chunkBounds.topLeft.y)
            bounds.topLeft.y = chunkBounds.topLeft.y;
        if (bounds.topLeft.x < chunkBounds.topLeft.x)
            bounds.topLeft.x = chunkBounds.topLeft.x;

        if (bounds.bottomRight.y > chunkBounds.bottomRight.y)
            bounds.bottomRight.y = chunkBounds.bottomRight.y
        if (bounds.bottomRight.x > chunkBounds.bottomRight.x)
            bounds.bottomRight.x = chunkBounds.bottomRight.x
        
        let allInsideBounds = chunkBounds.isInsideBounds(bounds);

        if(allInsideBounds)
            return this.tiles;

        let startTile = this.getTileByWorldPosition(bounds.topLeft);
        let endTile = this.getTileByWorldPosition(bounds.bottomRight);
        
        let tiles: Tile[][] = [];
        for(let y = startTile.chunkIndex.y; y <= endTile.chunkIndex.y; y++) {
            let yPos = y - startTile.chunkIndex.y;
            tiles[yPos] = [];
            for(let x = startTile.chunkIndex.x; x <= endTile.chunkIndex.x; x++) {
                let xPos = x - startTile.chunkIndex.x;
                tiles[yPos][xPos] = this.tiles[y][x];
            }
        }

        return tiles;
    }

    generateWeightMap() {
        let weightMap = [];

        TileData.tiles.forEach(tile => {
            //We are modifying the weight of the tile to correspond with the weightMod being applied to the perlin noise result.
            let min: number = tile.weight.min == null ? null : (tile.weight.min * TileData.weightRange) - TileData.weightMod;
            let max: number = tile.weight.max == null ? null : (tile.weight.max * TileData.weightRange) - TileData.weightMod;
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

    getTileByWorldPosition(position: Vector2, chunkSize?: Vector2) {
        let size = chunkSize || this.chunkSize;

        
        let targetTileX =  Math.floor(Math.abs(position.x) % this.chunkSize.x);
        let targetTileY = Math.floor(Math.abs(position.y) % this.chunkSize.y);
        
        if(Math.sign(position.x) == -1) {
            targetTileX = targetTileX ? this.chunkSize.x - Math.abs(targetTileX) : 0;
        }

        if(Math.sign(position.y) == -1) {
            targetTileY = targetTileY ? this.chunkSize.y - Math.abs(targetTileY) : 0;
        }

        let targetTile = this.tiles[targetTileY][targetTileX];

        return targetTile;
    }

    generateTile(worldPosition: Vector2, chunkPosition: Vector2, weightMap: any[], chunkIndex: Vector2): Tile {
        let perlinDivisor = 100;

        let tileWeight = Math.ceil(this.perlin.simplex2(worldPosition.x / perlinDivisor, worldPosition.y / perlinDivisor) * TileData.weightMod);
        let tileType = null;

        let maxLayer = 1000;
        let currentLayer = maxLayer;
        //TODO: This could be optimized
        let tileData;
        let seed = this.perlin.seedValue * parseInt('' + Math.abs(worldPosition.x % 324 + worldPosition.y  % 32422)) + tileWeight * 10000000;
        tileData = weightMap.find(tile => {
            //tileweight falls in tile weight range
            if (((tile.weight.max >= tileWeight) || tile.weight.max == null)
                && ((tile.weight.min <= tileWeight) || tile.weight.min == null)) {
                //is this tile randomized to show?
                if (tile.randomPercent != null && tile.randomPercent != 0) {
                    let show = true;
                    let rnd = new Random(seed);
                    let num = rnd.nextInt(1, 100);
                    show = num <= Math.abs(tile.randomPercent) * 100;
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

        let tile: Tile = new Tile(chunkPosition, new Vector2(worldPosition.x, worldPosition.y), tileWeight, chunkIndex);

        tile.movementCost = tileType.movementCost;
        tile.title = tileType.title;
        tile.image = tileType.image;

        if (!tile.color)
            tile.color = tileType.color;

        if (!tile.symbol)
            tile.symbol = String.fromCharCode(tileType.symbol);

        return tile;
    }


}
