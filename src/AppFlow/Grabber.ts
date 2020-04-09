import {Position} from "../data/Position";

export class Grabber {
    public name: string = "";
    public grabbedObject: Position | null = null;
    public x: number;
    public y: number;

    public setObjectPos(x: number, y: number) {
        if (this.grabbedObject !== null) {
            this.grabbedObject.x = x - this.x;
            this.grabbedObject.y = y - this.y;
        }
    }

    public getObject(): Position {
        return this.grabbedObject;
    }

    public grab(name: string, object: Position | null, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.name = name;
        if (object !== null) {
            this.grabbedObject = object;
            this.x = x - object.x;
            this.y = y - object.y;
        }
    }

    public release() {
        this.name = "";
        this.grabbedObject = null;
        this.x = 0;
        this.y = 0;
    }
}
