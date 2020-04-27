"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Connections = /** @class */ (function () {
    function Connections() {
        this.connections = new Array();
    }
    Connections.prototype.getById = function (connectionId) {
        var connections = this.connections.filter(function (connection) { return connection.id === connectionId; });
        if (connections.length === 1) {
            return connections[0];
        }
        throw new Error("Connection not found: " + connectionId);
    };
    Connections.prototype.getByPortId = function (portId) {
        return this.connections.filter(function (connection) { return connection.from.portId === portId || connection.to.portId === portId; });
    };
    Connections.prototype.getByNodeId = function (nodeId) {
        return this.connections.filter(function (connection) { return connection.to.nodeId === nodeId || connection.from.nodeId === nodeId; });
    };
    Connections.prototype.push = function (connection) {
        this.connections.push(connection);
    };
    Connections.prototype.remove = function (connectionId) {
        this.connections = this.connections.filter(function (connection) { return connection.id !== connectionId; });
    };
    Connections.prototype.forEach = function (forEachCallback) {
        this.connections.forEach(function (c) { return forEachCallback(c); });
    };
    return Connections;
}());
exports.Connections = Connections;
//# sourceMappingURL=Connections.js.map