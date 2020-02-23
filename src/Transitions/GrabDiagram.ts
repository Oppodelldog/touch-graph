import {State, Transition} from "../State/State";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class DiagramGrabbed extends State {
    public grabber: Grabber;
    private controller: Controller;
    private readonly mouseMoveFunc: EventCallback;
    public isGrabbed: boolean = false;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    onMouseMove(event, touchInputPos: Position, diagramInputPos: Position) {
        this.controller.dragMoveDiagram(touchInputPos.x, touchInputPos.y);
        event.preventDefault();
    }

    activate() {
        super.activate();
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }

    deactivate() {
        super.deactivate();
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class GrabDiagram extends Transition {
    private controller: Controller;
    private readonly mouseDownFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    onMouseDown(event, touchInputPos: Position, diagramInputPos: Position) {
        if (!this.controller.isCanvasHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        this.controller.dragStartDiagram(touchInputPos.x, touchInputPos.y);
        (this.targetState as DiagramGrabbed).isGrabbed = true;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchStart, this.mouseDownFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class ReleaseDiagram extends Transition {
    private controller: Controller;
    private readonly mouseUpFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    onMouseUp(event, touchInputPos: Position, diagramInputPos: Position) {
        this.controller.dragStopDiagram();
        this.controller.syncOffset();
        (this.originState as DiagramGrabbed).isGrabbed = false;
        this.switchState();
        event.preventDefault();
    }

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}
