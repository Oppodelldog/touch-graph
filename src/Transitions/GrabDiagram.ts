import {State, Transition} from "../State/State";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";

export class DiagramGrabbed extends State {
    public grabber: Grabber;
    private controller: Controller;
    private readonly mouseMoveFunc: Function;
    public isGrabbed: boolean = false;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    onMouseMove(event) {
        const x = event.clientX;
        const y = event.clientY;
        const mousePos = {x: x, y: y} as Position;
        this.controller.dragMoveDiagram(mousePos.x, mousePos.y);
        event.preventDefault();
    }

    activate() {
        super.activate();
        this.controller.getCanvasElement().addEventListener("mousemove", this.mouseMoveFunc);
    }

    deactivate() {
        super.deactivate();
        this.controller.getCanvasElement().removeEventListener("mousemove", this.mouseMoveFunc);
    }
}

export class GrabDiagram extends Transition {
    private controller: Controller;
    private readonly mouseDownFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    onMouseDown(event) {
        const x = event.clientX;
        const y = event.clientY;
        const mousePos = {x: x, y: y} as Position;
        if (!this.controller.isCanvasHovered(mousePos.x, mousePos.y)) {
            return false;
        }
        this.controller.dragStartDiagram(mousePos.x, mousePos.y);
        (this.targetState as DiagramGrabbed).isGrabbed = true;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        this.controller.getCanvasElement().addEventListener("mousedown", this.mouseDownFunc);
    }

    deactivate() {
        this.controller.getCanvasElement().removeEventListener("mousedown", this.mouseDownFunc);
    }
}

export class ReleaseDiagram extends Transition {
    private controller: Controller;
    private readonly mouseUpFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    onMouseUp(event) {
        this.controller.dragStopDiagram();
        this.controller.syncOffset();
        (this.state as DiagramGrabbed).isGrabbed = false;
        this.switchState();
        event.preventDefault();
    }

    activate() {
        this.controller.getCanvasElement().addEventListener("mouseup", this.mouseUpFunc);
    }

    deactivate() {
        this.controller.getCanvasElement().removeEventListener("mouseup", this.mouseUpFunc);
    }
}
