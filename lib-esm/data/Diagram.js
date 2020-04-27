var Diagram = /** @class */ (function () {
    function Diagram() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
        this.xDrag = 0;
        this.xDrag = 0;
    }
    Diagram.prototype.dragStart = function (x, y) {
        this.grabbed = true;
        this.grabbedAt = { x: x, y: y };
    };
    Diagram.prototype.dragMove = function (x, y) {
        this.xDrag = this.xOffset + (x - this.grabbedAt.x);
        this.yDrag = this.yOffset + (y - this.grabbedAt.y);
    };
    Diagram.prototype.dragStop = function () {
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
        this.xOffset = this.xDrag;
        this.yOffset = this.yDrag;
        this.xDrag = 0;
        this.yDrag = 0;
    };
    return Diagram;
}());
export { Diagram };
//# sourceMappingURL=Diagram.js.map