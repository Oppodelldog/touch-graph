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
var Grabber_1 = require("./Grabber");
var Touched = /** @class */ (function (_super) {
    __extends(Touched, _super);
    function Touched(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    return Touched;
}(State_1.State));
exports.Touched = Touched;
var MoveDiagram = /** @class */ (function (_super) {
    __extends(MoveDiagram, _super);
    function MoveDiagram(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.isGrabbed = false;
        _this.grabber = new Grabber_1.Grabber();
        _this.mouseMoveFunc = _this.onMouseMove.bind(_this);
        return _this;
    }
    MoveDiagram.prototype.onMouseMove = function (event, touchInputPos) {
        this.controller.dragMoveDiagram(touchInputPos.x, touchInputPos.y);
        event.preventDefault();
    };
    MoveDiagram.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.mouseMoveFunc);
    };
    return MoveDiagram;
}(State_1.State));
exports.MoveDiagram = MoveDiagram;
var MoveNode = /** @class */ (function (_super) {
    __extends(MoveNode, _super);
    function MoveNode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.grabber = new Grabber_1.Grabber();
        _this.mouseMoveFunc = _this.onMouseMove.bind(_this);
        return _this;
    }
    MoveNode.prototype.onMouseMove = function (event, touchInputPos, diagramInputPos) {
        this.grabber.setObjectPos(diagramInputPos.x, diagramInputPos.y);
        var node = this.grabber.getObject();
        this.controller.updateNodePos(node);
        event.preventDefault();
    };
    MoveNode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.mouseMoveFunc);
    };
    return MoveNode;
}(State_1.State));
exports.MoveNode = MoveNode;
var MovePort = /** @class */ (function (_super) {
    __extends(MovePort, _super);
    function MovePort(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.grabber = new Grabber_1.Grabber();
        _this.mouseMoveFunc = _this.onMouseMove.bind(_this);
        return _this;
    }
    MovePort.prototype.onMouseMove = function (event, touchInputPos, diagramInputPos) {
        var x1 = this.grabber.x;
        var y1 = this.grabber.y;
        this.controller.updateGrabLine(x1, y1, diagramInputPos.x, diagramInputPos.y);
        event.preventDefault();
    };
    MovePort.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.mouseMoveFunc);
    };
    return MovePort;
}(State_1.State));
exports.MovePort = MovePort;
var PinchPosition = /** @class */ (function () {
    function PinchPosition() {
    }
    return PinchPosition;
}());
var PinchZoom = /** @class */ (function (_super) {
    __extends(PinchZoom, _super);
    function PinchZoom(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.originalDistance = null;
        _this.touchMoveFunc = _this.onTouchMove.bind(_this);
        return _this;
    }
    PinchZoom.prototype.getDistance = function (x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    };
    PinchZoom.prototype.onTouchMove = function (event, touchInputPos, diagramInputPos) {
        var touch1 = event.touches[0];
        var touch2 = event.touches[1];
        if (this.originalDistance === null) {
            this.originalDistance = this.getDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY);
            this.originalScale = this.controller.getScale();
        }
        else {
            var newDistance = this.getDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY);
            var change = this.originalDistance - newDistance;
            this.controller.setScale(this.originalScale - change / 1000);
        }
    };
    PinchZoom.prototype.deactivate = function () {
        _super.prototype.deactivate.call(this);
        this.originalDistance = null;
    };
    PinchZoom.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.touchMoveFunc);
    };
    return PinchZoom;
}(State_1.State));
exports.PinchZoom = PinchZoom;
var TouchStart = /** @class */ (function (_super) {
    __extends(TouchStart, _super);
    function TouchStart(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.touchStartFunc = _this.onTouchStart.bind(_this);
        return _this;
    }
    TouchStart.prototype.onTouchStart = function (event, touchInputPos) {
        this.targetState.touchStartPosition = touchInputPos;
        this.switchState();
        event.preventDefault();
    };
    ;
    TouchStart.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchStart, this.touchStartFunc);
    };
    return TouchStart;
}(State_1.Transition));
exports.TouchStart = TouchStart;
var SingleTouchMoveAbstract = /** @class */ (function (_super) {
    __extends(SingleTouchMoveAbstract, _super);
    function SingleTouchMoveAbstract(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.checkSingleTouchMoveFunc = _this.onCheckSingleTouch.bind(_this);
        return _this;
    }
    SingleTouchMoveAbstract.prototype.onCheckSingleTouch = function (event, touchInputPos, diagramInputPos) {
        if (event.targetTouches === undefined || event.targetTouches.length === 1) {
            this.onTouchMove(event, touchInputPos, diagramInputPos);
        }
    };
    SingleTouchMoveAbstract.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.checkSingleTouchMoveFunc);
    };
    return SingleTouchMoveAbstract;
}(State_1.Transition));
exports.SingleTouchMoveAbstract = SingleTouchMoveAbstract;
var MultiTouchMoveAbstract = /** @class */ (function (_super) {
    __extends(MultiTouchMoveAbstract, _super);
    function MultiTouchMoveAbstract(name, controller, numberOfTouches) {
        var _this = _super.call(this, name, controller) || this;
        _this.numberOfTouches = numberOfTouches;
        _this.checkMultiTouchMoveFunc = _this.onCheckMultiTouch.bind(_this);
        return _this;
    }
    MultiTouchMoveAbstract.prototype.onCheckMultiTouch = function (event, touchInputPos, diagramInputPos) {
        if (event.touches != undefined && event.touches.length >= this.numberOfTouches) {
            this.onTouchMove(event, touchInputPos, diagramInputPos);
        }
    };
    MultiTouchMoveAbstract.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchMove, this.checkMultiTouchMoveFunc);
    };
    return MultiTouchMoveAbstract;
}(State_1.Transition));
exports.MultiTouchMoveAbstract = MultiTouchMoveAbstract;
var TouchMoveOnDiagram = /** @class */ (function (_super) {
    __extends(TouchMoveOnDiagram, _super);
    function TouchMoveOnDiagram(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    TouchMoveOnDiagram.prototype.onTouchMove = function (event, touchInputPos) {
        if (!this.controller.isCanvasHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        if (this.controller.isNodeHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        var startPos = this.originState.touchStartPosition;
        this.controller.dragStartDiagram(startPos.x, startPos.y);
        this.targetState.grabber.grab("diagram", null, startPos.x, startPos.y);
        this.switchState();
        event.preventDefault();
    };
    ;
    return TouchMoveOnDiagram;
}(SingleTouchMoveAbstract));
exports.TouchMoveOnDiagram = TouchMoveOnDiagram;
var TouchMoveOnNode = /** @class */ (function (_super) {
    __extends(TouchMoveOnNode, _super);
    function TouchMoveOnNode(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    TouchMoveOnNode.prototype.onTouchMove = function (event, touchInputPos, diagramInputPos) {
        var hoveredNodeId = this.controller.getHoveredNodeId(touchInputPos.x, touchInputPos.y);
        var hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId !== "") {
            return;
        }
        var node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            this.targetState.grabber.grab(node.id, node, diagramInputPos.x, diagramInputPos.y);
            this.switchState();
        }
    };
    ;
    return TouchMoveOnNode;
}(SingleTouchMoveAbstract));
exports.TouchMoveOnNode = TouchMoveOnNode;
var TouchMoveOnPort = /** @class */ (function (_super) {
    __extends(TouchMoveOnPort, _super);
    function TouchMoveOnPort(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    TouchMoveOnPort.prototype.onTouchMove = function (event, touchInputPos, diagramInputPos) {
        var hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId === "") {
            return false;
        }
        this.targetState.grabber.grab(hoveredPortId, null, diagramInputPos.x, diagramInputPos.y);
        this.controller.updateGrabLine(diagramInputPos.x, diagramInputPos.y, diagramInputPos.x, diagramInputPos.y);
        this.switchState();
        event.preventDefault();
    };
    ;
    return TouchMoveOnPort;
}(SingleTouchMoveAbstract));
exports.TouchMoveOnPort = TouchMoveOnPort;
var DoubleTouchMove = /** @class */ (function (_super) {
    __extends(DoubleTouchMove, _super);
    function DoubleTouchMove(name, controller) {
        return _super.call(this, name, controller, 2) || this;
    }
    DoubleTouchMove.prototype.onTouchMove = function (event, touchInputPos, diagramInputPos) {
        this.switchState();
        event.preventDefault();
    };
    return DoubleTouchMove;
}(MultiTouchMoveAbstract));
exports.DoubleTouchMove = DoubleTouchMove;
var ReleasePort = /** @class */ (function (_super) {
    __extends(ReleasePort, _super);
    function ReleasePort(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.controller = controller;
        _this.mouseUpFunc = _this.onMouseUp.bind(_this);
        return _this;
    }
    ReleasePort.prototype.onMouseUp = function (event, touchInputPos) {
        var grabber = this.originState.grabber;
        // TODO: View logic from controller
        var targetPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (targetPortId) {
            var grabbedPortId = grabber.name;
            // TODO: View logic from controller
            var grabbedNode = this.controller.getNodeFromPortId(grabbedPortId);
            // TODO: View logic from controller
            var targetNode = this.controller.getNodeFromPortId(targetPortId);
            var connection = this.controller.createConnection(grabbedNode.id, grabbedPortId, targetNode.id, targetPortId);
            if (this.controller.addConnection(connection)) {
                this.controller.updateConnection(connection);
            }
        }
        this.controller.removeGrabLine();
        grabber.release();
        this.switchState();
        event.preventDefault();
    };
    ReleasePort.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchEnd, this.mouseUpFunc);
    };
    return ReleasePort;
}(State_1.Transition));
exports.ReleasePort = ReleasePort;
var ReleaseNode = /** @class */ (function (_super) {
    __extends(ReleaseNode, _super);
    function ReleaseNode(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.mouseUpFunc = _this.onMouseUp.bind(_this);
        return _this;
    }
    ReleaseNode.prototype.onMouseUp = function (event) {
        this.originState.grabber.release();
        this.switchState();
        event.preventDefault();
    };
    ReleaseNode.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchEnd, this.mouseUpFunc);
    };
    return ReleaseNode;
}(State_1.Transition));
exports.ReleaseNode = ReleaseNode;
var ReleaseDiagram = /** @class */ (function (_super) {
    __extends(ReleaseDiagram, _super);
    function ReleaseDiagram(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.mouseUpFunc = _this.onMouseUp.bind(_this);
        return _this;
    }
    ReleaseDiagram.prototype.onMouseUp = function (event) {
        this.controller.dragStopDiagram();
        this.originState.isGrabbed = false;
        this.switchState();
        event.preventDefault();
    };
    ReleaseDiagram.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchEnd, this.mouseUpFunc);
    };
    return ReleaseDiagram;
}(State_1.Transition));
exports.ReleaseDiagram = ReleaseDiagram;
var TouchEnd = /** @class */ (function (_super) {
    __extends(TouchEnd, _super);
    function TouchEnd(name, controller) {
        var _this = _super.call(this, name, controller) || this;
        _this.touchEndFunc = _this.onTouchEnd.bind(_this);
        return _this;
    }
    TouchEnd.prototype.onTouchEnd = function (event, touchInputPos) {
        if (event.touches === undefined || event.touches.length <= 1) {
            this.switchState();
            event.preventDefault();
        }
    };
    ;
    TouchEnd.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.registerEventHandler(ViewEvents_1.EventType.TouchEnd, this.touchEndFunc);
    };
    return TouchEnd;
}(State_1.Transition));
exports.TouchEnd = TouchEnd;
//# sourceMappingURL=Touch.js.map