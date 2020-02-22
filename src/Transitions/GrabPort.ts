import {State, Transition} from "../State/State";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";

export class PortGrabbed extends State {
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
        let x1 = this.grabber.x;
        let y1 = this.grabber.y;
        this.controller.updateGrabLine(x1, y1, diagramPos.x, diagramPos.y);
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

export class GrabPort extends Transition {
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
        const hoveredPortId = this.controller.getHoveredPortId(mousePos.x, mousePos.y);
        if (hoveredPortId === "") {
            return false;
        }
        (this.targetState as PortGrabbed).grabber.grab(hoveredPortId, null, diagramPos.x, diagramPos.y);
        this.controller.updateGrabLine(diagramPos.x, diagramPos.y, diagramPos.x, diagramPos.y);
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

export class ReleasePort extends Transition {
    private controller: Controller;
    private readonly mouseUpFunc: Function;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    onMouseUp(event) {
        const grabber = (this.state as PortGrabbed).grabber;
        const mousePos = {x: event.clientX, y: event.clientY} as Position;
        let targetPortId = this.controller.getHoveredPortId(mousePos.x, mousePos.y);
        if (targetPortId) {

            let grabbedPortId = grabber.name;
            let grabbedNode = this.controller.getNodeFromPortId(grabbedPortId);
            let targetNode = this.controller.getNodeFromPortId(targetPortId);
            let connection = this.controller.createConnection(grabbedNode.id, grabbedPortId, targetNode.id, targetPortId);
            if (this.controller.addConnection(connection)) {
                this.controller.renderConnection(connection);
            }

        }
        this.controller.removeGrabLine();
        grabber.release();
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
