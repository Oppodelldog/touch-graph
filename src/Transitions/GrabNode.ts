import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Node} from "../data/Node";

export class NodeGrabbed extends State {
    public grabber: Grabber;
    private controller: Controller;
    private readonly mouseMoveFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.grabber = new Grabber();
        this.mouseMoveFunc = this.onMouseMove.bind(this)
    }

    onMouseMove(event) {
        const x = event.clientX;
        const y = event.clientY;
        const diagramPos = this.controller.getDiagramPos(x, y);
        this.grabber.setObjectPos(diagramPos.x, diagramPos.y);
        const node = this.grabber.getObject() as Node;
        this.controller.updateNodePos(node);
        this.controller.renderNodeConnections(node);
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

export class GrabNode extends Transition {
    private controller: Controller;
    private readonly mouseDownFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseDownFunc = this.onMouseDown.bind(this)
    }

    onMouseDown(event) {
        const mousePos = {x: event.clientX, y: event.clientY} as Position;
        const diagramPos = this.controller.getDiagramPos(event.clientX, event.clientY);
        let hoveredNodeId = this.controller.getHoveredNodeId(mousePos.x, mousePos.y);
        const hoveredPortId = this.controller.getHoveredPortId(mousePos.x, mousePos.y);
        if (hoveredPortId !== "") {
            return;
        }
        const node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            (this.targetState as NodeGrabbed).grabber.grab(node.id, node, diagramPos.x, diagramPos.y);
            this.switchState();
        }
        event.preventDefault();
    };

    activate() {
        this.controller.getCanvasElement().addEventListener("mousedown", this.mouseDownFunc);
    }

    deactivate() {
        this.controller.getCanvasElement().removeEventListener("mousedown", this.mouseDownFunc);
    }
}

export class ReleaseNode extends Transition {
    private controller: Controller;
    private readonly mouseUpFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    onMouseUp(event) {
        (this.state as NodeGrabbed).grabber.release();
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
