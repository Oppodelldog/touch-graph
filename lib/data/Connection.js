"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Connection = /** @class */ (function () {
    function Connection() {
        this.id = null;
        this.from = new ConnectionEndpoint();
        this.to = new ConnectionEndpoint();
    }
    return Connection;
}());
exports.Connection = Connection;
var ConnectionEndpoint = /** @class */ (function () {
    function ConnectionEndpoint() {
        this.nodeId = "";
        this.portId = "";
    }
    return ConnectionEndpoint;
}());
exports.ConnectionEndpoint = ConnectionEndpoint;
//# sourceMappingURL=Connection.js.map