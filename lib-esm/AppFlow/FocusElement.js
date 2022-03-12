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
var AdjustingFocus = /** @class */ (function (_super) {
    __extends(AdjustingFocus, _super);
    function AdjustingFocus(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    AdjustingFocus.prototype.activate = function () {
        this.controller.center(this.targetPosX, this.targetPosY);
        _super.prototype.activate.call(this);
    };
    return AdjustingFocus;
}(State));
export { AdjustingFocus };
var DoubleClick = /** @class */ (function (_super) {
    __extends(DoubleClick, _super);
    function DoubleClick(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.doubleClickFunc = _this.onDoubleClick.bind(_this);
        return _this;
    }
    DoubleClick.prototype.onDoubleClick = function (event, touchInputPos) {
        var targetState = this.targetState;
        targetState.targetPosX = touchInputPos.x;
        targetState.targetPosY = touchInputPos.y;
        this.switchState();
        event.preventDefault();
    };
    ;
    DoubleClick.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(EventType.DoubleClick, this.doubleClickFunc);
    };
    return DoubleClick;
}(Transition));
export { DoubleClick };
var FocusAdjustmentFinished = /** @class */ (function (_super) {
    __extends(FocusAdjustmentFinished, _super);
    function FocusAdjustmentFinished(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    FocusAdjustmentFinished.prototype.activate = function () {
        this.switchState();
    };
    return FocusAdjustmentFinished;
}(Transition));
export { FocusAdjustmentFinished };
//# sourceMappingURL=FocusElement.js.map