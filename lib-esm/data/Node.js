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
    }
    Node.prototype.hasPort = function (portId) {
        return this.portsIn.concat(this.portsOut).filter(function (port) { return port.id === portId; }).length !== 0;
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