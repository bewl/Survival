define('helpers',["require", "exports"], function (require, exports) {
    "use strict";
    function GenerateHashCode(phrase) {
        var hash = 0;
        var i;
        var chr;
        if (phrase.length === 0)
            return hash;
        for (i = 0; i < phrase.length; i++) {
            chr = phrase.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
    exports.GenerateHashCode = GenerateHashCode;
    ;
    function GetEnumElements(e) {
        return Object.keys(e).map(function (a) { return e[a]; }).filter(function (a) { return typeof a === 'string'; });
    }
    exports.GetEnumElements = GetEnumElements;
    var KeyValuePair = (function () {
        function KeyValuePair(key, value) {
            this.key = key;
            this.value = value;
        }
        return KeyValuePair;
    }());
    exports.KeyValuePair = KeyValuePair;
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
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        Vector2.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        ;
        Vector2.prototype.toString = function () {
            return "x:" + this.x + "y:" + this.y;
        };
        ;
        Vector2.zero = function () {
            return new Vector2(0, 0);
        };
        Vector2.prototype.equals = function (vector2) {
            return this.y === vector2.y && this.x == vector2.x;
        };
        return Vector2;
    }());
    exports.Vector2 = Vector2;
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
            this.seedValue = Math.abs(seed);
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
    var Bounds = (function () {
        function Bounds(topLeft, bottomRight) {
            this.topLeft = topLeft;
            this.bottomRight = bottomRight;
        }
        Bounds.prototype.isInsideBounds = function (bounds) {
            return (this.topLeft.x >= bounds.topLeft.x && this.bottomRight.x <= bounds.bottomRight.x
                && this.topLeft.y >= bounds.topLeft.y && this.bottomRight.y <= bounds.bottomRight.y);
        };
        return Bounds;
    }());
    exports.Bounds = Bounds;
});

define('inventory/inventory',["require", "exports", "../item/item", "../helpers"], function (require, exports, item_1, helpers_1) {
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
            var i = item_1.Item.clone(item);
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
            this.maxHealth = 100;
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
        Health.prototype.value = function (partId) {
            var part = this.parts.find(function (p) { return p.id === partId; });
            return part.value;
        };
        Health.prototype.heal = function (partId, value) {
            var part = this.parts.find(function (p) { return p.id === partId; });
            part.value += value;
        };
        return Health;
    }());
    exports.Health = Health;
});

define('tile/tile',["require", "exports", "../inventory/inventory"], function (require, exports, inventory_1) {
    "use strict";
    var Tile = (function () {
        function Tile(chunkPosition, worldPosition, tileWeight, chunkIndex) {
            this.worldPosition = worldPosition;
            this.chunkPosition = chunkPosition;
            this.inventory = new inventory_1.Inventory();
            this.isPlayer = false;
            this.tileWeight = tileWeight;
            this.chunkIndex = chunkIndex;
        }
        return Tile;
    }());
    exports.Tile = Tile;
});

