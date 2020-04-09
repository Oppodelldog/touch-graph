import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";
import {Position} from "../data/Position";
import {Grabber} from "./Grabber";
import Node from "../data/Node";

export class Touched extends State {
    public touchStartPosition: Position;

    constructor(name: string, controller: Controller) {
        super(name, controller);
    }
}

export class MoveDiagram extends State {
    public grabber: Grabber;
    private readonly mouseMoveFunc: EventCallback;
    public isGrabbed: boolean = false;

    constructor(name: string, controller: Controller) {
        super(name, controller);
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

export class MoveNode extends State {
    public grabber: Grabber;
    private readonly mouseMoveFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
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


export class MovePort extends State {
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

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.mouseMoveFunc);
    }
}

class PinchPosition {
    Pos1: Position;
    Pos2: Position;
}

export class PinchZoom extends State {
    private readonly touchMoveFunc: EventCallback;
    private originalDistance: number = null;
    private originalScale: number;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.touchMoveFunc = this.onTouchMove.bind(this)
    }

    getDistance(x1, y1, x2, y2): number {
        const a = x1 - x2;
        const b = y1 - y2;

        return Math.sqrt(a * a + b * b);
    }

    onTouchMove(event, touchInputPos: Position, diagramInputPos: Position) {

        let touch1 = event.touches[0];
        let touch2 = event.touches[1];
        if (this.originalDistance === null) {
            this.originalDistance = this.getDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY)
            this.originalScale = this.controller.getScale();
        } else {
            let newDistance = this.getDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY)
            let change = this.originalDistance - newDistance;

            this.controller.setScale(this.originalScale - change / 1000)
        }
    }

    deactivate() {
        super.deactivate();
        this.originalDistance = null;
    }

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.touchMoveFunc)
    }
}

export class TouchStart extends Transition {
    private readonly touchStartFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.touchStartFunc = this.onTouchStart.bind(this)
    }

    onTouchStart(event, touchInputPos: Position) {
        (this.targetState as Touched).touchStartPosition = touchInputPos;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchStart, this.touchStartFunc);
    }
}


export abstract class SingleTouchMoveAbstract extends Transition {
    private readonly checkSingleTouchMoveFunc: EventCallback;

    protected constructor(name: string, controller: Controller) {
        super(name, controller);
        this.checkSingleTouchMoveFunc = this.onCheckSingleTouch.bind(this)
    }

    onCheckSingleTouch(event, touchInputPos: Position, diagramInputPos: Position) {
        if (event.targetTouches === undefined || event.targetTouches.length === 1) {
            this.onTouchMove(event, touchInputPos, diagramInputPos);
        }
    }

    abstract onTouchMove(event, touchInputPos: Position, diagramInputPos: Position);

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.checkSingleTouchMoveFunc);
    }
}

export abstract class MultiTouchMoveAbstract extends Transition {
    private readonly checkMultiTouchMoveFunc: EventCallback;
    private readonly numberOfTouches: Number;

    protected constructor(name: string, controller: Controller, numberOfTouches: Number) {
        super(name, controller);
        this.numberOfTouches = numberOfTouches;
        this.checkMultiTouchMoveFunc = this.onCheckMultiTouch.bind(this)
    }

    onCheckMultiTouch(event, touchInputPos: Position, diagramInputPos: Position) {
        if (event.touches != undefined && event.touches.length >= this.numberOfTouches) {
            this.onTouchMove(event, touchInputPos, diagramInputPos);
        }
    }

    abstract onTouchMove(event, touchInputPos: Position, diagramInputPos: Position);

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchMove, this.checkMultiTouchMoveFunc);
    }

}

export class TouchMoveOnDiagram extends SingleTouchMoveAbstract {

    constructor(name: string, controller: Controller) {
        super(name, controller);
    }

    onTouchMove(event, touchInputPos: Position) {
        if (!this.controller.isCanvasHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        if (this.controller.isNodeHovered(touchInputPos.x, touchInputPos.y)) {
            return false;
        }
        let startPos = (this.originState as Touched).touchStartPosition;
        this.controller.dragStartDiagram(startPos.x, startPos.y);
        (this.targetState as MoveDiagram).grabber.grab("diagram", null, startPos.x, startPos.y);
        this.switchState();
        event.preventDefault();
    };
}


export class TouchMoveOnNode extends SingleTouchMoveAbstract {
    constructor(name: string, controller: Controller) {
        super(name, controller);
    }

    onTouchMove(event, touchInputPos: Position, diagramInputPos: Position) {
        let hoveredNodeId = this.controller.getHoveredNodeId(touchInputPos.x, touchInputPos.y);
        const hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId !== "") {
            return;
        }
        const node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            (this.targetState as MoveNode).grabber.grab(node.id, node, diagramInputPos.x, diagramInputPos.y);
            this.switchState();
        }
    };
}


export class TouchMoveOnPort extends SingleTouchMoveAbstract {
    constructor(name: string, controller: Controller) {
        super(name, controller);
    }

    onTouchMove(event, touchInputPos: Position, diagramInputPos: Position) {
        const hoveredPortId = this.controller.getHoveredPortId(touchInputPos.x, touchInputPos.y);
        if (hoveredPortId === "") {
            return false;
        }
        (this.targetState as MovePort).grabber.grab(hoveredPortId, null, diagramInputPos.x, diagramInputPos.y);
        this.controller.updateGrabLine(diagramInputPos.x, diagramInputPos.y, diagramInputPos.x, diagramInputPos.y);
        this.switchState();
        event.preventDefault();
    };
}

export class DoubleTouchMove extends MultiTouchMoveAbstract {

    constructor(name: string, controller: Controller) {
        super(name, controller, 2);
    }

    onTouchMove(event, touchInputPos: Position, diagramInputPos: Position) {
        this.switchState();
        event.preventDefault();
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
        const grabber = (this.originState as MovePort).grabber;
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

export class ReleaseNode extends Transition {
    private readonly mouseUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event) {
        (this.originState as MoveNode).grabber.release();
        this.switchState();
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }
}

export class ReleaseDiagram extends Transition {
    private readonly mouseUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.mouseUpFunc = this.onMouseUp.bind(this);
    }

    private onMouseUp(event) {
        this.controller.dragStopDiagram();
        (this.originState as MoveDiagram).isGrabbed = false;
        this.switchState();
        event.preventDefault();
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.mouseUpFunc);
    }
}

export class TouchEnd extends Transition {
    private readonly touchEndFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.touchEndFunc = this.onTouchEnd.bind(this)
    }

    onTouchEnd(event, touchInputPos: Position) {
        if(event.touches === undefined || event.touches.length<=1) {
            this.switchState();
            event.preventDefault();
        }
    };

    activate() {
        super.activate();
        this.registerEventHandler(EventType.TouchEnd, this.touchEndFunc);
    }
}

