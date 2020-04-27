var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { State, Transition } from "../Flow/State";
import { EventType } from "../ViewEvents";
var DeletingNodes = /** @class */ (function (_super) {
    __extends(DeletingNodes, _super);
    function DeletingNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeletingNodes;
}(State));
export { DeletingNodes };
var DeleteNodes = /** @class */ (function (_super) {
    __extends(DeleteNodes, _super);
    function DeleteNodes(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.keyUpFunc = _this.onKeyUp.bind(_this);
        return _this;
    }
    DeleteNodes.prototype.onKeyUp = function (event) {
        if (event.key == "Delete") {
            this.controller.deleteSelectedNodes();
        }
    };
    DeleteNodes.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(EventType.KeyUp, this.keyUpFunc);
    };
    return DeleteNodes;
}(Transition));
export { DeleteNodes };
var NodesDeleted = /** @class */ (function (_super) {
    __extends(NodesDeleted, _super);
    function NodesDeleted() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodesDeleted.prototype.activate = function () {
        this.switchState();
    };
    return NodesDeleted;
}(Transition));
export { NodesDeleted };
//# sourceMappingURL=DeleteNodes.js.map