define('tile/data/tiles',["require", "exports"], function (require, exports) {
    "use strict";
    var WATER_MAX = 0.1;
    var tileData = {
        weightMod: 20,
        weightRange: 20 * 3,
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = tileData;
});

define('world/chunk',["require", "exports", "aurelia-framework", "../tile/tile", "../helpers", "../tile/data/tiles"], function (require, exports, aurelia_framework_1, tile_1, helpers_1, tiles_1) {
    "use strict";
    var TileData = tiles_1.default;
    var Chunk = (function () {
        function Chunk(chunkSize, position, worldPosition) {
            if (position === void 0) { position = new helpers_1.Vector2(); }
            this.position = null;
            this.chunkSize = chunkSize;
            this.perlin = aurelia_framework_1.Container.instance.get(helpers_1.Perlin);
            this.tiles = [];
            this.position = position;
            this.chunkId = position.toString();
            this.worldPosition = worldPosition ? worldPosition : new helpers_1.Vector2((this.position.x * this.chunkSize.x), (position.y * this.chunkSize.y));
            this.seedChunk();
        }
        Chunk.prototype.seedChunk = function () {
            var weightMap = this.generateWeightMap();
            var distanceBuffers = [];
            for (var y = 0; y < this.chunkSize.y; y++) {
                this.tiles[y] = [];
                for (var x = 0; x < this.chunkSize.x; x++) {
                    var worldPosition = new helpers_1.Vector2(x + this.worldPosition.x, y + this.worldPosition.y);
                    var chunkIndex = new helpers_1.Vector2(x, y);
                    var tile = this.generateTile(worldPosition, this.position, weightMap, chunkIndex);
                    this.tiles[y][x] = tile;
                }
            }
        };
        Chunk.prototype.getWorldPositionBounds = function () {
            var l = this.tiles[0][0].worldPosition;
            var r = this.tiles[this.tiles.length - 1][this.chunkSize.x - 1].worldPosition;
            return new helpers_1.Bounds(l, r);
        };
        Chunk.prototype.getTileSubset = function (bounds) {
            var chunkBounds = this.getWorldPositionBounds();
            if (bounds.topLeft.y < chunkBounds.topLeft.y)
                bounds.topLeft.y = chunkBounds.topLeft.y;
            if (bounds.topLeft.x < chunkBounds.topLeft.x)
                bounds.topLeft.x = chunkBounds.topLeft.x;
            if (bounds.bottomRight.y > chunkBounds.bottomRight.y)
                bounds.bottomRight.y = chunkBounds.bottomRight.y;
            if (bounds.bottomRight.x > chunkBounds.bottomRight.x)
                bounds.bottomRight.x = chunkBounds.bottomRight.x;
            var allInsideBounds = chunkBounds.isInsideBounds(bounds);
            if (allInsideBounds)
                return this.tiles;
            var startTile = this.getTileByWorldPosition(bounds.topLeft);
            var endTile = this.getTileByWorldPosition(bounds.bottomRight);
            var tiles = [];
            for (var y = startTile.chunkIndex.y; y <= endTile.chunkIndex.y; y++) {
                var yPos = y - startTile.chunkIndex.y;
                tiles[yPos] = [];
                for (var x = startTile.chunkIndex.x; x <= endTile.chunkIndex.x; x++) {
                    var xPos = x - startTile.chunkIndex.x;
                    tiles[yPos][xPos] = this.tiles[y][x];
                }
            }
            return tiles;
        };
        Chunk.prototype.generateWeightMap = function () {
            var weightMap = [];
            TileData.tiles.forEach(function (tile) {
                var min = tile.weight.min == null ? null : (tile.weight.min * TileData.weightRange) - TileData.weightMod;
                var max = tile.weight.max == null ? null : (tile.weight.max * TileData.weightRange) - TileData.weightMod;
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
            return weightMap.sort(function (a, b) {
                if (a.layer > b.layer) {
                    return -1;
                }
                else if (a.layer < b.layer) {
                    return 1;
                }
                return 0;
            });
        };
        Chunk.prototype.getTileByWorldPosition = function (position, chunkSize) {
            var size = chunkSize || this.chunkSize;
            var targetTileX = Math.floor(Math.abs(position.x) % this.chunkSize.x);
            var targetTileY = Math.floor(Math.abs(position.y) % this.chunkSize.y);
            if (Math.sign(position.x) == -1) {
                targetTileX = targetTileX ? this.chunkSize.x - Math.abs(targetTileX) : 0;
            }
            if (Math.sign(position.y) == -1) {
                targetTileY = targetTileY ? this.chunkSize.y - Math.abs(targetTileY) : 0;
            }
            var targetTile = this.tiles[targetTileY][targetTileX];
            return targetTile;
        };
        Chunk.prototype.generateTile = function (worldPosition, chunkPosition, weightMap, chunkIndex) {
            var perlinDivisor = 100;
            var tileWeight = Math.ceil(this.perlin.simplex2(worldPosition.x / perlinDivisor, worldPosition.y / perlinDivisor) * TileData.weightMod);
            var tileType = null;
            var maxLayer = 1000;
            var currentLayer = maxLayer;
            var tileData;
            var seed = this.perlin.seedValue * parseInt('' + Math.abs(worldPosition.x % 324 + worldPosition.y % 32422)) + tileWeight * 10000000;
            tileData = weightMap.find(function (tile) {
                if (((tile.weight.max >= tileWeight) || tile.weight.max == null)
                    && ((tile.weight.min <= tileWeight) || tile.weight.min == null)) {
                    if (tile.randomPercent != null && tile.randomPercent != 0) {
                        var show = true;
                        var rnd = new helpers_1.Random(seed);
                        var num = rnd.nextInt(1, 100);
                        show = num <= Math.abs(tile.randomPercent) * 100;
                        return show;
                    }
                    return true;
                }
                return false;
            });
            tileType = TileData.tiles.find(function (tile) { return tile.id == tileData.id; });
            var tile = new tile_1.Tile(chunkPosition, new helpers_1.Vector2(worldPosition.x, worldPosition.y), tileWeight, chunkIndex);
            tile.movementCost = tileType.movementCost;
            tile.title = tileType.title;
            tile.image = tileType.image;
            if (!tile.color)
                tile.color = tileType.color;
            if (!tile.symbol)
                tile.symbol = String.fromCharCode(tileType.symbol);
            return tile;
        };
        return Chunk;
    }());
    exports.Chunk = Chunk;
});

define('world/world',["require", "exports", "aurelia-framework", "./chunk", "../helpers"], function (require, exports, aurelia_framework_1, chunk_1, helpers_1) {
    "use strict";
    var World = (function () {
        function World() {
            this.viewportScale = 7;
            this.perlin = aurelia_framework_1.Container.instance.get(helpers_1.Perlin);
            this.chunkSize = new helpers_1.Vector2(64, 64);
            this.chunks = [];
            this.seed = new helpers_1.Random(Math.floor(Math.random() * 32000)).nextDouble();
            this.playerTile = null;
        }
        World.prototype.generateSeed = function (seed) {
            if (seed === void 0) { seed = null; }
            this.perlin.seed(seed == null ? this.seed : seed);
        };
        World.prototype.generateActiveChunks = function (startPos) {
            var minY = startPos.y - this.activeChunkSize;
            var maxY = startPos.y + this.activeChunkSize;
            var minX = startPos.x - this.activeChunkSize;
            var maxX = startPos.x + this.activeChunkSize;
            var activeChunks = [];
            var activeTiles = [];
            for (var y = 0; y <= maxY - startPos.y; y++) {
                activeChunks[y] = [];
                for (var x = 0; x <= maxX - startPos.x; x++) {
                    var position = new helpers_1.Vector2(minX + x, minY + y);
                    var chunk = this.chunks[position.y][position.x];
                    if (chunk == null)
                        chunk = this.chunks[position.y][position.x] = new chunk_1.Chunk(this.chunkSize, position);
                    activeChunks[y][x] = chunk;
                    activeTiles = activeTiles.concat(chunk.tiles);
                }
            }
            this.activeChunks = activeChunks;
            this.activeTiles = activeTiles;
        };
        World.prototype.getActiveChunkBounds = function (viewportSize) {
            var topLeft = this.activeChunks[0][0]
                .getWorldPositionBounds()
                .topLeft;
            var bottomRight = this.activeChunks[this.activeChunks.length - 1][this.activeChunkSize - 1]
                .getWorldPositionBounds()
                .bottomRight;
            return new helpers_1.Bounds(topLeft, bottomRight);
        };
        World.prototype.getChunkPositionFromWorldPosition = function (position) {
            var chunk = new helpers_1.Vector2();
            chunk.x = Math.floor(position.x / this.chunkSize.x);
            chunk.y = Math.floor(position.y / this.chunkSize.y);
            return chunk;
        };
        World.prototype.getTileByWorldPosition = function (position, chunkSize) {
            var chunkPos = this.getChunkPositionFromWorldPosition(position);
            var chunk = this.getChunk(chunkPos);
            var targetTile = chunk.getTileByWorldPosition(position);
            return targetTile;
        };
        World.prototype.getChunk = function (position) {
            var chunk = this.chunks.find(function (a) { return a.chunkId == position.toString(); });
            if (chunk == null) {
                chunk = new chunk_1.Chunk(new helpers_1.Vector2(this.chunkSize.x, this.chunkSize.y), new helpers_1.Vector2(position.x, position.y));
                this.chunks.push(chunk);
            }
            return chunk;
        };
        return World;
    }());
    exports.World = World;
});

define('actor/actor',["require", "exports", "aurelia-framework", "../world/world", "../inventory/inventory", "./health"], function (require, exports, aurelia_framework_1, world_1, inventory_1, health_1) {
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('actor/monster',["require", "exports", "./actor"], function (require, exports, actor_1) {
    "use strict";
    var Monster = (function (_super) {
        __extends(Monster, _super);
        function Monster() {
            return _super.call(this) || this;
        }
        Monster.prototype.attack = function () {
        };
        return Monster;
    }(actor_1.Actor));
    exports.Monster = Monster;
});

define('events/player-moved-event',["require", "exports"], function (require, exports) {
    "use strict";
    var PlayerMovedEvent = (function () {
        function PlayerMovedEvent(position) {
            this.position = position;
        }
        return PlayerMovedEvent;
    }());
    exports.PlayerMovedEvent = PlayerMovedEvent;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('actor/player',["require", "exports", "aurelia-framework", "../helpers", "./actor", "aurelia-event-aggregator", "../events/player-moved-event"], function (require, exports, aurelia_framework_1, helpers_1, actor_1, aurelia_event_aggregator_1, player_moved_event_1) {
    "use strict";
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this) || this;
            _this.collisionEnabled = false;
            _this.enemy = null;
            _this.eventAggregator = aurelia_framework_1.Container.instance.get(aurelia_event_aggregator_1.EventAggregator);
            return _this;
        }
        Player.prototype.pickUp = function (item) {
            this.inventory.addItem(item);
        };
        Player.prototype.attack = function () {
        };
        Player.prototype.use = function () {
        };
        Player.prototype.checkVicinity = function () {
        };
        Player.prototype.equip = function (item) {
        };
        Player.prototype.toggleCollision = function () {
            this.collisionEnabled = !this.collisionEnabled;
        };
        Player.prototype.setPlayerPosition = function (value) {
            this.eventAggregator.publish('PlayerMoved', new player_moved_event_1.PlayerMovedEvent(value));
            this.position = value;
        };
        Player.prototype.move = function (direction, distance) {
            var destination = new helpers_1.Vector2();
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
            if (!this.collisionEnabled || this.world.getTileByWorldPosition(destination).movementCost > -1) {
                this.setPlayerPosition(destination);
            }
        };
        return Player;
    }(actor_1.Actor));
    exports.Player = Player;
});

define('item/item-module',["require", "exports", "aurelia-framework", "../actor/player"], function (require, exports, aurelia_framework_1, player_1) {
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

define('item/item',["require", "exports", "aurelia-dependency-injection", "../actor/player", "./stats/item-stats", "./stats/weapon-stats"], function (require, exports, aurelia_dependency_injection_1, player_1, item_stats_1, weapon_stats_1) {
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
        Item.clone = function (item) {
            var newItem = Object.create(item);
            newItem.stats = Object.create(item.stats);
            return newItem;
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
            if (mod.use()) {
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
        },
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
define('input/input',["require", "exports", "aurelia-framework", "../actor/player", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, player_1, aurelia_event_aggregator_1) {
    "use strict";
    var Input = (function () {
        function Input(player, ea) {
            this.lastPressed = 0;
            this.player = player;
            this.mouseMoveHandler = this.handleMouseMove.bind(this);
            this.boundHandler = this.handleKeyInput.bind(this);
            this.mouseWheelHandler = this.handleMouseWheel.bind(this);
            window.addEventListener('keypress', this.boundHandler, false);
            window.addEventListener('mousewheel', this.mouseWheelHandler, false);
            window.addEventListener('mousemove', this.mouseMoveHandler, false);
            this.eventAggregator = ea;
        }
        Input.prototype.deactivate = function () {
            window.removeEventListener('keypress', this.boundHandler);
            window.removeEventListener('mousewheel', this.mouseWheelHandler);
            window.removeEventListener('mousemove', this.mouseMoveHandler);
        };
        Input.prototype.movePlayer = function (direction) {
            this.player.move(direction, 1);
        };
        Input.prototype.throttle = function (callback, wait, context) {
            if (context === void 0) { context = this; }
            var timeout = null;
            var later = function () { return callback(); };
            return function () {
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        Input.prototype.handleMouseWheel = function (event) {
            var e = event;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            this.eventAggregator.publish('ZoomChanged', delta);
        };
        Input.prototype.handleMouseMove = function (event) {
            this.eventAggregator.publish('MouseMoved', event);
        };
        Input.prototype.handleKeyInput = function (event) {
            var time = new Date().getTime();
            var delta = 10;
            var diagDelta = delta * 2;
            if (time > this.lastPressed + delta) {
                switch (event.code.toUpperCase()) {
                    case "65":
                        break;
                    case "66":
                        break;
                    case "KEYC":
                        this.player.collisionEnabled = !this.player.collisionEnabled;
                        break;
                    case "KEYE":
                        this.player.use();
                        break;
                    case "NUMPAD1":
                        this.movePlayer('sw');
                        time += diagDelta;
                        break;
                    case "NUMPAD2":
                        this.movePlayer('s');
                        break;
                    case "NUMPAD3":
                        this.movePlayer('se');
                        time += diagDelta;
                        break;
                    case "NUMPAD4":
                        this.movePlayer('w');
                        break;
                    case "NUMPAD6":
                        this.movePlayer('e');
                        break;
                    case "NUMPAD7":
                        this.movePlayer('nw');
                        time += diagDelta;
                        break;
                    case "NUMPAD8":
                        this.movePlayer('n');
                        break;
                    case "NUMPAD9":
                        this.movePlayer('ne');
                        time += diagDelta;
                        break;
                }
                this.lastPressed = time;
            }
        };
        return Input;
    }());
    Input = __decorate([
        aurelia_framework_1.inject(player_1.Player, aurelia_event_aggregator_1.EventAggregator),
        __metadata("design:paramtypes", [Object, Object])
    ], Input);
    exports.Input = Input;
});

define('events/render-event',["require", "exports"], function (require, exports) {
    "use strict";
    var RenderEvent = (function () {
        function RenderEvent(symbols, viewportSize) {
            this.symbols = symbols;
            this.viewportSize = viewportSize;
        }
        return RenderEvent;
    }());
    exports.RenderEvent = RenderEvent;
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
define('camera',["require", "exports", "aurelia-framework", "./actor/player", "./helpers", "./world/world", "aurelia-event-aggregator", "./events/render-event"], function (require, exports, aurelia_framework_1, player_1, helpers_1, world_1, aurelia_event_aggregator_1, render_event_1) {
    "use strict";
    var Camera = (function () {
        function Camera(world, eventAggregator, player) {
            var _this = this;
            this._eventAggregator = eventAggregator;
            this.position = null;
            this.world = world;
            this.zoomLevel = 7;
            this.viewportSize = new helpers_1.Vector2(128, 64);
            this.viewport = null;
            this.player = player;
            this._eventAggregator.subscribe('PlayerMoved', function (event) {
                _this.translate(event.position);
            });
            this._eventAggregator.subscribe('Update', function (playerPos) {
                _this.updateViewport(playerPos);
            });
            this._eventAggregator.subscribe('ZoomChanged', function (dir) {
                var minSize = 16;
                var maxSize = 256;
                if (dir == 1) {
                    var x = Math.pow(2, _this.zoomLevel - 1) / 2;
                    if (x > minSize) {
                        _this.viewportSize.x = x;
                        _this.viewportSize.y = x / 2;
                        _this.zoomLevel--;
                        _this.updateViewport(_this.player.position);
                    }
                }
                else if (dir == -1) {
                    var x = Math.pow(2, _this.zoomLevel + 1) / 2;
                    if (x < maxSize) {
                        _this.viewportSize.x = x;
                        _this.viewportSize.y = x / 2;
                        _this.zoomLevel++;
                        _this.updateViewport(_this.player.position);
                    }
                }
            });
        }
        Camera.prototype.translate = function (position) {
            this.updateViewport(position);
            this.position = position;
        };
        Camera.prototype.setIsPlayer = function (tile) {
            var playerTile = this.world.getTileByWorldPosition(tile);
            playerTile.isPlayer = true;
        };
        Camera.prototype.updateViewport = function (playerPosition) {
            var canvas = document.getElementById("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.viewportSize = new helpers_1.Vector2(Math.pow(2, this.zoomLevel), Math.pow(2, this.zoomLevel) / 2);
            var playerPos = playerPosition || this.playerPositionCache;
            var startTilePos = new helpers_1.Vector2(playerPos.x - Math.floor(this.viewportSize.x / 2), playerPos.y - Math.floor(this.viewportSize.y / 2));
            var endTilePos = new helpers_1.Vector2(startTilePos.x + this.viewportSize.x, startTilePos.y + this.viewportSize.y);
            var topLeftChunkPos = this.world.getChunkPositionFromWorldPosition(startTilePos);
            var bottomRightChunkPos = this.world.getChunkPositionFromWorldPosition(endTilePos);
            if (playerPosition != null) {
                var viewportBuffer = [];
                for (var y = topLeftChunkPos.y; y <= bottomRightChunkPos.y; y++) {
                    var yPos = y - topLeftChunkPos.y;
                    var yCount = viewportBuffer.length;
                    for (var x = topLeftChunkPos.x; x <= bottomRightChunkPos.x; x++) {
                        var xPos = x - topLeftChunkPos.x;
                        var chunks = this.world.getChunk(new helpers_1.Vector2(x, y));
                        var startTile = startTilePos;
                        var endTile = endTilePos;
                        var tiles = chunks.getTileSubset(new helpers_1.Bounds(new helpers_1.Vector2(startTile.x, startTile.y), new helpers_1.Vector2(endTile.x, endTile.y)));
                        var yy = 0;
                        for (yy; yy < tiles.length; yy++) {
                            var yBuffer = yy + yCount;
                            if (viewportBuffer[yBuffer] == undefined)
                                viewportBuffer[yBuffer] = [];
                            viewportBuffer[yBuffer] = viewportBuffer[yBuffer].concat(tiles[yy]);
                        }
                    }
                }
                var playerTileCache = null;
                if (this.viewport != null)
                    playerTileCache = this.viewport[Math.floor(this.viewport.length / 2)][Math.floor(this.viewportSize.x / 2)];
                this.viewport = [];
                this.viewport = viewportBuffer;
                if (playerTileCache)
                    playerTileCache.isPlayer = false;
            }
            var playerTile = this.viewport[Math.floor(this.viewportSize.y / 2)][Math.floor(this.viewportSize.x / 2)];
            playerTile.isPlayer = true;
            this.playerPositionCache = playerTile.worldPosition;
            var flattendTiles = [].concat.apply([], this.viewport);
            this._eventAggregator.publish('RenderEvent', new render_event_1.RenderEvent(this.viewport, this.viewportSize));
        };
        return Camera;
    }());
    Camera = __decorate([
        aurelia_framework_1.inject(world_1.World, aurelia_event_aggregator_1.EventAggregator, player_1.Player),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], Camera);
    exports.Camera = Camera;
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
define('game',["require", "exports", "aurelia-framework", "./actor/player", "./item/item-context", "./world/world", "./helpers", "./input/input", "./camera", "./helpers"], function (require, exports, aurelia_framework_1, player_1, item_context_1, world_1, helpers_1, input_1, camera_1, helpers_2) {
    "use strict";
    var Game = (function () {
        function Game(player, world, itemContext, input, camera) {
            this.player = null;
            this.itemContext = null;
            this.world = null;
            this.input = null;
            this.seed = "Test seed";
            this.itemContext = itemContext;
            this.player = player;
            this.world = world;
            this.input = input;
            this.maxWorldSize = 200;
            this.camera = camera;
        }
        Game.prototype.init = function () {
            this.world.generateSeed(helpers_2.GenerateHashCode(this.seed));
            this.world.chunks = [];
            var position = new helpers_1.Vector2(30000, 30000);
            this.player.setPlayerPosition(position);
        };
        return Game;
    }());
    Game = __decorate([
        aurelia_framework_1.inject(player_1.Player, world_1.World, item_context_1.ItemContext, input_1.Input, camera_1.Camera),
        __metadata("design:paramtypes", [player_1.Player, world_1.World, item_context_1.ItemContext, input_1.Input, camera_1.Camera])
    ], Game);
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
define('renderer',["require", "exports", "aurelia-event-aggregator", "aurelia-framework", "./game", "./helpers"], function (require, exports, aurelia_event_aggregator_1, aurelia_framework_1, game_1, helpers_1) {
    "use strict";
    var Renderer = (function () {
        function Renderer(ea, game) {
            var _this = this;
            this._eventAggregator = ea;
            this.game = game;
            this._eventAggregator.subscribe('RenderEvent', function (event) {
                _this.draw(event);
            });
            this.imageRepo = new ImageRepo();
        }
        Renderer.prototype.init = function (canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");
        };
        ;
        Renderer.prototype.draw = function (event) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            var cellSizeX = Math.ceil(this.canvas.width / event.viewportSize.x);
            var cellSizeY = Math.ceil(this.canvas.height / event.viewportSize.y);
            for (var y = 0; y < event.symbols.length; y++) {
                var row = event.symbols[y];
                for (var x = 0; x < row.length; x++) {
                    var currentTile = event.symbols[y][x];
                    var currentPos = new helpers_1.Vector2(x * cellSizeX, y * cellSizeY);
                    this.ctx.fillStyle = currentTile.isPlayer ? "blue" : currentTile.color;
                    this.ctx.fillRect(currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                    if (currentTile.image != null) {
                        var img = this.imageRepo.getImage('/images/' + currentTile.image);
                        this.ctx.drawImage(img, currentPos.x, currentPos.y, cellSizeX, cellSizeY);
                    }
                    if (currentTile.chunkIndex.y == 0) {
                        this.ctx.moveTo(currentPos.x, currentPos.y);
                        this.ctx.lineTo(currentPos.x + cellSizeX, currentPos.y);
                        this.ctx.strokeStyle = "grey";
                        this.ctx.stroke();
                    }
                    if (currentTile.chunkIndex.x == 0) {
                        this.ctx.moveTo(currentPos.x, currentPos.y);
                        this.ctx.lineTo(currentPos.x, currentPos.y + cellSizeY);
                        this.ctx.strokeStyle = "grey";
                        this.ctx.stroke();
                    }
                }
            }
        };
        return Renderer;
    }());
    Renderer = __decorate([
        aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, game_1.Game),
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, game_1.Game])
    ], Renderer);
    exports.Renderer = Renderer;
    var ImageRepo = (function () {
        function ImageRepo() {
            this.images = [];
        }
        ImageRepo.prototype.getImage = function (imagePath) {
            var image = this.images.find(function (a) { return a.path == imagePath; });
            if (image == null) {
                var img = new Image();
                img.src = imagePath;
                image = { path: imagePath, image: img };
                this.images.push(image);
            }
            return image.image;
        };
        return ImageRepo;
    }());
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
define('app',["require", "exports", "aurelia-framework", "./game", "./renderer"], function (require, exports, aurelia_framework_1, game_1, renderer_1) {
    "use strict";
    var App = (function () {
        function App(game, renderer) {
            this.renderer = renderer;
            this.game = game;
        }
        App.prototype.attached = function () {
            var _this = this;
            this.renderer.init(this.canvas);
            this.init();
            window.addEventListener('resize', function () {
                _this.game.camera.updateViewport();
            }, false);
        };
        App.prototype.init = function () {
            this.game.init();
        };
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
        App.prototype.toggleCollision = function () {
            this.game.player.toggleCollision();
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.inject(game_1.Game, renderer_1.Renderer),
        __metadata("design:paramtypes", [game_1.Game, renderer_1.Renderer])
    ], App);
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('item/modules/knife',["require", "exports", "../item-module", "aurelia-framework"], function (require, exports, item_module_1, aurelia_framework_1) {
    "use strict";
    var Knife = (function (_super) {
        __extends(Knife, _super);
        function Knife() {
            return _super.call(this) || this;
        }
        Knife.prototype.wield = function () {
        };
        return Knife;
    }(item_module_1.ItemModule));
    Knife = __decorate([
        aurelia_framework_1.noView,
        __metadata("design:paramtypes", [])
    ], Knife);
    exports.Knife = Knife;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('item/modules/hunting-knife',["require", "exports", "./knife", "aurelia-framework"], function (require, exports, knife_1, aurelia_framework_1) {
    "use strict";
    var HuntingKnife = (function (_super) {
        __extends(HuntingKnife, _super);
        function HuntingKnife() {
            return _super.call(this) || this;
        }
        HuntingKnife.prototype.wield = function () {
            _super.prototype.wield.call(this);
        };
        HuntingKnife.prototype.use = function () {
            _super.prototype.use.call(this);
            this.player.health.damage("head", 5);
        };
        return HuntingKnife;
    }(knife_1.Knife));
    HuntingKnife = __decorate([
        aurelia_framework_1.noView,
        __metadata("design:paramtypes", [])
    ], HuntingKnife);
    exports.HuntingKnife = HuntingKnife;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('item/modules/bandage',["require", "exports", "../item-module"], function (require, exports, item_module_1) {
    "use strict";
    var Bandage = (function (_super) {
        __extends(Bandage, _super);
        function Bandage() {
            return _super.call(this) || this;
        }
        Bandage.prototype.use = function () {
            if (this.player.health.value('head') + 3 <= this.player.health.maxHealth) {
                this.player.health.heal('head', 3);
                return true;
            }
            return false;
        };
        return Bandage;
    }(item_module_1.ItemModule));
    exports.Bandage = Bandage;
});

define('item/item-module-containers',["require", "exports", "aurelia-framework", "./modules/hunting-knife", "./modules/knife", "./modules/bandage"], function (require, exports, aurelia_framework_1, hunting_knife_1, knife_1, bandage_1) {
    "use strict";
    function RegisterItemModules() {
        aurelia_framework_1.Container.instance.registerInstance('hunting-knife', new hunting_knife_1.HuntingKnife());
        aurelia_framework_1.Container.instance.registerInstance('knife', new knife_1.Knife());
        aurelia_framework_1.Container.instance.registerInstance('bandage', new bandage_1.Bandage());
    }
    exports.RegisterItemModules = RegisterItemModules;
});

define('main',["require", "exports", "./environment", "./item/item-module-containers"], function (require, exports, environment_1, item_module_containers_1) {
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

define('dungeon/dungeon',["require", "exports"], function (require, exports) {
    "use strict";
    var Dungeon = (function () {
        function Dungeon() {
        }
        return Dungeon;
    }());
    exports.Dungeon = Dungeon;
});

define('dungeon/room',["require", "exports"], function (require, exports) {
    "use strict";
    var Room = (function () {
        function Room() {
        }
        return Room;
    }());
    exports.Room = Room;
});

define('input/keybinds',["require", "exports"], function (require, exports) {
    "use strict";
    var Keybinds;
    (function (Keybinds) {
        Keybinds[Keybinds["A"] = 0] = "A";
        Keybinds[Keybinds["B"] = 1] = "B";
        Keybinds[Keybinds["C"] = 2] = "C";
        Keybinds[Keybinds["E"] = 3] = "E";
        Keybinds[Keybinds["NUM1"] = 4] = "NUM1";
        Keybinds[Keybinds["NUM2"] = 5] = "NUM2";
        Keybinds[Keybinds["NUM3"] = 6] = "NUM3";
        Keybinds[Keybinds["NUM4"] = 7] = "NUM4";
        Keybinds[Keybinds["NUM5"] = 8] = "NUM5";
        Keybinds[Keybinds["NUM6"] = 9] = "NUM6";
        Keybinds[Keybinds["NUM7"] = 10] = "NUM7";
        Keybinds[Keybinds["NUM8"] = 11] = "NUM8";
        Keybinds[Keybinds["NUM9"] = 12] = "NUM9";
        Keybinds[Keybinds["NUM0"] = 13] = "NUM0";
    })(Keybinds = exports.Keybinds || (exports.Keybinds = {}));
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    var Random = (function () {
        function Random() {
        }
        return Random;
    }());
    exports.Random = Random;
    (function (global, pool, math, width, chunks, digits, module, define, rngname) {
        var startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
        var impl = math['seed' + rngname] = function (seed, options, callback) {
            var key = [];
            options = (options == true) ? { entropy: true } : (options || {});
            var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] :
                (seed == null) ? autoseed() : seed, 3), key);
            var arc4 = new ARC4(key);
            mixkey(tostring(arc4.S), pool);
            return (options.pass || callback ||
                function (prng, seed, is_math_call) {
                    if (is_math_call) {
                        math[rngname] = prng;
                        return seed;
                    }
                    else
                        return prng;
                })(function () {
                var n = arc4.g(chunks), d = startdenom, x = 0;
                while (n < significance) {
                    n = (n + x) * width;
                    d *= width;
                    x = arc4.g(1);
                }
                while (n >= overflow) {
                    n /= 2;
                    d /= 2;
                    x >>>= 1;
                }
                return (n + x) / d;
            }, shortseed, 'global' in options ? options.global : (this == math));
        };
        function ARC4(key) {
            var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
            if (!keylen) {
                key = [keylen++];
            }
            while (i < width) {
                s[i] = i++;
            }
            for (i = 0; i < width; i++) {
                s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
                s[j] = t;
            }
            (me.g = function (count) {
                var t, r = 0, i = me.i, j = me.j, s = me.S;
                while (count--) {
                    t = s[i = mask & (i + 1)];
                    r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
                }
                me.i = i;
                me.j = j;
                return r;
            })(width);
        }
        function flatten(obj, depth) {
            var result = [], typ = (typeof obj), prop;
            if (depth && typ == 'object') {
                for (prop in obj) {
                    try {
                        result.push(flatten(obj[prop], depth - 1));
                    }
                    catch (e) { }
                }
            }
            return (result.length ? result : typ == 'string' ? obj : obj + '\0');
        }
        function mixkey(seed, key) {
            var stringseed = seed + '', smear, j = 0;
            while (j < stringseed.length) {
                key[mask & j] =
                    mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
            }
            return tostring(key);
        }
        function autoseed(seed) {
            try {
                if (nodecrypto)
                    return tostring(nodecrypto.randomBytes(width));
                global.crypto.getRandomValues(seed = new Uint8Array(width));
                return tostring(seed);
            }
            catch (e) {
                return [+new Date, global, (seed = global.navigator) && seed.plugins,
                    global.screen, tostring(pool)];
            }
        }
        function tostring(a) {
            return String.fromCharCode.apply(0, a);
        }
        mixkey(math[rngname](), pool);
        if (module && module.exports) {
            module.exports = impl;
            try {
                nodecrypto = require('crypto');
            }
            catch (ex) { }
        }
        else if (define && define.amd) {
            define(function () { return impl; });
        }
    })(this, [], Math, 256, 6, 52, (typeof module) == 'object' && module, (typeof define) == 'function' && define, 'random');
});

define('utility/vector',["require", "exports"], function (require, exports) {
    "use strict";
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        Vector2.prototype.dot2 = function (x, y) {
            return this.x * x + this.y * y;
        };
        ;
        Vector2.prototype.isInsideBounds = function (topLeft, bottomRight) {
            return (this.x >= topLeft.x && this.x <= bottomRight.x
                && this.y >= topLeft.y && this.y <= bottomRight.y);
        };
        return Vector2;
    }());
    exports.Vector2 = Vector2;
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

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <canvas id=\"canvas\" ref=\"canvas\" height=\"500\" wdith=\"1000\"> Your browser does not support canvas.</canvas>\r\n    <div id=\"map\" style=\"position: relative; background-color:black;font-family: 'Courier New', Courier, monospace; width: 100%; height: 100%;\">\r\n        <div id=\"ui\">\r\n            <div style=\"display: inline-block;\">\r\n                <h2>Items</h2>\r\n                <ul>\r\n                    <li repeat.for=\"item of game.itemContext.items\" click.delegate=\"AddItem(item)\">\r\n                        ${item.title}\r\n                    </li>\r\n                </ul>\r\n                <h2>Inventory</h2>\r\n                <div>\r\n                    <div>\r\n                        <div>Weight: ${game.player.inventory.currentWeight}/${game.player.inventory.weightCap}</div>\r\n                        <div>Volume: ${game.player.inventory.currentVolume}/${game.player.inventory.volumeCap}</div>\r\n                    </div>\r\n                    <div style=\"display: inline-block\">\r\n                        <ul>\r\n                            <li repeat.for=\"item of game.player.inventory.items\">\r\n                                <div click.delegate=\"RemoveItem(item)\">${item.title}</div>\r\n                                <div click.delegate=\"UseItem(item)\">Use</div>\r\n                            </li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div style=\"display: inline-block\">\r\n                <ul>\r\n                    <li repeat.for=\"part of game.player.health.parts\" click.delegate=\"RemoveItem(item)\">\r\n                        ${item.title}\r\n                        <div>${part.description}:${part.value}</div>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div>\r\n                <div class=\"dev-stat\">\r\n                    <span>x: ${game.player.position.x}</span>\r\n                    <span>y: ${game.player.position.y}</span>\r\n                </div>\r\n                <div class=\"dev-stat\">\r\n                    <span>zoomLevel: ${game.camera.zoomLevel}</span>\r\n                </div>\r\n                <div class=\"dev-stat\">\r\n                    <span>viewport size x: ${game.camera.viewportSize.x}</span>\r\n                    <span>viewport size y: ${game.camera.viewportSize.y}</span>\r\n                </div>\r\n                <button click.delegate=\"toggleCollision()\" innerhtml.bind=\"game.player.collisionEnabled ? 'Collision On' : 'Collision Off'\">Collision</button>\r\n                <div>\r\n                    <label>seed</label>\r\n                    <input type=\"text\" value.bind=\"game.seed\" />\r\n                    <button click.delegate=\"init()\">Generate</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map