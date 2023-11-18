import { State, Transition } from "../Flow/State";
import { Controller } from "../Controller";
import { Position } from "../data/Position";
export declare class SelectingNodes extends State {
}
export declare class SelectNode extends Transition {
    private readonly clickFunc;
    constructor(name: string, controller: Controller);
    onClick(event: any, touchInput: Position): void;
    activate(): void;
}
export declare class SelectOneMoreNode extends Transition {
    private readonly clickFunc;
    constructor(name: string, controller: Controller);
    onClick(event: any, touchInput: Position): void;
    activate(): void;
}
export declare class DeSelectNode extends Transition {
    private readonly clickFunc;
    constructor(name: string, controller: Controller);
    private onClick;
    activate(): void;
}
export declare class SingleSelectionReturn extends Transition {
    constructor(name: string, controller: Controller);
    activate(): void;
}
export declare class TurnOnMultiNodeSelectionMode extends Transition {
    private readonly keyDownFunc;
    constructor(name: string, controller: Controller);
    private onKeyDownFunc;
    activate(): void;
}
export declare class TurnOffMultiNodeSelectionMode extends Transition {
    private readonly keyUpFunc;
    constructor(name: string, controller: Controller);
    private onKeyUpFunc;
    activate(): void;
}
