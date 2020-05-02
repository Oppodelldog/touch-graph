var Node = /** @class */ (function () {
    function Node() {
        this.x = 0;
        this.y = 0;
        this.id = "";
        this.portsIn = [];
        this.portsOut = [];
        this.type = "";
        this.caption = "";
        this.customClass = "";
        this.userData = {};
    }
    Node.prototype.hasPort = function (portId) {
        return this.portsIn.concat(this.portsOut).filter(function (port) { return port.id === portId; }).length !== 0;
    };
    Node.prototype.getPortById = function (portId) {
        var ports = this.portsIn.concat(this.portsOut).filter(function (port) { return port.id === portId; });
        if (ports.length === 1) {
            return ports[0];
        }
        return null;
    };
    Node.prototype.removePort = function (portId) {
        this.portsIn = this.portsIn.filter(function (port) { return port.id !== portId; });
        this.portsOut = this.portsOut.filter(function (port) { return port.id !== portId; });
    };
    Node.prototype.isInPort = function (portId) {
        return this.portsIn.filter(function (port) { return port.id === portId; }).length === 1;
    };
    Node.prototype.isOutPort = function (portId) {
        return this.portsOut.filter(function (port) { return port.id === portId; }).length === 1;
    };
    Node.prototype.addInPort = function (port) {
        this.portsIn.push(port);
    };
    Node.prototype.addOutPort = function (port) {
        this.portsOut.push(port);
    };
    return Node;
}());
export default Node;
//# sourceMappingURL=Node.js.map