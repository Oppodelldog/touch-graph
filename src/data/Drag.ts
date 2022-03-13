export class Drag {
    public grabbed: boolean;
    public grabbedAt: { x: number; y: number };

    constructor() {
        this.grabbed = false;
        this.grabbedAt = {x: 0, y: 0};
    }

    public dragStart(x, y) {
        this.grabbed = true;
        this.grabbedAt = {x: x, y: y}
    }

    public getDraggedOffset(x, y) {
        let xOffset = this.grabbedAt.x - x;
        let yOffset = this.grabbedAt.y - y;
        this.grabbedAt.x = x;
        this.grabbedAt.y = y;

        return {x: xOffset, y: yOffset};
    }

    public dragStop() {
        this.grabbed = false;
        this.grabbedAt = {x: 0, y: 0};
    }
}

