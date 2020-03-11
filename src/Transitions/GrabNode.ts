import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import Node from "../data/Node";
import {EventCallback, EventType} from "../ViewEvents";

export class NodeGrabbed extends State {
    public readonly grabber: Grabber;
    private readonly mouseMoveFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    private onMouseMove(event, touchInputPos: Position, diagramInputPos: Position) {
        this.grabber.setObjectPos(diagramInputPos.x, diagramInputPos.y);
        const node = this.grabber.getObject() as Node;
        this.controller.updateNodePos(node);
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }
}

export class GrabNode extends Transition {
    private readonly mouseDownFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    private onMouseDown(event, touchInputPos: Position, diagramInputPos: Position) {
        let hoveredNodeId = this.controller.getHoveredNodeId(touchInputPos.x, touchInputPos.y);
        const hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId !== "") {
            return;
        }
        // TODO: View logic from controller
        const node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            (this.targetState as NodeGrabbed).grabber.grab(node.id, node, diagramInputPos.x, diagramInputPos.y);
            this.switchState();
        }
        event.preventDefault();
    };

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchStart, this.mouseDownFunc);
    }
}

export class ReleaseNode extends Transition {
    private readonly mouseUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event) {
        (this.originState as NodeGrabbed).grabber.release();
        this.switchState();
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }
}
