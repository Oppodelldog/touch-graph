import { Controller } from "./Controller";
import { Renderer } from "./Renderer";
import { AppFlow } from "./AppFlow";
var Graph = /** @class */ (function () {
    function Graph() {
        this.renderer = new Renderer();
        this.controller = new Controller(this.renderer);
        this.renderer.bind(this.controller);
        this.initStates();
    }
    Graph.prototype.onValidateNewConnection = function (f) {
        this.controller.onValidateNewConnection = function (connection) { return f(connection); };
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
        this.controller.onMoveCanvas.subscribe(f);
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
        if (this.controller.addConnection(connection)) {
            return connection;
        }
        return null;
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
    return Graph;
}());
export { Graph };
//# sourceMappingURL=Graph.js.map