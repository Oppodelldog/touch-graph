var Connection = /** @class */ (function () {
    function Connection() {
        this.id = null;
        this.from = new ConnectionEndpoint();
        this.to = new ConnectionEndpoint();
    }
    return Connection;
}());
export { Connection };
var ConnectionEndpoint = /** @class */ (function () {
    function ConnectionEndpoint() {
        this.nodeId = "";
        this.portId = "";
    }
    return ConnectionEndpoint;
}());
export { ConnectionEndpoint };
//# sourceMappingURL=Connection.js.map