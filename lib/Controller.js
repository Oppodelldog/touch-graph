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
var Node_1 = require("./data/Node");
var Nodes_1 = require("./data/Nodes");
var Port_1 = require("./data/Port");
var Connection_1 = require("./data/Connection");
var Connections_1 = require("./data/Connections");
var Diagram_1 = require("./data/Diagram");
var UUID_1 = require("./UUID");
var Observer_1 = require("./Observer");
var ConnectionUpdate = /** @class */ (function () {
    function ConnectionUpdate() {
    }
    return ConnectionUpdate;
}());
exports.ConnectionUpdate = ConnectionUpdate;
var ObservableController = /** @class */ (function () {
    function ObservableController() {
        this.onNewNode = new Observer_1.Observer();
        this.onRemoveNode = new Observer_1.Observer();
        this.onMoveNode = new Observer_1.Observer();
        this.onNodeSelectionChanged = new Observer_1.Observer();
        this.onNewConnection = new Observer_1.Observer();
        this.onUpdateConnection = new Observer_1.Observer();
        this.onRemoveConnection = new Observer_1.Observer();
        this.onMoveCanvas = new Observer_1.Observer();
        this.onScaleChanged = new Observer_1.Observer();
        this.onDragConnectionLine = new Observer_1.Observer();
        this.onRemoveConnectionLine = new Observer_1.Observer();
    }
    return ObservableController;
}());
exports.ObservableController = ObservableController;
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(view) {
        var _this = _super.call(this) || this;
        _this.onValidateNewConnection = function () { return true; };
        _this.scale = 1;
        _this.view = view;
        _this.diagram = new Diagram_1.Diagram();
        _this.nodes = new Nodes_1.default();
        _this.connections = new Connections_1.Connections();
        _this.view.onClickLine(function (connectionId) {
            _this.removeConnection(connectionId);
        });
        _this.selectedNodes = [];
        return _this;
    }
    Controller.prototype.newConnectionUpdate = function (connection) {
        var update = new ConnectionUpdate();
        update.connection = connection;
        update.fromNode = this.getNodeById(connection.from.nodeId);
        update.toNode = this.getNodeById(connection.to.nodeId);
        return update;
    };
    Controller.prototype.updateConnection = function (connection) {
        this.onUpdateConnection.notify(this.newConnectionUpdate(connection));
    };
    Controller.prototype.getNodes = function () {
        return this.nodes;
    };
    Controller.prototype.registerEventHandler = function (eventType, callback) {
        return this.view.registerEventHandler(eventType, callback);
    };
    Controller.prototype.removeEventHandler = function (id) {
        this.view.removeEventHandler(id);
    };
    Controller.prototype.getNumberOfPortConnections = function (portId) {
        return this.connections.getByPortId(portId).length;
    };
    Controller.prototype.addConnection = function (connection) {
        if (!this.onValidateNewConnection(connection)) {
            return false;
        }
        if (this.nodes.isInPort(connection.from.portId)) {
            var fromEndPoint = connection.from;
            connection.from = connection.to;
            connection.to = fromEndPoint;
        }
        this.connections.push(connection);
        this.updateConnection(connection);
        return true;
    };
    Controller.prototype.createNode = function () {
        var node = new Node_1.default();
        node.id = UUID_1.default.NewId();
        return node;
    };
    Controller.prototype.createPort = function () {
        var port = new Port_1.default();
        port.id = UUID_1.default.NewId();
        return port;
    };
    Controller.prototype.createConnection = function (nodeA, portA, nodeB, portB) {
        var connection = new Connection_1.Connection();
        connection.id = UUID_1.default.NewId();
        connection.from.nodeId = nodeA;
        connection.from.portId = portA;
        connection.to.nodeId = nodeB;
        connection.to.portId = portB;
        return connection;
    };
    Controller.prototype.addNode = function (node) {
        this.nodes.push(node);
        this.onNewNode.notify(node);
    };
    Controller.prototype.setScale = function (scale) {
        var minScale = 0.01;
        this.scale = scale;
        if (this.scale < minScale) {
            this.scale = minScale;
        }
        this.onScaleChanged.notify(this.scale);
    };
    Controller.prototype.moveTo = function (x, y) {
        var offset = this.view.getOffsetForCenteredPosition(x, y, this.diagram.xOffset, this.diagram.yOffset);
        this.diagram.xOffset = offset.x;
        this.diagram.yOffset = offset.y;
        this.updateCanvasPosition(this.diagram.xOffset, this.diagram.yOffset);
    };
    Controller.prototype.center = function (x, y) {
        var nodeId = this.view.getHoveredNodeId(x, y);
        var node = this.nodes.getById(nodeId);
        if (node !== null) {
            this.moveTo(node.x, node.y);
        }
    };
    Controller.prototype.getScale = function () {
        return this.scale;
    };
    Controller.prototype.getHoveredPortId = function (x, y) {
        return this.view.getHoveredPortId(x, y);
    };
    Controller.prototype.updateGrabLine = function (x, y, x2, y2) {
        this.onDragConnectionLine.notify({ x1: x, y1: y, x2: x2, y2: y2 });
    };
    Controller.prototype.getNodeFromPortId = function (portId) {
        return this.nodes.getNodeFromPortId(portId);
    };
    Controller.prototype.removeGrabLine = function () {
        this.onRemoveConnectionLine.notify();
    };
    Controller.prototype.dragStopDiagram = function () {
        this.diagram.dragStop();
        this.updateCanvasPosition(this.diagram.xOffset, this.diagram.yOffset);
    };
    Controller.prototype.dragMoveDiagram = function (x, y) {
        this.diagram.dragMove(x, y);
        this.updateCanvasPosition(this.diagram.xDrag, this.diagram.yDrag);
    };
    Controller.prototype.updateCanvasPosition = function (x, y) {
        this.onMoveCanvas.notify({ x: x, y: y });
    };
    Controller.prototype.isCanvasHovered = function (x, y) {
        return this.view.isCanvasHovered(x, y);
    };
    Controller.prototype.dragStartDiagram = function (x, y) {
        this.diagram.dragStart(x, y);
    };
    Controller.prototype.getHoveredNodeId = function (x, y) {
        return this.view.getHoveredNodeId(x, y);
    };
    Controller.prototype.isNodeHovered = function (x, y) {
        return this.view.getHoveredNodeId(x, y) !== "";
    };
    Controller.prototype.getNodeById = function (nodeId) {
        return this.nodes.getById(nodeId);
    };
    Controller.prototype.updateNodePos = function (node) {
        this.onMoveNode.notify(node);
        this.renderNodeConnections(node);
    };
    Controller.prototype.renderNodeConnections = function (node) {
        var _this = this;
        this.connections.getByNodeId(node.id).forEach(function (connection) {
            _this.updateConnection(connection);
        });
    };
    Controller.prototype.selectNode = function (nodeId) {
        console.log("select node: " + nodeId);
        this.selectedNodes.push(nodeId);
        this.updateNodeSelection(nodeId);
    };
    Controller.prototype.updateNodeSelection = function (nodeId) {
        var node = this.nodes.getById(nodeId);
        if (node === null) {
            return;
        }
        this.onNodeSelectionChanged.notify({ node: node, selected: this.isNodeSelected(nodeId) });
    };
    Controller.prototype.deselectNode = function (nodeId) {
        if (!this.isNodeSelected(nodeId)) {
            return;
        }
        var index = this.selectedNodes.indexOf(nodeId);
        if (index >= 0) {
            this.selectedNodes.splice(index, 1);
        }
        this.updateNodeSelection(nodeId);
    };
    Controller.prototype.removeSelectedNodeKeepLatest = function () {
        var _this = this;
        this.selectedNodes.splice(0, this.selectedNodes.length - 1).forEach(function (removedNodeIds) { return _this.updateNodeSelection(removedNodeIds); });
    };
    Controller.prototype.isNodeSelected = function (nodeId) {
        return this.selectedNodes.indexOf(nodeId) >= 0;
    };
    Controller.prototype.removeConnection = function (connectionId) {
        var removedConnection = this.connections.getById(connectionId);
        this.connections.remove(connectionId);
        this.onRemoveConnection.notify(removedConnection);
    };
    Controller.prototype.deleteSelectedNodes = function () {
        var _this = this;
        this.selectedNodes.forEach(function (nodeId) { return _this.removeNode(nodeId); });
    };
    Controller.prototype.removeNode = function (nodeId) {
        var _this = this;
        var node = this.getNodeById(nodeId);
        this.nodes.remove(nodeId);
        this.connections.getByNodeId(nodeId).forEach(function (connection) {
            _this.removeConnection(connection.id);
        });
        this.onRemoveNode.notify(node);
    };
    return Controller;
}(ObservableController));
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map