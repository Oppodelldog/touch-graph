import { Position } from "../data/Position";
export declare class Grabber {
    name: string;
    grabbedObject: Position | null;
    x: number;
    y: number;
    setObjectPos(x: number, y: number): void;
    getObject(): Position;
    grab(name: string, object: Position | null, x: number, y: number): void;
    release(): void;
}
