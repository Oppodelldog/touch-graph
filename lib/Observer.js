"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observer = /** @class */ (function () {
    function Observer() {
        this.handlers = new Array();
    }
    Observer.prototype.subscribe = function (f) {
        this.handlers.push(f);
    };
    Observer.prototype.unsubscribe = function (f) {
        var index = this.handlers.indexOf(f);
        if (index >= 0) {
            this.handlers.splice(index, 1);
        }
    };
    Observer.prototype.notify = function (t) {
        this.handlers.forEach(function (f) { return f(t); });
    };
    return Observer;
}());
exports.Observer = Observer;
//# sourceMappingURL=Observer.js.map