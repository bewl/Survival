const WATER_MAX = 0.1;
let tiles = [
    {
        id: "grass",
        color: "#66CD00",
        symbol: 183,
        movementCost: 50,
        weight: {min:0.07, max:null},
        random: false,
        randomPercent: 0,
        layer: 0,
    },
    {
        id: "tree",
        weight: {min: WATER_MAX, max: 0.43},
        random: true,
        randomPercent: 0.35,
        symbol: 165,
        color: '#017933',
        movementCost: -1,
        layer: 1
    },

    // {
    //     id: "stone",
    //     weight: {min: WATER_MAX, max: 0.43},
    //     random: true,
    //     randomPercent: 0.05,
    //     symbol: 156,
    //     color: '#b8c0c8',
    //     movementCost: -1,
    //     layer: 1.1
    // },

    {
        id: "water",
        weight: {min: null, max: WATER_MAX},
        random: false,
        randomPercent: 0,
        symbol: 126,
        color: '#006994',
        movementCost: -1,
        layer: 1000
    }
];

export default tiles;