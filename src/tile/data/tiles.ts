let tiles = [
    {
        id: "grass",
        color: "#66CD00",
        symbol: 183,
        movementCost: 50,
        weight: [{min:-500, max:null}],
        layer: 0,
    },
    {
        id: "tree",
        weight: [{min: -250, max: -212}, {min: -111, max: -75}, {min: 0, max: 25}, {min: 75, max: 90}],
        symbol: 165,
        color: '#017933',
        movementCost: -1,
        layer: 1
    },
    {
        id: "water",
        weight: [{min: -500, max: -300}],
        symbol: 126,
        color: '#006994',
        movementCost: -1,
        layer: 1000
    }
];

export default tiles;