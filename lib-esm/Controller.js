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
import Node from "./data/Node";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import { Connection } from "./data/Connection";
import { Connections } from "./data/Connections";
import { Diagram } from "./data/Diagram";
import UUID from "./UUID";
import { Observer } from "./Observer";
var ConnectionUpdate = /** @class */ (function () {
    function ConnectionUpdate() {
    }
    return ConnectionUpdate;
}());
export { ConnectionUpdate };
var ObservableController = /** @class */ (function () {
    function ObservableController() {
        this.onNewNode = new Observer();
        this.onRemoveNode = new Observer();
        this.onMoveNode = new Observer();
        this.onNodeSelectionChanged = new Observer();
        this.onNewConnection = new Observer();
        this.onUpdateConnection = new Observer();
        this.onRemoveConnection = new Observer();
        this.onCenterCanvas = new Observer();
        this.onDragCanvas = new Observer();
        this.onScaleChanged = new Observer();
        this.onDragConnectionLine = new Observer();
        this.onRemoveConnectionLine = new Observer();
        this.onSetNodeCaption = new Observer();
        this.onSetPortName = new Observer();
        this.onRemovePort = new Observer();
    }
    return ObservableController;
}());
export { ObservableController };
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(view) {
        var _this = _super.call(this) || this;
        _this.onValidateNewConnection = function () { return true; };
        _this.scale = 1;
        _this.view = view;
        _this.diagram = new Diagram();
        _this.nodes = new Nodes();
        _this.connections = new Connections();
        _this.view.onClickLine(function (connectionId) {
            _this.removeConnection(connectionId);
        });
        _this.selectedNodes = [];
        return _this;
    }
    Controller.prototype.clear = function () {
        var _this = this;
        console.log(this.nodes);
        this.nodes.getAll().map(function (n) { return n.id; }).forEach(function (id) { return _this.removeNode(id); });
        this.connections.getAll().map(function (c) { return c.id; }).forEach(function (id) { return _this.removeConnection(id); });
    };
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
    Controller.prototype.getPortConnections = function (portId) {
        return this.connections.getByPortId(portId);
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
        var node = new Node();
        node.id = UUID.NewId();
        return node;
    };
    Controller.prototype.createPort = function () {
        var port = new Port();
        port.id = UUID.NewId();
        return port;
    };
    Controller.prototype.createConnection = function (nodeA, portA, nodeB, portB) {
        var connection = new Connection();
        connection.id = UUID.NewId();
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
        console.log(x, y);
        this.centerPosition(x, y);
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
    Controller.prototype.dragStartDiagram = function (x, y) {
        this.diagram.dragStart(x, y);
    };
    Controller.prototype.dragMoveDiagram = function (x, y) {
        var dragOffset = this.diagram.getDraggedOffset(x, y);
        this.onDragCanvas.notify({ x: dragOffset.x, y: dragOffset.y });
    };
    Controller.prototype.dragStopDiagram = function () {
        this.diagram.dragStop();
    };
    Controller.prototype.centerPosition = function (x, y) {
        this.onCenterCanvas.notify({ x: x, y: y });
    };
    Controller.prototype.isCanvasHovered = function (x, y) {
        return this.view.isCanvasHovered(x, y);
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
    Controller.prototype.updateAllNodePositions = function () {
        var _this = this;
        this.getNodes().forEach(function (node) { return _this.updateNodePos(node); });
    };
    Controller.prototype.renderNodeConnections = function (node) {
        var _this = this;
        this.connections.getByNodeId(node.id).forEach(function (connection) {
            _this.updateConnection(connection);
        });
    };
    Controller.prototype.selectNode = function (nodeId) {
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
    Controller.prototype.setNodeCaption = function (nodeId, caption) {
        var node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }
        node.caption = caption;
        this.onSetNodeCaption.notify(node);
        this.renderNodeConnections(node);
    };
    Controller.prototype.setPortCaption = function (portId, caption) {
        var node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }
        var port = node.getPortById(portId);
        port.caption = caption;
        this.onSetPortName.notify({ node: node, port: port });
        this.renderNodeConnections(node);
    };
    Controller.prototype.removePort = function (portId) {
        var _this = this;
        var node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }
        node.removePort(portId);
        this.connections.getByPortId(portId).forEach(function (connection) { return _this.removeConnection(connection.id); });
        this.onRemovePort.notify(node);
        this.renderNodeConnections(node);
    };
    return Controller;
}(ObservableController));
export { Controller };
//# sourceMappingURL=Controller.js.map