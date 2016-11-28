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

define('item-interface',["require", "exports"], function (require, exports) {
    "use strict";
});

define('item',["require", "exports"], function (require, exports) {
    "use strict";
    var Item = (function () {
        function Item() {
            this.id = "";
            this.title = "";
            this.description = "";
            this.category = "";
            this.lifespan = 0;
            this.volume = 0;
            this.weight = 0;
            this.module = "";
        }
        Item.prototype.testfunc = function () {
            alert("TEST!");
        };
        Item.prototype.use = function () {
            debugger;
            var mod = require('./item-modules/' + this.module);
        };
        return Item;
    }());
    exports.Item = Item;
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

define('inventory',["require", "exports", './item', './helpers'], function (require, exports, item_1, helpers_1) {
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
        Inventory.prototype.GetItemById = function (id) {
            return this.items.find(function (item) { return item.id === id; });
        };
        Inventory.prototype.AddItem = function (item) {
            this.currentVolume += item.volume;
            this.currentWeight += item.weight;
            var i = Object.assign(new item_1.Item(), item);
            i.id = helpers_1.Guid.newGuid();
            this.items.push(i);
        };
        Inventory.prototype.RemoveItem = function (item) {
            this.currentVolume -= item.volume;
            this.currentWeight -= item.weight;
            this.items = this.items.filter(function (i) { return i.id !== item.id; });
        };
        return Inventory;
    }());
    exports.Inventory = Inventory;
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
define('player',["require", "exports", 'aurelia-framework', './inventory'], function (require, exports, aurelia_framework_1, inventory_1) {
    "use strict";
    var Player = (function () {
        function Player(inventory) {
            this.inventory = null;
            this.inventory = inventory;
        }
        Player.prototype.AddItem = function (item) {
            this.inventory.AddItem(item);
        };
        Player = __decorate([
            aurelia_framework_1.inject(inventory_1.Inventory), 
            __metadata('design:paramtypes', [Object])
        ], Player);
        return Player;
    }());
    exports.Player = Player;
});

define('items',["require", "exports"], function (require, exports) {
    "use strict";
    var items = [
        {
            "title": "Bandage",
            "description": "This is a description",
            "category": "TOOL",
            "lifespan": 0,
            "volume": 0.5,
            "weight": 0.5,
            "module": "hunting-knife"
        },
        {
            "title": "Hunting Knife",
            "description": "This is a description",
            "category": "WEAPON|TOOL",
            "lifespan": 0,
            "volume": 0.5,
            "weight": 0.5,
            "module": "hunting-knife"
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = items;
});

define('item-context',["require", "exports", "./item", "./items"], function (require, exports, item_1, items_1) {
    "use strict";
    var ItemContext = (function () {
        function ItemContext() {
            this.items = [];
            this.LoadItems();
        }
        ItemContext.prototype.LoadItems = function () {
            var _this = this;
            items_1.default.forEach(function (data) {
                var item = new item_1.Item();
                item.category = data.category;
                item.description = data.description;
                item.lifespan = data.lifespan;
                item.module = data.module;
                item.title = data.title;
                item.volume = data.volume;
                item.weight = data.weight;
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
define('game',["require", "exports", 'aurelia-framework', './player', './item-context'], function (require, exports, aurelia_framework_1, player_1, item_context_1) {
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
            this.game.player.inventory.AddItem(item);
        };
        App.prototype.RemoveItem = function (item) {
            this.game.player.inventory.RemoveItem(item);
        };
        App.prototype.UseItem = function (item) {
            debugger;
            var i = this.game.player.inventory.GetItemById(item.id);
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('item-module',["require", "exports", 'aurelia-framework', './player'], function (require, exports, aurelia_framework_1, player_1) {
    "use strict";
    var ItemModule = (function () {
        function ItemModule() {
        }
        ItemModule.prototype.Wield = function () {
        };
        ItemModule.prototype.Use = function () {
            return null;
        };
        ItemModule = __decorate([
            aurelia_framework_1.inject(player_1.Player), 
            __metadata('design:paramtypes', [])
        ], ItemModule);
        return ItemModule;
    }());
    exports.ItemModule = ItemModule;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
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
        config.globalResources(['./item-modules/knife']);
    }
    exports.configure = configure;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('resources/item-modules/knife',["require", "exports", '../../item-module'], function (require, exports, item_module_1) {
    "use strict";
    var Knife = (function (_super) {
        __extends(Knife, _super);
        function Knife() {
            _super.call(this);
        }
        Knife.prototype.Wield = function () {
        };
        return Knife;
    }(item_module_1.ItemModule));
    exports.Knife = Knife;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('resources/item-modules/hunting-knife',["require", "exports", './knife'], function (require, exports, knife_1) {
    "use strict";
    var HuntingKnife = (function (_super) {
        __extends(HuntingKnife, _super);
        function HuntingKnife() {
            _super.call(this);
        }
        HuntingKnife.prototype.Wield = function () {
            _super.prototype.Wield.call(this);
        };
        return HuntingKnife;
    }(knife_1.Knife));
    exports.HuntingKnife = HuntingKnife;
});

define('resources/item-modules/index',["require", "exports", './knife', './hunting-knife'], function (require, exports, knife_1, hunting_knife_1) {
    "use strict";
    exports.Knife = knife_1.Knife;
    exports.HuntingKnife = hunting_knife_1.HuntingKnife;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <h2>Items</h2>\n    <ul>\n        <li repeat.for=\"item of game.itemContext.items\" click.delegate=\"AddItem(item)\">\n            ${item.title}\n        </li>\n    </ul>\n    <h2>Inventory</h2>\n    <div style=\"display: inline-block\">\n        <ul>\n            <li repeat.for=\"item of game.player.inventory.items\" click.delegate=\"RemoveItem(item)\">\n                ${item.title}\n                <div click.delegate=\"UseItem(item)\">Use</div>\n            </li>\n        </ul>\n    </div>\n    <div style=\"display: inline-block\">\n        <div>Weight: ${game.player.inventory.currentWeight}/${game.player.inventory.weightCap}</div>\n        <div>Volume: ${game.player.inventory.currentVolume}/${game.player.inventory.volumeCap}</div>\n    </div>\n</template>"; });
define('text!designer/item-designer.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n<div>\r\n    \r\n</div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map