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

define('item',["require", "exports"], function (require, exports) {
    "use strict";
});

define('helpers',["require", "exports"], function (require, exports) {
    "use strict";
    function GetEnumElements(e) {
        return Object.keys(e).map(function (a) { return e[a]; }).filter(function (a) { return typeof a === 'string'; });
    }
    exports.GetEnumElements = GetEnumElements;
});

define('app',["require", "exports", './itemenums', './helpers'], function (require, exports, ItemEnums, helpers) {
    "use strict";
    var App = (function () {
        function App(item) {
            this.itemLifespan = 0;
            this.itemCategories = helpers.GetEnumElements(ItemEnums.ItemCategories);
            this.item = item;
            this.item.lifespan = 30;
        }
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



define("game", [],function(){});



define("input", [],function(){});

define('inventory',["require", "exports"], function (require, exports) {
    "use strict";
    var Inventory = (function () {
        function Inventory() {
            this._volumeCap = null;
            this._weightCap = null;
        }
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
        Inventory.prototype.AddItem = function () {
        };
        Inventory.prototype.RemoveItem = function (item) {
        };
        return Inventory;
    }());
    exports.Inventory = Inventory;
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
            "module": "bandage"
        }
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = items;
});

define('item-context',["require", "exports", "./items"], function (require, exports, items_1) {
    "use strict";
    var ItemContext = (function () {
        function ItemContext() {
            this.items = null;
            this.LoadItems();
        }
        ItemContext.prototype.LoadItems = function () {
            var _this = this;
            items_1.default.forEach(function (item) {
                _this.AddItem(item);
            });
        };
        ItemContext.prototype.AddItem = function (item) {
            this.items.push(item);
        };
        ItemContext.prototype.GetItemByTitle = function (title) {
            return this.items.find(function (item) { return item.title === title; });
        };
        return ItemContext;
    }());
    exports.ItemContext = ItemContext;
});

define('item-module',["require", "exports"], function (require, exports) {
    "use strict";
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
        Player = __decorate([
            aurelia_framework_1.inject(inventory_1.Inventory), 
            __metadata('design:paramtypes', [Object])
        ], Player);
        return Player;
    }());
    exports.Player = Player;
});



define("designer/item-designer", [],function(){});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n<div>\n  <label>Title</label>\n  </br>\n  <input type=\"text\" value.bind=\"item.title\"/>\n</div>\n<div>\n  <label>Description</label>\n  </br>\n  <input type=\"text\" value.bind=\"item.description\"/>\n</div>\n<div>\n  <label>Category</label>\n  </br>\n    <select value.bind=\"item.category\">\n      <option>choose one...</option>\n      <option repeat.for=\"category of itemCategories\" value.bind=\"category\">\n        ${category}\n      </option>\n    </select>\n</div>\n\n<div>\n  <label>Lifespan (in minutes; 0 for infinite)</label>\n  </br>\n  <input type=\"text\" value.bind=\"item.lifespan\"/>\n</div>\n<div>\n  <label>Volume (in {change this to current system (i.e. quarts, gallons, liters)}</label>\n  </br>\n  <input type=\"text\" value.bind=\"item.volume\"/>\n</div>\n<div>\n  <label>Weight (in {change this to current system (i.e. lbs, kilos)}</label>\n  </br>\n  <input type=\"text\" value.bind=\"item.volume\"/>\n</div>\n\n</template>"; });
define('text!designer/item-designer.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n<div>\r\n    \r\n</div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map