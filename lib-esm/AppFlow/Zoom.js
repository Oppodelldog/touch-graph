var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { State, Transition } from "../Flow/State";
import { EventType } from "../ViewEvents";
var MouseZooming = /** @class */ (function (_super) {
    __extends(MouseZooming, _super);
    function MouseZooming(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    MouseZooming.prototype.activate = function () {
        this.controller.setScale(this.targetScale);
        _super.prototype.activate.call(this);
    };
    return MouseZooming;
}(State));
export { MouseZooming };
var UseMousewheel = /** @class */ (function (_super) {
    __extends(UseMousewheel, _super);
    function UseMousewheel(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.wheelFunc = _this.wheel.bind(_this);
        return _this;
    }
    UseMousewheel.prototype.wheel = function (event) {
        var factor = (event.deltaY) > 0 ? 1 : -1;
        var currentScale = this.controller.getScale();
        var newScale = currentScale + (0.1 * factor);
        if (newScale < 0.1) {
            newScale = 0.1;
        }
        var targetState = this.targetState;
        targetState.currentScale = currentScale;
        targetState.targetScale = newScale;
        this.switchState();
        event.preventDefault();
    };
    ;
    UseMousewheel.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(EventType.Wheel, this.wheelFunc);
    };
    return UseMousewheel;
}(Transition));
export { UseMousewheel };
var ZoomFinished = /** @class */ (function (_super) {
    __extends(ZoomFinished, _super);
    function ZoomFinished() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomFinished.prototype.activate = function () {
        this.switchState();
    };
    return ZoomFinished;
}(Transition));
export { ZoomFinished };
//# sourceMappingURL=Zoom.js.map