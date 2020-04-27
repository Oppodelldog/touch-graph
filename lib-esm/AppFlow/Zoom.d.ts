import { State, Transition } from "../Flow/State";
import { Controller } from "../Controller";
export declare class MouseZooming extends State {
    currentScale: number;
    targetScale: any;
    constructor(name: string, controller: Controller);
    activate(): void;
}
export declare class UseMousewheel extends Transition {
    private readonly wheelFunc;
    constructor(name: string, controller: Controller);
    private wheel;
    activate(): void;
}
export declare class ZoomFinished extends Transition {
    activate(): void;
}
