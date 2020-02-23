export class Diagram {
    public xOffset: number;
    public yOffset: number;
    public grabbed: boolean;
    public grabbedAt: { x: number; y: number };
    public xDrag: number;
    public yDrag: number;

    constructor() {
        this.xOffset = 0;
        this.yOffset = 0;

        this.grabbed = false;
        this.grabbedAt = {x: 0, y: 0};
        this.xDrag = 0;
        this.xDrag = 0;
    }

    dragStart(x, y) {
        this.grabbed = true;
        this.grabbedAt = {x: x, y: y}
    }

    dragMove(x, y) {
        this.xDrag = this.xOffset + (x - this.grabbedAt.x);
        this.yDrag = this.yOffset + (y - this.grabbedAt.y);
    }

    dragStop() {
        this.grabbed = false;
        this.grabbedAt = {x: 0, y: 0};
        this.xOffset = this.xDrag;
        this.yOffset = this.yDrag;
        this.xDrag = 0;
        this.yDrag = 0;
    }
}

