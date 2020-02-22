import {State, Transition} from "../State/State";


interface ControllerInterface {
    getCanvasElement()

    center(x: number, y: number)
}

export class AdjustingFocus extends State {
    private controller: ControllerInterface;
    targetPosX: number;
    targetPosY: number;

    constructor(name: string, controller: ControllerInterface) {
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
    private controller: ControllerInterface;
    private readonly doubleClickFunc: Function;

    constructor(name: string, controller: ControllerInterface) {
        super(name);
        this.controller = controller;
        this.doubleClickFunc = this.onDoubleClick.bind(this)
    }

    onDoubleClick(event) {
        const targetState = this.targetState as AdjustingFocus;
        targetState.targetPosX = event.clientX;
        targetState.targetPosY = event.clientY;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        this.controller.getCanvasElement().addEventListener("dblclick", this.doubleClickFunc);
    }

    deactivate() {
        this.controller.getCanvasElement().removeEventListener("dblclick", this.doubleClickFunc);
    }
}

export class FocusAdjustmentFinished extends Transition {
    constructor(name: string) {
        super(name);
    }

    activate() {
        this.switchState();
    }

    deactivate() {
    }
}
