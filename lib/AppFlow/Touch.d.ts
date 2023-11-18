import { State, Transition } from "../Flow/State";
import { Controller } from "../Controller";
import { Position } from "../data/Position";
import { Grabber } from "./Grabber";
export declare class Touched extends State {
    touchStartPosition: Position;
    constructor(name: string, controller: Controller);
}
export declare class MoveDiagram extends State {
    grabber: Grabber;
    private readonly mouseMoveFunc;
    isGrabbed: boolean;
    constructor(name: string, controller: Controller);
    private onMouseMove;
    activate(): void;
}
export declare class MoveNode extends State {
    grabber: Grabber;
    private readonly mouseMoveFunc;
    constructor(name: string, controller: Controller);
    private onMouseMove;
    activate(): void;
}
export declare class MovePort extends State {
    grabber: Grabber;
    private readonly mouseMoveFunc;
    constructor(name: string, controller: Controller);
    onMouseMove(event: any, touchInputPos: Position, diagramInputPos: Position): void;
    activate(): void;
}
export declare class PinchZoom extends State {
    private readonly touchMoveFunc;
    private originalDistance;
    private originalScale;
    constructor(name: string, controller: Controller);
    getDistance(x1: any, y1: any, x2: any, y2: any): number;
    onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): void;
    deactivate(): void;
    activate(): void;
}
export declare class TouchStart extends Transition {
    private readonly touchStartFunc;
    constructor(name: string, controller: Controller);
    onTouchStart(event: any, touchInputPos: Position): void;
    activate(): void;
}
export declare abstract class SingleTouchMoveAbstract extends Transition {
    private readonly checkSingleTouchMoveFunc;
    protected constructor(name: string, controller: Controller);
    onCheckSingleTouch(event: any, touchInputPos: Position, diagramInputPos: Position): void;
    abstract onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): any;
    activate(): void;
}
export declare abstract class MultiTouchMoveAbstract extends Transition {
    private readonly checkMultiTouchMoveFunc;
    private readonly numberOfTouches;
    protected constructor(name: string, controller: Controller, numberOfTouches: Number);
    onCheckMultiTouch(event: any, touchInputPos: Position, diagramInputPos: Position): void;
    abstract onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): any;
    activate(): void;
}
export declare class TouchMoveOnDiagram extends SingleTouchMoveAbstract {
    constructor(name: string, controller: Controller);
    onTouchMove(event: any, touchInputPos: Position): boolean;
}
export declare class TouchMoveOnNode extends SingleTouchMoveAbstract {
    constructor(name: string, controller: Controller);
    onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): void;
}
export declare class TouchMoveOnPort extends SingleTouchMoveAbstract {
    constructor(name: string, controller: Controller);
    onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): boolean;
}
export declare class DoubleTouchMove extends MultiTouchMoveAbstract {
    constructor(name: string, controller: Controller);
    onTouchMove(event: any, touchInputPos: Position, diagramInputPos: Position): void;
}
export declare class ReleasePort extends Transition {
    private readonly mouseUpFunc;
    constructor(name: string, controller: Controller);
    private onMouseUp;
    activate(): void;
}
export declare class ReleaseNode extends Transition {
    private readonly mouseUpFunc;
    constructor(name: string, controller: Controller);
    private onMouseUp;
    activate(): void;
}
export declare class ReleaseDiagram extends Transition {
    private readonly mouseUpFunc;
    constructor(name: string, controller: Controller);
    private onMouseUp;
    activate(): void;
}
export declare class TouchEnd extends Transition {
    private readonly touchEndFunc;
    constructor(name: string, controller: Controller);
    onTouchEnd(event: any, touchInputPos: Position): void;
    activate(): void;
}
