import { State, Transition } from "../Flow/State";
import { Controller } from "../Controller";
export declare class AdjustingFocus extends State {
    targetPosX: number;
    targetPosY: number;
    constructor(name: string, controller: Controller);
    activate(): void;
}
export declare class DoubleClick extends Transition {
    private readonly doubleClickFunc;
    constructor(name: string, controller: Controller);
    private onDoubleClick;
    activate(): void;
}
export declare class FocusAdjustmentFinished extends Transition {
    constructor(name: string, controller: Controller);
    activate(): void;
}
