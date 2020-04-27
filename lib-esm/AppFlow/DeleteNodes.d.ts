import { State, Transition } from "../Flow/State";
import { Controller } from "../Controller";
export declare class DeletingNodes extends State {
}
export declare class DeleteNodes extends Transition {
    private readonly keyUpFunc;
    constructor(name: string, controller: Controller);
    private onKeyUp;
    activate(): void;
}
export declare class NodesDeleted extends Transition {
    activate(): void;
}
