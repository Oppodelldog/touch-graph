import {State, Transition} from "../Flow/State";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class DiagramGrabbed extends State {
    public grabber: Grabber;
    private readonly mouseMoveFunc: EventCallback;
    public isGrabbed: boolean = false;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    private onMouseMove(event, touchInputPos: Position) {
        this.controller.dragMoveDiagram(touchInputPos.x, touchInputPos.y);
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }
}

export class GrabDiagram extends Transition {
    private readonly mouseDownFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    onMouseDown(event, touchInputPos: Position) {
        console.log("sasas");
        // TODO: View logic from controller
        if (!this.controller.isCanvasHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        this.controller.dragStartDiagram(touchInputPos.x, touchInputPos.y);
        (this.targetState as DiagramGrabbed).isGrabbed = true;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchStart, this.mouseDownFunc);
    }
}

export class ReleaseDiagram extends Transition {
    private readonly mouseUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event) {
        this.controller.dragStopDiagram();
        (this.originState as DiagramGrabbed).isGrabbed = false;
        this.switchState();
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }
}
