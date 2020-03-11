import {State, Transition} from "../Flow/State";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class PortGrabbed extends State {
    public grabber: Grabber;
    private readonly mouseMoveFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    onMouseMove(event, touchInputPos: Position, diagramInputPos: Position) {
        let x1 = this.grabber.x;
        let y1 = this.grabber.y;
        this.controller.updateGrabLine(x1, y1, diagramInputPos.x, diagramInputPos.y);
        event.preventDefault();
    }

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }
}

export class GrabPort extends Transition {
    private readonly mouseDownFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    onMouseDown(event, touchInputPos: Position, diagramInputPos: Position) {
        const hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId === "") {
            return false;
        }
        (this.targetState as PortGrabbed).grabber.grab(hoveredPortId, null, diagramInputPos.x, diagramInputPos.y);
        this.controller.updateGrabLine(diagramInputPos.x, diagramInputPos.y, diagramInputPos.x, diagramInputPos.y);
        this.switchState();
        event.preventDefault();
    };

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchStart, this.mouseDownFunc);
    }
}

export class ReleasePort extends Transition {
    private readonly mouseUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event, touchInputPos: Position) {
        const grabber = (this.originState as PortGrabbed).grabber;
        // TODO: View logic from controller
        let targetPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (targetPortId) {

            let grabbedPortId = grabber.name;
            // TODO: View logic from controller
            let grabbedNode = this.controller.getNodeFromPortId(grabbedPortId);
            // TODO: View logic from controller
            let targetNode = this.controller.getNodeFromPortId(targetPortId);
            let connection = this.controller.createConnection(grabbedNode.id, grabbedPortId, targetNode.id, targetPortId);
            if (this.controller.addConnection(connection)) {
                this.controller.updateConnection(connection);
            }
        }
        this.controller.removeGrabLine();
        grabber.release();
        this.switchState();

        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }
}
