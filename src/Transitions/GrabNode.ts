import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import Node from "../data/Node";
import {EventCallback, EventType} from "../ViewEvents";

export class NodeGrabbed extends State {
    public readonly grabber: Grabber;
    private readonly controller: Controller;
    private readonly mouseMoveFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    private onMouseMove(event, touchInputPos: Position, diagramInputPos: Position) {
        this.grabber.setObjectPos(diagramInputPos.x, diagramInputPos.y);
        const node = this.grabber.getObject() as Node;
        this.controller.updateNodePos(node);
        this.controller.renderNodeConnections(node);
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }

    public deactivate() {
        super.deactivate();
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class GrabNode extends Transition {
    private controller: Controller;
    private readonly mouseDownFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    private onMouseDown(event, touchInputPos: Position, diagramInputPos: Position) {
        let hoveredNodeId = this.controller.getHoveredNodeId(touchInputPos.x, touchInputPos.y);
        const hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId !== "") {
            return;
        }
        const node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            (this.targetState as NodeGrabbed).grabber.grab(node.id, node, diagramInputPos.x, diagramInputPos.y);
            this.switchState();
        }
        event.preventDefault();
    };

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchStart, this.mouseDownFunc);
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class ReleaseNode extends Transition {
    private controller: Controller;
    private readonly mouseUpFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event) {
        (this.originState as NodeGrabbed).grabber.release();
        this.switchState();
        event.preventDefault();
    }

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}
