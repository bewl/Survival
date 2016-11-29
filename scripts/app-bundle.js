define('itemenums',["require", "exports"], function (require, exports) {
    "use strict";
    (function (ItemCategories) {
        ItemCategories[ItemCategories["FOOD"] = 0] = "FOOD";
        ItemCategories[ItemCategories["DRINK"] = 1] = "DRINK";
        ItemCategories[ItemCategories["WEAPON"] = 2] = "WEAPON";
        ItemCategories[ItemCategories["AMMO"] = 3] = "AMMO";
        ItemCategories[ItemCategories["CLOTHING"] = 4] = "CLOTHING";
        ItemCategories[ItemCategories["TOOL"] = 5] = "TOOL";
        ItemCategories[ItemCategories["STRUCTURE"] = 6] = "STRUCTURE";
    })(exports.ItemCategories || (exports.ItemCategories = {}));
    var ItemCategories = exports.ItemCategories;
});

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
});

define('item/item-interface',["require", "exports"], function (require, exports) {
    "use strict";
});

define('item/item-module',["require", "exports", 'aurelia-framework', '../player'], function (require, exports, aurelia_framework_1, player_1) {
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

define('item/item',["require", "exports", 'aurelia-dependency-injection', '../player', './stats/item-stats'], function (require, exports, aurelia_dependency_injection_1, player_1, item_stats_1) {
    "use strict";
    var Item = (function () {
        function Item() {
            this.container = aurelia_dependency_injection_1.Container.instance;
            this.id = "";
            this.title = "";
            this.description = "";
            this.category = "";
            this.module = "";
            this.stats = new item_stats_1.ItemStats();
        }
        Item.mapItem = function (data) {
            var item = new Item();
            item.category = data.category;
            item.description = data.description;
            item.module = data.module;
            item.title = data.title;
            return item;
        };
        Item.mapStats = function (data) {
            var stats = new item_stats_1.ItemStats();
            stats.charges = data.charges;
            stats.decay = data.decay;
            stats.volume = data.volume;
            stats.weight = data.weight;
            stats.durability = data.durability;
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

define('inventory',["require", "exports", './item/item', './helpers'], function (require, exports, item_1, helpers_1) {
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

define('player',["require", "exports", './inventory', './health'], function (require, exports, inventory_1, health_1) {
    "use strict";
    var Player = (function () {
        function Player() {
            this.inventory = null;
            this.health = new health_1.Health();
            this.inventory = new inventory_1.Inventory();
        }
        Player.prototype.pickUp = function (item) {
            this.inventory.addItem(item);
        };
        Player.prototype.attack = function () {
        };
        return Player;
    }());
    exports.Player = Player;
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

define('item-context',["require", "exports", "./item/item", "./item/data/items"], function (require, exports, item_1, items_1) {
    "use strict";
    var ItemContext = (function () {
        function ItemContext() {
            this.items = [];
            this.LoadItems();
        }
        ItemContext.prototype.LoadItems = function () {
            var _this = this;
            items_1.default.forEach(function (data) {
                var item = item_1.Item.map(data);
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
define('game',["require", "exports", 'aurelia-framework', './player', './item/item-context'], function (require, exports, aurelia_framework_1, player_1, item_context_1) {
    "use strict";
    var Game = (function () {
        function Game(player, itemContext) {
            this.player = null;
            this.itemContext = null;
            this.player = player;
            this.itemContext = itemContext;
        }
        Game = __decorate([
            aurelia_framework_1.inject(player_1.Player, item_context_1.ItemContext), 
            __metadata('design:paramtypes', [player_1.Player, item_context_1.ItemContext])
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



define("input", [],function(){});

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



define("designer/item-designer", [],function(){});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('health',["require", "exports"], function (require, exports) {
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



define("item/data/item-stats", [],function(){});

define('item/data/weapon-stats',["require", "exports"], function (require, exports) {
    "use strict";
    var weaponStats = [
        {
            id: "hunting-knife",
            range: 0,
            bash: 0,
            pierce: 6,
            slash: 2,
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = weaponStats;
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

define('item/item-context',["require", "exports", "./item", "./data/items", "./data/weapon-stats"], function (require, exports, item_1, items_1, weapon_stats_1) {
    "use strict";
    var ItemContext = (function () {
        function ItemContext() {
            this.items = [];
            this.LoadItems();
        }
        ItemContext.prototype.LoadItems = function () {
            var _this = this;
            items_1.default.forEach(function (data) {
                var stats = weapon_stats_1.default.find(function (s) { return s.id === data.module; });
                var item = item_1.Item.mapItem(data);
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('monster',["require", "exports", 'aurelia-framework', './player'], function (require, exports, aurelia_framework_1, player_1) {
    "use strict";
    var Monster = (function (_super) {
        __extends(Monster, _super);
        function Monster() {
            _super.call(this);
            this.player = aurelia_framework_1.Container.instance.get(player_1.Player);
        }
        Monster.prototype.attack = function () {
        };
        return Monster;
    }(player_1.Player));
    exports.Monster = Monster;
});



define("item/stats/weapon-stats", [],function(){});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <h2>Items</h2>\r\n    <ul>\r\n        <li repeat.for=\"item of game.itemContext.items\" click.delegate=\"AddItem(item)\">\r\n            ${item.title}\r\n        </li>\r\n    </ul>\r\n    <h2>Inventory</h2>\r\n    <div style=\"display: inline-block\">\r\n        <ul>\r\n            <li repeat.for=\"item of game.player.inventory.items\">\r\n                <div click.delegate=\"RemoveItem(item)\">${item.title}</div>\r\n                <div click.delegate=\"UseItem(item)\">Use</div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div style=\"display: inline-block\">\r\n        <div>Weight: ${game.player.inventory.currentWeight}/${game.player.inventory.weightCap}</div>\r\n        <div>Volume: ${game.player.inventory.currentVolume}/${game.player.inventory.volumeCap}</div>\r\n    </div>\r\n\r\n    <h2>Health</h2>\r\n    <div style=\"display: inline-block\">\r\n        <ul>\r\n            <li repeat.for=\"part of game.player.health.parts\" click.delegate=\"RemoveItem(item)\">\r\n                ${item.title}\r\n                <div>${part.description}:${part.value}</div>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</template>"; });
define('text!designer/item-designer.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n<div>\r\n    \r\n</div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map