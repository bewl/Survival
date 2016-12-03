define('helpers',["require", "exports"], function (require, exports) {
    "use strict";
    function GetEnumElements(e) {
        return Object.keys(e).map(function (a) { return e[a]; }).filter(function (a) { return typeof a === 'string'; });
    }
    exports.GetEnumElements = GetEnumElements;
    var Guid = (function () {
        function Guid() {
        }
        Guid.newGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        return Guid;
    }());
    exports.Guid = Guid;
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        Vector.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        ;
        return Vector;
    }());
    exports.Vector = Vector;
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        Vector3.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        ;
        Vector3.prototype.dot3 = function (x, y, z) {
            return this.x * x + this.y * y + this.z * z;
        };
        return Vector3;
    }());
    exports.Vector3 = Vector3;
    var Random = (function () {
        function Random(seed) {
            this.seed = seed;
        }
        Random.prototype.next = function (min, max) {
            max = max || 0;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280;
            return min + rnd * (max - min);
        };
        Random.prototype.nextInt = function (min, max) {
            return Math.round(this.next(min, max));
        };
        Random.prototype.nextDouble = function () {
            return this.next(0, 1);
        };
        Random.prototype.pick = function (collection) {
            return collection[this.nextInt(0, collection.length - 1)];
        };
        return Random;
    }());
    exports.Random = Random;
    var Perlin = (function () {
        function Perlin() {
            this.grad3 = [new Vector3(1, 1, 0), new Vector3(-1, 1, 0), new Vector3(1, -1, 0), new Vector3(-1, -1, 0),
                new Vector3(1, 0, 1), new Vector3(-1, 0, 1), new Vector3(1, 0, -1), new Vector3(-1, 0, -1),
                new Vector3(0, 1, 1), new Vector3(0, -1, 1), new Vector3(0, 1, -1), new Vector3(0, -1, -1)];
            this.p = [151, 160, 137, 91, 90, 15,
                131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
                190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
                88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
                77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
                102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
                135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
                5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
                251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
                49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
            this.perm = new Array(512);
            this.gradP = new Array(512);
            this.seed(0);
        }
        Perlin.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        ;
        Perlin.prototype.dot3 = function (x, y, z) {
            return this.x * x + this.y * y + this.z * z;
        };
        ;
        Perlin.prototype.seed = function (seed) {
            this.seedValue = seed;
            if (seed > 0 && seed < 1) {
                seed *= 65536;
            }
            seed = Math.floor(seed);
            if (seed < 256) {
                seed |= seed << 8;
            }
            for (var i = 0; i < 256; i++) {
                var v = void 0;
                if (i & 1) {
                    v = this.p[i] ^ (seed & 255);
                }
                else {
                    v = this.p[i] ^ ((seed >> 8) & 255);
                }
                this.perm[i] = this.perm[i + 256] = v;
                this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
            }
        };
        ;
        Perlin.prototype.simplex2 = function (xin, yin) {
            var F2 = 0.5 * (Math.sqrt(3) - 1);
            var G2 = (3 - Math.sqrt(3)) / 6;
            var n0, n1, n2;
            var s = (xin + yin) * F2;
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var t = (i + j) * G2;
            var x0 = xin - i + t;
            var y0 = yin - j + t;
            var i1, j1;
            if (x0 > y0) {
                i1 = 1;
                j1 = 0;
            }
            else {
                i1 = 0;
                j1 = 1;
            }
            var x1 = x0 - i1 + G2;
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1 + 2 * G2;
            var y2 = y0 - 1 + 2 * G2;
            i &= 255;
            j &= 255;
            var gi0 = this.gradP[i + this.perm[j]];
            var gi1 = this.gradP[i + i1 + this.perm[j + j1]];
            var gi2 = this.gradP[i + 1 + this.perm[j + 1]];
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) {
                n0 = 0;
            }
            else {
                t0 *= t0;
                n0 = t0 * t0 * gi0.dot2(x0, y0);
            }
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) {
                n1 = 0;
            }
            else {
                t1 *= t1;
                n1 = t1 * t1 * gi1.dot2(x1, y1);
            }
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) {
                n2 = 0;
            }
            else {
                t2 *= t2;
                n2 = t2 * t2 * gi2.dot2(x2, y2);
            }
            return 70 * (n0 + n1 + n2);
        };
        ;
        Perlin.prototype.simplex3 = function (xin, yin, zin) {
            var F3 = 1 / 3;
            var G3 = 1 / 6;
            var n0, n1, n2, n3;
            var s = (xin + yin + zin) * F3;
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var k = Math.floor(zin + s);
            var t = (i + j + k) * G3;
            var x0 = xin - i + t;
            var y0 = yin - j + t;
            var z0 = zin - k + t;
            var i1, j1, k1;
            var i2, j2, k2;
            if (x0 >= y0) {
                if (y0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                }
                else if (x0 >= z0) {
                    i1 = 1;
                    j1 = 0;
                    k1 = 0;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                }
                else {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 1;
                    j2 = 0;
                    k2 = 1;
                }
            }
            else {
                if (y0 < z0) {
                    i1 = 0;
                    j1 = 0;
                    k1 = 1;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                }
                else if (x0 < z0) {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 0;
                    j2 = 1;
                    k2 = 1;
                }
                else {
                    i1 = 0;
                    j1 = 1;
                    k1 = 0;
                    i2 = 1;
                    j2 = 1;
                    k2 = 0;
                }
            }
            var x1 = x0 - i1 + G3;
            var y1 = y0 - j1 + G3;
            var z1 = z0 - k1 + G3;
            var x2 = x0 - i2 + 2 * G3;
            var y2 = y0 - j2 + 2 * G3;
            var z2 = z0 - k2 + 2 * G3;
            var x3 = x0 - 1 + 3 * G3;
            var y3 = y0 - 1 + 3 * G3;
            var z3 = z0 - 1 + 3 * G3;
            i &= 255;
            j &= 255;
            k &= 255;
            var gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
            var gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
            var gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
            var gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];
            var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
            if (t0 < 0) {
                n0 = 0;
            }
            else {
                t0 *= t0;
                n0 = t0 * t0 * gi0.dot3(x0, y0, z0);
            }
            var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
            if (t1 < 0) {
                n1 = 0;
            }
            else {
                t1 *= t1;
                n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
            }
            var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
            if (t2 < 0) {
                n2 = 0;
            }
            else {
                t2 *= t2;
                n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
            }
            var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
            if (t3 < 0) {
                n3 = 0;
            }
            else {
                t3 *= t3;
                n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
            }
            return 32 * (n0 + n1 + n2 + n3);
        };
        ;
        Perlin.prototype.fade = function (t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        };
        Perlin.prototype.lerp = function (a, b, t) {
            return (1 - t) * a + t * b;
        };
        Perlin.prototype.perlin2 = function (x, y) {
            var X = Math.floor(x), Y = Math.floor(y);
            x = x - X;
            y = y - Y;
            X = X & 255;
            Y = Y & 255;
            var n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
            var n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
            var n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
            var n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
            var u = this.fade(x);
            return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
        };
        ;
        Perlin.prototype.perlin3 = function (x, y, z) {
            var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
            x = x - X;
            y = y - Y;
            z = z - Z;
            X = X & 255;
            Y = Y & 255;
            Z = Z & 255;
            var n000 = this.gradP[X + this.perm[Y + this.perm[Z]]].dot3(x, y, z);
            var n001 = this.gradP[X + this.perm[Y + this.perm[Z + 1]]].dot3(x, y, z - 1);
            var n010 = this.gradP[X + this.perm[Y + 1 + this.perm[Z]]].dot3(x, y - 1, z);
            var n011 = this.gradP[X + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x, y - 1, z - 1);
            var n100 = this.gradP[X + 1 + this.perm[Y + this.perm[Z]]].dot3(x - 1, y, z);
            var n101 = this.gradP[X + 1 + this.perm[Y + this.perm[Z + 1]]].dot3(x - 1, y, z - 1);
            var n110 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z]]].dot3(x - 1, y - 1, z);
            var n111 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);
            var u = this.fade(x);
            var v = this.fade(y);
            var w = this.fade(z);
            return this.lerp(this.lerp(this.lerp(n000, n100, u), this.lerp(n001, n101, u), w), this.lerp(this.lerp(n010, n110, u), this.lerp(n011, n111, u), w), v);
        };
        ;
        return Perlin;
    }());
    exports.Perlin = Perlin;
});

