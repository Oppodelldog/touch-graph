export var PortDirection;
(function (PortDirection) {
    PortDirection[PortDirection["Unknown"] = 0] = "Unknown";
    PortDirection[PortDirection["Input"] = 1] = "Input";
    PortDirection[PortDirection["Output"] = 2] = "Output";
})(PortDirection || (PortDirection = {}));
var Nodes = /** @class */ (function () {
    function Nodes() {
        this.nodes = new Array();
    }
    Nodes.prototype.getById = function (nodeId) {
        var nodes = this.nodes.filter(function (node) { return node.id === nodeId; });
        if (nodes.length === 1) {
            return nodes[0];
        }
        return null;
    };
    Nodes.prototype.getPortDirection = function (portId) {
        if (this.isInPort(portId)) {
            return PortDirection.Input;
        }
        else if (this.isOutPort(portId)) {
            return PortDirection.Output;
        }
        return PortDirection.Unknown;
    };
    Nodes.prototype.getNodeFromPortId = function (portId) {
        var result = this.nodes.filter(function (node) { return node.hasPort(portId); });
        if (result.length === 1) {
            return result[0];
        }
        throw new Error("node not found for portId '" + portId + "'");
    };
    Nodes.prototype.isInPort = function (portId) {
        return this.getNodeFromPortId(portId).isInPort(portId);
    };
    Nodes.prototype.isOutPort = function (portId) {
        return this.getNodeFromPortId(portId).isOutPort(portId);
    };
    Nodes.prototype.push = function (node) {
        this.nodes.push(node);
    };
    Nodes.prototype.forEach = function (forEachCallback) {
        this.nodes.forEach(function (n) { return forEachCallback(n); });
    };
    Nodes.prototype.getAll = function () {
        return this.nodes;
    };
    Nodes.prototype.remove = function (nodeId) {
        var node = this.getById(nodeId);
        if (node !== null) {
            var index = this.nodes.indexOf(node);
            this.nodes.splice(index, 1);
        }
        else {
            throw new Error("node not found:" + nodeId);
        }
    };
    return Nodes;
}());
export default Nodes;
//# sourceMappingURL=Nodes.js.map