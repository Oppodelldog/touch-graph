"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var states_dot_1 = require("./states.dot");
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.load = function () {
        var _this = this;
        var configItems = [];
        var configString = states_dot_1.default;
        var regex = /(?<FromState>"*[a-zA-Z ]*"*)\s*->\s*(?<ToState>"*[a-zA-Z ]*"*)\s*\[\s*label\s*=\s*(?<Transition>"*[a-zA-Z ]*"*)\s*]/gm;
        var m;
        configString.split('\n').forEach(function (line) {
            var item = _this.extractConfigItem(m, regex, line);
            if (item.StateFrom !== "" && item.StateTo !== "" && item.Transition !== "") {
                configItems.push(item);
            }
        });
        return configItems;
    };
    Config.prototype.extractConfigItem = function (m, regex, line) {
        var item = { StateFrom: "", StateTo: "", Transition: "" };
        while ((m = regex.exec(line)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach(function (match, groupIndex) {
                var value = match.replace(/"/g, "");
                switch (groupIndex) {
                    case 1:
                        item.StateFrom = value;
                        break;
                    case 2:
                        item.StateTo = value;
                        break;
                    case 3:
                        item.Transition = value;
                        break;
                }
            });
        }
        return item;
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=Config.js.map