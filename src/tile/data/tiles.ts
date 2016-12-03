let tiles = [
    {
        id: "grass",
        color: "#015D52",
        symbol: 183,
        movementCost: 50,
        weight: [{min:-500, max:100}],
        layer: 0,
    },
    {
        id: "slope",
        color: "#308446",
        symbol: 711,
        movementCost: 75,
        weight: [{min:101, max:200}],
        layer: 0,
    },
    {
        id: "slope2",
        color: "#BDECB6",
        symbol: 711,
        movementCost: 100,
        weight: [{min:201, max:300}],
        layer: 0,
    },
    {
        id: "slope3",
        color: "#BDECB6",
        symbol: 711,
        movementCost: 150,
        weight: [{min:301, max:400}],
        layer: 0,
    },
    {
        id: "ridge",
        color: "#ffffff",
        symbol: 710,
        movementCost: 75,
        weight: [{min:401, max:500}],
        layer: 0,
    },
    {
        id: "tree",
        weight: [{min: -289, max: -212}, {min: -111, max: -75}, {min: 0, max: 25}, {min: 75, max: 90}],
        symbol: 165,
        color: '#017933',
        movementCost: -1,
        layer: 1
    },
    {
        id: "water",
        weight: [{min: -500, max: -400}],
        symbol: 126,
        color: '#84C3BE',
        movementCost: -1,
        layer: 1
    }
];

export default tiles;