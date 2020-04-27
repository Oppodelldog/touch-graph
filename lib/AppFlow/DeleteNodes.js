"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("../Flow/State");
var ViewEvents_1 = require("../ViewEvents");
var DeletingNodes = /** @class */ (function (_super) {
    __extends(DeletingNodes, _super);
    function DeletingNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeletingNodes;
}(State_1.State));
exports.DeletingNodes = DeletingNodes;
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
        this.registerEventHandler(ViewEvents_1.EventType.KeyUp, this.keyUpFunc);
    };
    return DeleteNodes;
}(State_1.Transition));
exports.DeleteNodes = DeleteNodes;
var NodesDeleted = /** @class */ (function (_super) {
    __extends(NodesDeleted, _super);
    function NodesDeleted() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodesDeleted.prototype.activate = function () {
        this.switchState();
    };
    return NodesDeleted;
}(State_1.Transition));
exports.NodesDeleted = NodesDeleted;
//# sourceMappingURL=DeleteNodes.js.map