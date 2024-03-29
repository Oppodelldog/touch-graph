import { Controller } from "./Controller";
import { Renderer } from "./Renderer";
import { AppFlow } from "./AppFlow";
export function NewGraph() {
    var renderer = new Renderer();
    var controller = new Controller();
    var graph = new Graph(controller);
    graph.setRenderer(renderer);
    graph.initStates();
    return graph;
}
var Graph = /** @class */ (function () {
    function Graph(controller) {
        this.controller = controller;
    }
    Graph.prototype.setRenderer = function (renderer) {
        this.renderer = renderer;
        this.controller.connectView(this.renderer);
        this.renderer.bind(this.controller);
    };
    Graph.prototype.onValidateNewConnection = function (f) {
        this.controller.onValidateNewConnection = function (connection) { return f(connection); };
    };
    Graph.prototype.onConnectionValidated = function (f) {
        this.controller.onConnectionValidated = function (connection) { return f(connection); };
    };
    Graph.prototype.onNewNode = function (f) {
        this.controller.onNewNode.subscribe(f);
    };
    Graph.prototype.onRemoveNode = function (f) {
        this.controller.onRemoveNode.subscribe(f);
    };
    Graph.prototype.onMoveNode = function (f) {
        this.controller.onMoveNode.subscribe(f);
    };
    Graph.prototype.onMoveCanvas = function (f) {
        this.controller.onCenterCanvas.subscribe(f);
    };
    Graph.prototype.onScaleChanged = function (f) {
        this.controller.onScaleChanged.subscribe(f);
    };
    Graph.prototype.onDragConnectionLine = function (f) {
        this.controller.onDragConnectionLine.subscribe(f);
    };
    Graph.prototype.onRemoveConnectionLine = function (f) {
        this.controller.onRemoveConnectionLine.subscribe(f);
    };
    Graph.prototype.onNodeSelectionChanged = function (f) {
        this.controller.onNodeSelectionChanged.subscribe(f);
    };
    Graph.prototype.onNewConnection = function (f) {
        this.controller.onNewConnection.subscribe(f);
    };
    Graph.prototype.onUpdateConnection = function (f) {
        this.controller.onUpdateConnection.subscribe(f);
    };
    Graph.prototype.onConnectionTargetNotDefined = function (f) {
        this.controller.onConnectionTargetNotDefined.subscribe(f);
    };
    Graph.prototype.onRemoveConnection = function (f) {
        this.controller.onRemoveConnection.subscribe(f);
    };
    Graph.prototype.getNodes = function () {
        return this.controller.getNodes();
    };
    Graph.prototype.getNumberOfPortConnections = function (portId) {
        return this.controller.getNumberOfPortConnections(portId);
    };
    Graph.prototype.addConnection = function (nodeA, portA, nodeB, portB) {
        var connection = this.controller.createConnection(nodeA, portA, nodeB, portB);
        if (this.controller.requestAddConnection(connection)) {
            return connection;
        }
        return null;
    };
    Graph.prototype.removeConnection = function (connectionId) {
        this.controller.removeConnection(connectionId);
    };
    Graph.prototype.createNode = function () {
        return this.controller.createNode();
    };
    Graph.prototype.createPort = function () {
        return this.controller.createPort();
    };
    Graph.prototype.addNode = function (node) {
        this.controller.addNode(node);
    };
    Graph.prototype.removeNode = function (nodeId) {
        this.controller.removeNode(nodeId);
    };
    Graph.prototype.setScale = function (scale) {
        this.controller.setScale(scale);
    };
    Graph.prototype.moveTo = function (x, y) {
        this.controller.moveTo(x, y);
    };
    Graph.prototype.initStates = function () {
        AppFlow.init(this.controller);
    };
    Graph.prototype.getBoundingClientRect = function () {
        return this.renderer.getBoundingClientRect();
    };
    Graph.prototype.getNodeFromPortId = function (portId) {
        return this.controller.getNodeFromPortId(portId);
    };
    Graph.prototype.getPortConnections = function (portId) {
        return this.controller.getPortConnections(portId);
    };
    Graph.prototype.updateAllNodePositions = function () {
        this.controller.updateAllNodePositions();
    };
    Graph.prototype.clear = function () {
        this.controller.clear();
    };
    Graph.prototype.setNodeCaption = function (nodeId, caption) {
        this.controller.setNodeCaption(nodeId, caption);
    };
    Graph.prototype.setPortCaption = function (portId, caption) {
        this.controller.setPortCaption(portId, caption);
    };
    Graph.prototype.removePort = function (portId) {
        this.controller.removePort(portId);
    };
    Graph.prototype.addInPort = function (caption, nodeId) {
        this.controller.addInPort(caption, nodeId);
    };
    Graph.prototype.moveInPortDown = function (portId) {
        this.controller.moveInPortDown(portId);
    };
    Graph.prototype.moveInPortUp = function (portId) {
        this.controller.moveInPortUp(portId);
    };
    Graph.prototype.setCustomCssClass = function (nodeId, className) {
        this.controller.setCustomCssClass(nodeId, className);
    };
    Graph.prototype.removeCustomCssClass = function (nodeId, className) {
        this.controller.removeCustomCssClass(nodeId, className);
    };
    return Graph;
}());
export { Graph };
//# sourceMappingURL=Graph.js.map