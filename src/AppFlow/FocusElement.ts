import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";
import {Position} from "../data/Position";

export class AdjustingFocus extends State {
    targetPosX: number;
    targetPosY: number;

    constructor(name: string, controller: Controller) {
        super(name,controller);
    }

    public activate() {
        this.controller.center(this.targetPosX, this.targetPosY);
        super.activate();
    }
}

export class DoubleClick extends Transition {
    private readonly doubleClickFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.doubleClickFunc = this.onDoubleClick.bind(this)
    }

    private onDoubleClick(event, touchInputPos: Position) {
        const targetState = this.targetState as AdjustingFocus;
        targetState.targetPosX = touchInputPos.x;
        targetState.targetPosY = touchInputPos.y;
        this.switchState();
        event.preventDefault();
    };

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.DoubleClick, this.doubleClickFunc)
    }
}

export class FocusAdjustmentFinished extends Transition {

    constructor(name: string, controller: Controller) {
        super(name,controller);
    }

    public activate() {
        this.switchState();
    }
}
