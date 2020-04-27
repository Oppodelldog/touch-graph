"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grabber = /** @class */ (function () {
    function Grabber() {
        this.name = "";
        this.grabbedObject = null;
    }
    Grabber.prototype.setObjectPos = function (x, y) {
        if (this.grabbedObject !== null) {
            this.grabbedObject.x = x - this.x;
            this.grabbedObject.y = y - this.y;
        }
    };
    Grabber.prototype.getObject = function () {
        return this.grabbedObject;
    };
    Grabber.prototype.grab = function (name, object, x, y) {
        this.x = x;
        this.y = y;
        this.name = name;
        if (object !== null) {
            this.grabbedObject = object;
            this.x = x - object.x;
            this.y = y - object.y;
        }
    };
    Grabber.prototype.release = function () {
        this.name = "";
        this.grabbedObject = null;
        this.x = 0;
        this.y = 0;
    };
    return Grabber;
}());
exports.Grabber = Grabber;
//# sourceMappingURL=Grabber.js.map