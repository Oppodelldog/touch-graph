import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";
import {Position} from "../data/Position";

export class AdjustingFocus extends State {
    private controller: Controller;
    targetPosX: number;
    targetPosY: number;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    activate() {
        this.controller.center(this.targetPosX, this.targetPosY);
        super.activate();
    }

    deactivate() {
        super.deactivate();
    }
}

export class DoubleClick extends Transition {
    private controller: Controller;
    private readonly doubleClickFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.doubleClickFunc = this.onDoubleClick.bind(this)
    }

    onDoubleClick(event, touchInputPos: Position) {
        const targetState = this.targetState as AdjustingFocus;
        targetState.targetPosX = touchInputPos.x;
        targetState.targetPosY = touchInputPos.y;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.DoubleClick, this.doubleClickFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class FocusAdjustmentFinished extends Transition {
    private controller: Controller;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    activate() {
        this.switchState();
    }

    deactivate() {
    }
}

