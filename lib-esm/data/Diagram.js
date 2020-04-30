var Diagram = /** @class */ (function () {
    function Diagram() {
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
    }
    Diagram.prototype.dragStart = function (x, y) {
        this.grabbed = true;
        this.grabbedAt = { x: x, y: y };
    };
    Diagram.prototype.getDraggedOffset = function (x, y) {
        var xOffset = this.grabbedAt.x - x;
        var yOffset = this.grabbedAt.y - y;
        this.grabbedAt.x = x;
        this.grabbedAt.y = y;
        return { x: xOffset, y: yOffset };
    };
    Diagram.prototype.dragStop = function () {
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
    };
    return Diagram;
}());
export { Diagram };
//# sourceMappingURL=Diagram.js.map