define('inventory/inventory',["require", "exports", '../item/item', '../helpers'], function (require, exports, item_1, helpers_1) {
    "use strict";
    var Inventory = (function () {
        function Inventory() {
            this._items = [];
            this._volumeCap = null;
            this._weightCap = null;
            this.currentVolume = 0;
            this.currentWeight = 0;
            this.weightCap = 60;
            this.volumeCap = 15;
        }
        Object.defineProperty(Inventory.prototype, "items", {
            get: function () {
                return this._items;
            },
            set: function (value) {
                this._items = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Inventory.prototype, "volumeCap", {
            get: function () {
                return this._volumeCap;
            },
            set: function (value) {
                this._volumeCap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Inventory.prototype, "weightCap", {
            get: function () {
                return this._weightCap;
            },
            set: function (value) {
                this._weightCap = value;
            },
            enumerable: true,
            configurable: true
        });
        Inventory.prototype.getItemById = function (id) {
            return this.items.find(function (item) { return item.id === id; });
        };
        Inventory.prototype.addItem = function (item) {
            this.currentVolume += item.stats.volume;
            this.currentWeight += item.stats.weight;
            var i = Object.assign(new item_1.Item(), item);
            i.id = helpers_1.Guid.newGuid();
            this.items.push(i);
        };
        Inventory.prototype.removeItem = function (item) {
            this.currentVolume -= item.stats.volume;
            this.currentWeight -= item.stats.weight;
            this.items = this.items.filter(function (i) { return i.id !== item.id; });
        };
        return Inventory;
    }());
    exports.Inventory = Inventory;
});

define('actor/health',["require", "exports"], function (require, exports) {
    "use strict";
    var Health = (function () {
        function Health() {
            this.head = 100;
            this.torso = 100;
            this.leftArm = 100;
            this.rightArm = 100;
            this.leftHand = 100;
            this.rightHand = 100;
            this.leftLeg = 100;
            this.rightLeg = 100;
            this.leftFoot = 100;
            this.rightFoot = 100;
            this.parts = [
                { id: 'head', description: 'Head', value: 100 },
                { id: 'torso', description: 'Torso', value: 100 },
                { id: 'leftArm', description: 'Left Arm', value: 100 },
                { id: 'rightArm', description: 'Right Arm', value: 100 },
                { id: 'leftHand', description: 'Left Hand', value: 100 },
                { id: 'rightHand', description: 'Right Hand', value: 100 },
                { id: 'leftLeg', description: 'Left Leg', value: 100 },
                { id: 'rightLeg', description: 'Right Leg', value: 100 },
                { id: 'leftFoot', description: 'Left Foot', value: 100 },
                { id: 'rightFoot', description: 'Right Foot', value: 100 },
            ];
        }
        Health.prototype.damage = function (partId, value) {
            var part = this.parts.find(function (p) { return p.id === partId; });
            part.value -= value;
        };
        Health.prototype.heal = function (partId, value) {
            var part = this.parts.find(function (p) { return p.id === partId; });
            part.value += value;
        };
        return Health;
    }());
    exports.Health = Health;
});

define('tile/tile',["require", "exports", '../inventory/inventory'], function (require, exports, inventory_1) {
    "use strict";
    var Tile = (function () {
        function Tile(chunkPosition, worldPosition, tileWeight) {
            this.worldPosition = worldPosition;
            this.chunkPosition = chunkPosition;
            this.inventory = new inventory_1.Inventory();
            this.isPlayer = false;
            this.tileWeight = tileWeight;
            this.generateData();
        }
        Tile.prototype.generateData = function () {
        };
        return Tile;
    }());
    exports.Tile = Tile;
});

define('tile/data/tiles',["require", "exports"], function (require, exports) {
    "use strict";
    var tiles = [
        {
            id: "grass",
            color: "#015D52",
            symbol: 183,
            movementCost: 50,
            weight: [{ min: -500, max: 100 }],
            layer: 0,
        },
        {
            id: "slope",
            color: "#308446",
            symbol: 711,
            movementCost: 75,
            weight: [{ min: 101, max: 200 }],
            layer: 0,
        },
        {
            id: "slope2",
            color: "#BDECB6",
            symbol: 711,
            movementCost: 100,
            weight: [{ min: 201, max: 300 }],
            layer: 0,
        },
        {
            id: "slope3",
            color: "#BDECB6",
            symbol: 711,
            movementCost: 150,
            weight: [{ min: 301, max: 400 }],
            layer: 0,
        },
        {
            id: "ridge",
            color: "#ffffff",
            symbol: 710,
            movementCost: 75,
            weight: [{ min: 401, max: 500 }],
            layer: 0,
        },
        {
            id: "tree",
            weight: [{ min: -289, max: -212 }, { min: -111, max: -75 }, { min: 0, max: 25 }, { min: 75, max: 90 }],
            symbol: 165,
            color: '#017933',
            movementCost: -1,
            layer: 1
        },
        {
            id: "water",
            weight: [{ min: -500, max: -400 }],
            symbol: 126,
            color: '#84C3BE',
            movementCost: -1,
            layer: 1
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = tiles;
});

define('world/chunk',["require", "exports", 'aurelia-framework', '../tile/tile', '../helpers', '../tile/data/tiles'], function (require, exports, aurelia_framework_1, tile_1, helpers_1, tiles_1) {
    "use strict";
    var TileData = tiles_1.default;
    var Chunk = (function () {
        function Chunk(chunkSize, position, worldPosition) {
            if (position === void 0) { position = new helpers_1.Vector(); }
            this.position = null;
            this.chunkSize = chunkSize;
            this.perlin = aurelia_framework_1.Container.instance.get(helpers_1.Perlin);
            this.tiles = [];
            this.position = position;
            this.worldPosition = worldPosition ? worldPosition : new helpers_1.Vector((this.position.x * this.chunkSize.x), (position.y * this.chunkSize.y));
        }
        Chunk.prototype.seedChunk = function () {
            if (this.position != null) {
            }
            for (var y = 0; y < this.chunkSize.y; y++) {
                this.tiles[y] = [];
                var _loop_1 = function(x) {
                    var tileWeight = Math.ceil(this_1.perlin.simplex2((x + this_1.worldPosition.x) / 20, (y + this_1.worldPosition.y) / 20) * 500);
                    var tileType = null;
                    tileType = TileData.filter(function (tile) {
                        return tile.weight.some(function (weight) {
                            return weight.max >= tileWeight && weight.min <= tileWeight;
                        });
                    }).sort(function (a, b) {
                        if (a.layer > b.layer) {
                            return -1;
                        }
                        else if (a.layer < b.layer) {
                            return 1;
                        }
                        return 0;
                    })[0];
                    var tile = new tile_1.Tile(new helpers_1.Vector(x, y), new helpers_1.Vector(x + this_1.worldPosition.x, y + this_1.worldPosition.y), tileWeight);
                    tile.movementCost = tileType.movementCost;
                    tile.title = tileType.title;
                    if (!tile.color)
                        tile.color = tileType.color;
                    if (!tile.symbol)
                        tile.symbol = String.fromCharCode(tileType.symbol);
                    this_1.tiles[y][x] = tile;
                };
                var this_1 = this;
                for (var x = 0; x < this.chunkSize.x; x++) {
                    _loop_1(x);
                }
            }
        };
        Chunk.prototype.getTileByWorldPosition = function (position, chunkSize) {
            var size = chunkSize || this.chunkSize;
            var targetTileX = Math.floor(position.x % size.x);
            var targetTileY = Math.floor(position.y % size.y);
            var targetTile = this.tiles[targetTileY][targetTileX];
            return targetTile;
        };
        return Chunk;
    }());
    exports.Chunk = Chunk;
});

define('world/world',["require", "exports", 'aurelia-framework', './chunk', '../helpers'], function (require, exports, aurelia_framework_1, chunk_1, helpers_1) {
    "use strict";
    var World = (function () {
        function World() {
            this.perlin = aurelia_framework_1.Container.instance.get(helpers_1.Perlin);
            this.worldSize = new helpers_1.Vector(2, 1);
            this.chunkSize = new helpers_1.Vector(50, 38);
            this.chunks = [];
            this.seed = new helpers_1.Random(Math.floor(Math.random() * 32000)).nextDouble();
            this.playerTile = null;
            this.generateSeed();
        }
        World.prototype.generateSeed = function () {
            this.perlin.seed(this.seed);
        };
        World.prototype.getChunkPositionFromTilePosition = function (position) {
            var chunk = new helpers_1.Vector();
            chunk.x = Math.floor(position.x / this.chunkSize.x);
            chunk.y = Math.floor(position.y / this.chunkSize.y);
            return chunk;
        };
        World.prototype.getChunk = function (position) {
            var chunk = null;
            if (this.chunks[position.y] && this.chunks[position.y][position.x]) {
                chunk = this.chunks[position.y][position.x];
            }
            else {
                chunk = new chunk_1.Chunk(new helpers_1.Vector(this.chunkSize.x, this.chunkSize.y), new helpers_1.Vector(position.x, position.y));
                chunk.seedChunk();
                if (!this.chunks[position.y])
                    this.chunks[position.y] = [];
                this.chunks[position.y][position.x] = chunk;
            }
            return chunk;
        };
        World.prototype.getChunks = function (start, end) {
            var numChunksX = end.x - start.x;
            var numChunksY = start.y - end.y;
            var chunks = [];
            for (var y = start.y; y <= end.y; y++) {
                chunks[y] = [];
                for (var x = start.x; x <= end.x; x++) {
                    if (this.chunks[y] && this.chunks[y][x]) {
                        chunks[y][x] = this.chunks[y][x];
                    }
                    else {
                        chunks[y][x] = new chunk_1.Chunk(new helpers_1.Vector(this.chunkSize.x, this.chunkSize.y), new helpers_1.Vector(x, y));
                        chunks[y][x].seedChunk();
                        if (!this.chunks[y])
                            this.chunks[y] = [];
                        this.chunks[y][x] = chunks[y][x];
                    }
                }
            }
            return chunks;
        };
        World.prototype.getTileByWorldPosition = function (position) {
            var targetChunkX = Math.floor(position.x / this.chunkSize.x);
            var targetChunkY = Math.floor(position.y / this.chunkSize.y);
            var targetTileX = Math.floor(position.x % this.chunkSize.x);
            var targetTileY = Math.floor(position.y % this.chunkSize.y);
            var targetChunk = null;
            var targetTile = null;
            if (this.chunks[targetChunkY]) {
                if (this.chunks[targetChunkY][targetChunkX]) {
                    targetChunk = this.chunks[targetChunkY][targetChunkX];
                }
            }
            if (targetChunk === null) {
                targetChunk = this.getChunk(new helpers_1.Vector(targetChunkX, targetChunkY));
            }
            targetTile = targetChunk.tiles[targetTileY][targetTileX];
            return targetTile;
        };
        return World;
    }());
    exports.World = World;
});

define('actor/actor',["require", "exports", 'aurelia-framework', '../world/world', '../inventory/inventory', './health'], function (require, exports, aurelia_framework_1, world_1, inventory_1, health_1) {
    "use strict";
    var Actor = (function () {
        function Actor() {
            this.inventory = null;
            this.world = aurelia_framework_1.Container.instance.get(world_1.World);
            this.inventory = new inventory_1.Inventory();
            this.health = new health_1.Health();
        }
        return Actor;
    }());
    exports.Actor = Actor;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('actor/monster',["require", "exports", './actor'], function (require, exports, actor_1) {
    "use strict";
    var Monster = (function (_super) {
        __extends(Monster, _super);
        function Monster() {
            _super.call(this);
        }
        Monster.prototype.attack = function () {
        };
        return Monster;
    }(actor_1.Actor));
    exports.Monster = Monster;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('camera',["require", "exports", 'aurelia-framework', './helpers', './world/world', './world/chunk'], function (require, exports, aurelia_framework_1, helpers_1, world_1, chunk_1) {
    "use strict";
    var Camera = (function () {
        function Camera(world) {
            this.position = null;
            this.viewportScale = new helpers_1.Vector(80, 32);
            this.scale = new helpers_1.Vector(2, 2);
            this.world = world;
            this.viewport = null;
        }
        Camera.prototype.move = function (position) {
            var startChunk = new helpers_1.Vector(position.x - Math.floor(this.viewportScale.x / 2), position.y - Math.floor(this.viewportScale.y / 2));
            this.updateViewport(startChunk, position);
            this.position = position;
        };
        Camera.prototype.setIsPlayer = function (tile) {
            var playerTile = this.viewport.getTileByWorldPosition(tile);
            playerTile.isPlayer = true;
        };
        Camera.prototype.updateViewport = function (startChunk, playerPosition) {
            this.viewport = new chunk_1.Chunk(new helpers_1.Vector(this.viewportScale.x, this.viewportScale.y), null, startChunk);
            this.viewport.seedChunk();
            var playerTile = this.viewport.tiles[Math.floor(this.viewportScale.y / 2)][Math.floor(this.viewportScale.x / 2)];
            playerTile.isPlayer = true;
        };
        Camera = __decorate([
            aurelia_framework_1.inject(world_1.World), 
            __metadata('design:paramtypes', [Object])
        ], Camera);
        return Camera;
    }());
    exports.Camera = Camera;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('actor/player',["require", "exports", 'aurelia-framework', '../helpers', './actor', '../camera'], function (require, exports, aurelia_framework_1, helpers_1, actor_1, camera_1) {
    "use strict";
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.call(this);
            this.enemy = null;
            this.camera = aurelia_framework_1.Container.instance.get(camera_1.Camera);
        }
        Player.prototype.pickUp = function (item) {
            this.inventory.addItem(item);
        };
        Player.prototype.attack = function () {
        };
        Player.prototype.equip = function (item) {
        };
        Player.prototype.setPlayerPosition = function (value) {
            this.camera.move(value);
            this.position = value;
        };
        Player.prototype.move = function (direction, distance) {
            var destination = new helpers_1.Vector();
            var currentX = this.position.x;
            var currentY = this.position.y;
            switch (direction) {
                case 'n':
                    destination.x = currentX;
                    destination.y = currentY - 1;
                    break;
                case 's':
                    destination.x = currentX;
                    destination.y = currentY + 1;
                    break;
                case 'e':
                    destination.x = currentX + 1;
                    destination.y = currentY;
                    break;
                case 'w':
                    destination.x = currentX - 1;
                    destination.y = currentY;
                    break;
                case 'nw':
                    destination.x = currentX - 1;
                    destination.y = currentY - 1;
                    break;
                case 'sw':
                    destination.x = currentX - 1;
                    destination.y = currentY + 1;
                    break;
                case 'se':
                    destination.x = currentX + 1;
                    destination.y = currentY + 1;
                    break;
                case 'ne':
                    destination.x = currentX + 1;
                    destination.y = currentY - 1;
                    break;
                default: break;
            }
            if (this.world.getTileByWorldPosition(destination).movementCost > -1) {
                this.setPlayerPosition(destination);
            }
        };
        return Player;
    }(actor_1.Actor));
    exports.Player = Player;
});

define('item/item-module',["require", "exports", 'aurelia-framework', '../actor/player'], function (require, exports, aurelia_framework_1, player_1) {
    "use strict";
    var ItemModule = (function () {
        function ItemModule() {
            this.player = aurelia_framework_1.Container.instance.get(player_1.Player);
        }
        ItemModule.prototype.wield = function () {
        };
        ItemModule.prototype.use = function () {
            return null;
        };
        ItemModule.prototype.attack = function () {
        };
        return ItemModule;
    }());
    exports.ItemModule = ItemModule;
});

define('item/stats/item-stats',["require", "exports"], function (require, exports) {
    "use strict";
    var ItemStats = (function () {
        function ItemStats() {
        }
        return ItemStats;
    }());
    exports.ItemStats = ItemStats;
});

define('item/stats/weapon-stats',["require", "exports"], function (require, exports) {
    "use strict";
    var WeaponStats = (function () {
        function WeaponStats() {
        }
        return WeaponStats;
    }());
    exports.WeaponStats = WeaponStats;
});

define('item/item',["require", "exports", 'aurelia-dependency-injection', '../actor/player', './stats/item-stats', './stats/weapon-stats'], function (require, exports, aurelia_dependency_injection_1, player_1, item_stats_1, weapon_stats_1) {
    "use strict";
    var Item = (function () {
        function Item() {
            this.container = aurelia_dependency_injection_1.Container.instance;
            this.id = "";
            this.title = "";
            this.description = "";
            this.category = "";
            this.module = "";
            this.stats = null;
            this.weaponStats = null;
        }
        Item.mapItem = function (data) {
            var item = new Item();
            item.category = data.category;
            item.description = data.description;
            item.module = data.module;
            item.title = data.title;
            return item;
        };
        Item.mapItemStats = function (data) {
            var stats = new item_stats_1.ItemStats();
            stats.charges = data.charges;
            stats.decay = data.decay;
            stats.volume = data.volume;
            stats.weight = data.weight;
            stats.durability = data.durability;
            return stats;
        };
        Item.mapWeaponStats = function (data) {
            var stats = new weapon_stats_1.WeaponStats();
            stats.ammoType = data.ammoType;
            stats.bash = data.bash;
            stats.pierce = data.pierce;
            stats.range = data.range;
            stats.slash = data.slash;
            return stats;
        };
        Item.prototype.use = function () {
            var mod = this.container.get(this.module);
            mod.use();
            if (this.stats.charges !== -1) {
                if (this.stats.charges > 0) {
                    if (this.stats.charges === 1) {
                        var player = this.container.get(player_1.Player);
                        player.inventory.removeItem(this);
                    }
                    this.stats.charges -= 1;
                }
            }
        };
        return Item;
    }());
    exports.Item = Item;
});

define('item/data/items',["require", "exports"], function (require, exports) {
    "use strict";
    var items = [
        {
            "title": "Bandage",
            "description": "This is a description",
            "category": "TOOL",
            "module": "bandage"
        },
        {
            "title": "Hunting Knife",
            "description": "This is a description",
            "category": "WEAPON",
            "module": "hunting-knife"
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = items;
});

define('item/data/weapon-stats',["require", "exports"], function (require, exports) {
    "use strict";
    var weaponStats = [
        {
            id: "hunting-knife",
            range: 0,
            bash: 0,
            pierce: 6,
            slash: 2,
            ammoType: null
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = weaponStats;
});

define('item/data/item-stats',["require", "exports"], function (require, exports) {
    "use strict";
    var itemStats = [
        {
            id: 'bandage',
            charges: 1,
            decay: -1,
            volume: 0.5,
            weight: 0.5,
            durability: 100
        },
        {
            id: 'hunting-knife',
            charges: -1,
            decay: -1,
            volume: 0.5,
            weight: 0.5,
            durability: 100
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = itemStats;
});

define('item/item-context',["require", "exports", "./item", "./data/items", "./data/weapon-stats", "./data/item-stats"], function (require, exports, item_1, items_1, weapon_stats_1, item_stats_1) {
    "use strict";
    var ItemContext = (function () {
        function ItemContext() {
            this.items = [];
            this.LoadItems();
        }
        ItemContext.prototype.LoadItems = function () {
            var _this = this;
            items_1.default.forEach(function (data) {
                var iStats = item_stats_1.default.find(function (s) { return s.id === data.module; });
                var wStats = weapon_stats_1.default.find(function (s) { return s.id === data.module; });
                var item = item_1.Item.mapItem(data);
                if (iStats) {
                    item.stats = item_1.Item.mapItemStats(iStats);
                }
                if (wStats) {
                    item.weaponStats = item_1.Item.mapWeaponStats(wStats);
                }
                _this.AddItem(item);
            });
        };
        ItemContext.prototype.AddItem = function (item) {
            this.items.push(item);
        };
        return ItemContext;
    }());
    exports.ItemContext = ItemContext;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('input/input',["require", "exports", 'aurelia-framework', '../actor/player'], function (require, exports, aurelia_framework_1, player_1) {
    "use strict";
    var Input = (function () {
        function Input(player) {
            this.player = player;
            this.boundHandler = this.handleKeyInput.bind(this);
            window.addEventListener('keypress', this.boundHandler, false);
        }
        Input.prototype.activate = function () {
            window.addEventListener('keypress', this.boundHandler, false);
        };
        Input.prototype.deactivate = function () {
            window.removeEventListener('keypress', this.boundHandler);
        };
        Input.prototype.movePlayer = function (direction) {
            this.player.move(direction, 1);
        };
        Input.prototype.handleKeyInput = function (event) {
            switch (event.code.toUpperCase()) {
                case "NUMPAD1":
                    this.movePlayer('sw');
                    break;
                case "NUMPAD2":
                    this.movePlayer('s');
                    break;
                case "NUMPAD3":
                    this.movePlayer('se');
                    break;
                case "NUMPAD4":
                    this.movePlayer('w');
                    break;
                case "NUMPAD6":
                    this.movePlayer('e');
                    break;
                case "NUMPAD7":
                    this.movePlayer('nw');
                    break;
                case "NUMPAD8":
                    this.movePlayer('n');
                    break;
                case "NUMPAD9":
                    this.movePlayer('ne');
                    break;
            }
            console.log(event);
            console.log(this.player.position);
        };
        Input = __decorate([
            aurelia_framework_1.inject(player_1.Player), 
            __metadata('design:paramtypes', [Object])
        ], Input);
        return Input;
    }());
    exports.Input = Input;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('game',["require", "exports", 'aurelia-framework', './actor/player', './item/item-context', './world/world', './helpers', './input/input', './camera'], function (require, exports, aurelia_framework_1, player_1, item_context_1, world_1, helpers_1, input_1, camera_1) {
    "use strict";
    var Game = (function () {
        function Game(player, world, itemContext, input, camera) {
            this.player = null;
            this.itemContext = null;
            this.world = null;
            this.input = null;
            this.itemContext = itemContext;
            this.player = player;
            this.world = world;
            this.input = input;
            this.maxWorldSize = 200;
            this.camera = camera;
            var position = new helpers_1.Vector((this.world.chunkSize.x * this.maxWorldSize) / 2, (this.world.chunkSize.y * this.maxWorldSize) / 2);
            this.player.setPlayerPosition(position);
        }
        Game = __decorate([
            aurelia_framework_1.inject(player_1.Player, world_1.World, item_context_1.ItemContext, input_1.Input, camera_1.Camera), 
            __metadata('design:paramtypes', [player_1.Player, world_1.World, item_context_1.ItemContext, input_1.Input, camera_1.Camera])
        ], Game);
        return Game;
    }());
    exports.Game = Game;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework', './game'], function (require, exports, aurelia_framework_1, game_1) {
    "use strict";
    var App = (function () {
        function App(game) {
            this.itemLifespan = 0;
            this.game = game;
        }
        App.prototype.AddItem = function (item) {
            this.game.player.inventory.addItem(item);
        };
        App.prototype.RemoveItem = function (item) {
            this.game.player.inventory.removeItem(item);
        };
        App.prototype.UseItem = function (item) {
            var i = this.game.player.inventory.getItemById(item.id);
            i.use();
        };
        App = __decorate([
            aurelia_framework_1.inject(game_1.Game), 
            __metadata('design:paramtypes', [game_1.Game])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('item/modules/knife',["require", "exports", '../item-module', 'aurelia-framework'], function (require, exports, item_module_1, aurelia_framework_1) {
    "use strict";
    var Knife = (function (_super) {
        __extends(Knife, _super);
        function Knife() {
            _super.call(this);
        }
        Knife.prototype.wield = function () {
        };
        Knife = __decorate([
            aurelia_framework_1.noView, 
            __metadata('design:paramtypes', [])
        ], Knife);
        return Knife;
    }(item_module_1.ItemModule));
    exports.Knife = Knife;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('item/modules/hunting-knife',["require", "exports", './knife', 'aurelia-framework'], function (require, exports, knife_1, aurelia_framework_1) {
    "use strict";
    var HuntingKnife = (function (_super) {
        __extends(HuntingKnife, _super);
        function HuntingKnife() {
            _super.call(this);
        }
        HuntingKnife.prototype.wield = function () {
            _super.prototype.wield.call(this);
        };
        HuntingKnife.prototype.use = function () {
            _super.prototype.use.call(this);
            this.player.health.damage("head", 5);
        };
        HuntingKnife = __decorate([
            aurelia_framework_1.noView, 
            __metadata('design:paramtypes', [])
        ], HuntingKnife);
        return HuntingKnife;
    }(knife_1.Knife));
    exports.HuntingKnife = HuntingKnife;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('item/modules/bandage',["require", "exports", '../item-module'], function (require, exports, item_module_1) {
    "use strict";
    var Bandage = (function (_super) {
        __extends(Bandage, _super);
        function Bandage() {
            _super.call(this);
        }
        Bandage.prototype.use = function () {
            this.player.health.heal('head', 3);
        };
        return Bandage;
    }(item_module_1.ItemModule));
    exports.Bandage = Bandage;
});

define('item/item-module-containers',["require", "exports", 'aurelia-framework', './modules/hunting-knife', './modules/knife', './modules/bandage'], function (require, exports, aurelia_framework_1, hunting_knife_1, knife_1, bandage_1) {
    "use strict";
    function RegisterItemModules() {
        aurelia_framework_1.Container.instance.registerInstance('hunting-knife', new hunting_knife_1.HuntingKnife());
        aurelia_framework_1.Container.instance.registerInstance('knife', new knife_1.Knife());
        aurelia_framework_1.Container.instance.registerInstance('bandage', new bandage_1.Bandage());
    }
    exports.RegisterItemModules = RegisterItemModules;
});

define('main',["require", "exports", './environment', './item/item-module-containers'], function (require, exports, environment_1, item_module_containers_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        item_module_containers_1.RegisterItemModules();
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('input/keybinds',["require", "exports"], function (require, exports) {
    "use strict";
    (function (Keybinds) {
        Keybinds[Keybinds["A"] = 0] = "A";
        Keybinds[Keybinds["NUM1"] = 1] = "NUM1";
        Keybinds[Keybinds["NUM2"] = 2] = "NUM2";
        Keybinds[Keybinds["NUM3"] = 3] = "NUM3";
        Keybinds[Keybinds["NUM4"] = 4] = "NUM4";
        Keybinds[Keybinds["NUM5"] = 5] = "NUM5";
        Keybinds[Keybinds["NUM6"] = 6] = "NUM6";
        Keybinds[Keybinds["NUM7"] = 7] = "NUM7";
        Keybinds[Keybinds["NUM8"] = 8] = "NUM8";
        Keybinds[Keybinds["NUM9"] = 9] = "NUM9";
        Keybinds[Keybinds["NUM0"] = 10] = "NUM0";
    })(exports.Keybinds || (exports.Keybinds = {}));
    var Keybinds = exports.Keybinds;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('tile/modules/tree',["require", "exports"], function (require, exports) {
    "use strict";
    var Tree = (function () {
        function Tree() {
        }
        return Tree;
    }());
    exports.Tree = Tree;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <div id=\"map\" style=\"background-color:black;font-family: 'Courier New', Courier, monospace\">\r\n        <div repeat.for=\"tileY of game.camera.viewport.tiles\">\r\n            <label repeat.for=\"tileX of tileY\" style=\"background-color:black; width:10px; text-align:center;color:${tileX.isPlayer ? 'blue' : tileX.color}; font-weight:bold;\"\r\n                title=\"${tileX.worldPosition.x} ${tileX.worldPosition.y}\">${tileX.isPlayer ? '@' : tileX.symbol}</label>\r\n        </div>\r\n    </div>\r\n    <h2>Items</h2>\r\n    <ul>\r\n        <li repeat.for=\"item of game.itemContext.items\" click.delegate=\"AddItem(item)\">\r\n            ${item.title}\r\n        </li>\r\n    </ul>\r\n    <h2>Inventory</h2>\r\n    <div style=\"display: inline-block\">\r\n        <ul>\r\n            <li repeat.for=\"item of game.player.inventory.items\">\r\n                <div click.delegate=\"RemoveItem(item)\">${item.title}</div>\r\n                <div click.delegate=\"UseItem(item)\">Use</div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div style=\"display: inline-block\">\r\n        <div>Weight: ${game.player.inventory.currentWeight}/${game.player.inventory.weightCap}</div>\r\n        <div>Volume: ${game.player.inventory.currentVolume}/${game.player.inventory.volumeCap}</div>\r\n    </div>\r\n\r\n    <h2>Health</h2>\r\n    <div style=\"display: inline-block\">\r\n        <ul>\r\n            <li repeat.for=\"part of game.player.health.parts\" click.delegate=\"RemoveItem(item)\">\r\n                ${item.title}\r\n                <div>${part.description}:${part.value}</div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map