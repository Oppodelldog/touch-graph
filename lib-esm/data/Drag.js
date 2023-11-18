var Drag = /** @class */ (function () {
    function Drag() {
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
    }
    Drag.prototype.dragStart = function (x, y) {
        this.grabbed = true;
        this.grabbedAt = { x: x, y: y };
    };
    Drag.prototype.getDraggedOffset = function (x, y) {
        var xOffset = this.grabbedAt.x - x;
        var yOffset = this.grabbedAt.y - y;
        this.grabbedAt.x = x;
        this.grabbedAt.y = y;
        return { x: xOffset, y: yOffset };
    };
    Drag.prototype.dragStop = function () {
        this.grabbed = false;
        this.grabbedAt = { x: 0, y: 0 };
    };
    return Drag;
}());
export { Drag };
//# sourceMappingURL=Drag.js.map