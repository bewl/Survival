const WATER_MAX = 0.1;
let tileData = {
    weightMod: 20, //modifier to perlin noise result
    weightRange: 20 * 3, //used to modify normalized weight ranges for tiles to correspond to the modified perline noise result
    tiles: [
        {
            id: "grass",
            color: "#66CD00",
            symbol: 183,
            movementCost: 50,
            weight: { min: WATER_MAX, max: null },
            distanceBuffer: 1000,
            random: false,
            randomPercent: 0,
            layer: 0,
        },
        {
            id: "tree",
            weight: { min: WATER_MAX + .003, max: 0.35 },
            random: false,
            randomPercent: 0,
            symbol: 165,
            //image: 'tree.png',
            color: '#228B22',
            movementCost: -1,
            layer: 1
        },

        {
            id: "stone",
            weight: { min: 0.40, max: 0.5 },
            random: true,
            randomPercent: 0.01,
            symbol: 186,
            color: '#b8c0c8',
            movementCost: -1,
            layer: 1.1
        },

        {
            id: "water",
            weight: { min: null, max: WATER_MAX },
            random: false,
            randomPercent: 0,
            symbol: 126,
            color: '#1E90FF',
            movementCost: -1,
            layer: 1000
        }
    ]
};

export default tileData;