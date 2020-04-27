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
var SelectingNodes = /** @class */ (function (_super) {
    __extends(SelectingNodes, _super);
    function SelectingNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelectingNodes;
}(State_1.State));
exports.SelectingNodes = SelectingNodes;
var SelectNode = /** @class */ (function (_super) {
    __extends(SelectNode, _super);
    function SelectNode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.clickFunc = _this.onClick.bind(_this);
        return _this;
    }
    SelectNode.prototype.onClick = function (event, touchInput) {
        var nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId !== "") {
            this.controller.selectNode(nodeId);
            this.switchState();
            event.preventDefault();
        }
    };
    SelectNode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.Click, this.clickFunc);
    };
    return SelectNode;
}(State_1.Transition));
exports.SelectNode = SelectNode;
var SelectOneMoreNode = /** @class */ (function (_super) {
    __extends(SelectOneMoreNode, _super);
    function SelectOneMoreNode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.clickFunc = _this.onClick.bind(_this);
        return _this;
    }
    SelectOneMoreNode.prototype.onClick = function (event, touchInput) {
        var nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (!this.controller.isNodeSelected(nodeId)) {
            this.controller.selectNode(nodeId);
            this.switchState();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    SelectOneMoreNode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.Click, this.clickFunc);
    };
    return SelectOneMoreNode;
}(State_1.Transition));
exports.SelectOneMoreNode = SelectOneMoreNode;
var DeSelectNode = /** @class */ (function (_super) {
    __extends(DeSelectNode, _super);
    function DeSelectNode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.controller = controller;
        _this.clickFunc = _this.onClick.bind(_this);
        return _this;
    }
    DeSelectNode.prototype.onClick = function (event, touchInput) {
        var nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (this.controller.isNodeSelected(nodeId)) {
            this.controller.deselectNode(nodeId);
            this.switchState();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    DeSelectNode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.Click, this.clickFunc);
    };
    return DeSelectNode;
}(State_1.Transition));
exports.DeSelectNode = DeSelectNode;
var SingleSelectionReturn = /** @class */ (function (_super) {
    __extends(SingleSelectionReturn, _super);
    function SingleSelectionReturn(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    SingleSelectionReturn.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.controller.removeSelectedNodeKeepLatest();
        this.switchState();
    };
    return SingleSelectionReturn;
}(State_1.Transition));
exports.SingleSelectionReturn = SingleSelectionReturn;
var TurnOnMultiNodeSelectionMode = /** @class */ (function (_super) {
    __extends(TurnOnMultiNodeSelectionMode, _super);
    function TurnOnMultiNodeSelectionMode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.keyDownFunc = _this.onKeyDownFunc.bind(_this);
        return _this;
    }
    TurnOnMultiNodeSelectionMode.prototype.onKeyDownFunc = function (event) {
        if (event.key === "Control") {
            this.switchState();
        }
    };
    TurnOnMultiNodeSelectionMode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.KeyDown, this.keyDownFunc);
    };
    return TurnOnMultiNodeSelectionMode;
}(State_1.Transition));
exports.TurnOnMultiNodeSelectionMode = TurnOnMultiNodeSelectionMode;
var TurnOffMultiNodeSelectionMode = /** @class */ (function (_super) {
    __extends(TurnOffMultiNodeSelectionMode, _super);
    function TurnOffMultiNodeSelectionMode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.keyUpFunc = _this.onKeyUpFunc.bind(_this);
        return _this;
    }
    TurnOffMultiNodeSelectionMode.prototype.onKeyUpFunc = function (event) {
        if (event.key === "Control") {
            this.switchState();
        }
    };
    TurnOffMultiNodeSelectionMode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.KeyUp, this.keyUpFunc);
    };
    return TurnOffMultiNodeSelectionMode;
}(State_1.Transition));
exports.TurnOffMultiNodeSelectionMode = TurnOffMultiNodeSelectionMode;
//# sourceMappingURL=SelectNode.js.map