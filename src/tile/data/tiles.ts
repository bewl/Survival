let tiles = [
    {
        id: "grass",
        color: "#66CD00",
        symbol: 183,
        movementCost: 50,
        weight: [{min:0.07, max:null}],
        layer: 0,
    },
    {
        id: "tree",
        weight: [{min: 0.10, max: 0.19}, {min: 0.23, max: 0.26}, {min: 0.35, max: 0.40}, {min: 0.45, max: 0.50}],
        symbol: 165,
        color: '#017933',
        movementCost: -1,
        layer: 1
    },
    {
        id: "water",
        weight: [{min: null, max: 0.07}],
        symbol: 126,
        color: '#006994',
        movementCost: -1,
        layer: 1000
    }
];

export default tiles;