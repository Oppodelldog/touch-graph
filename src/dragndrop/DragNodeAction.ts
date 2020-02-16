import {DragAction} from "./DragActionInterface";
import {Position} from "../data/Position";
import {Node} from "../data/Node";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";

export class DragNodeAction implements DragAction {
    private grabber: Grabber;
    private controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
        this.grabber = new Grabber();
    }

    isActive(): boolean {
        return this.grabber.isGrabbed();
    }

    start(mousePos: Position, diagramPos: Position): boolean {
        let hoveredNodeId = this.controller.getHoveredNodeId(mousePos.x, mousePos.y);
        const node = this.controller.getNodeById(hoveredNodeId);
        if (node !== null) {
            this.grabber.grab(node.id, node, diagramPos.x, diagramPos.y);
            return true;
        }
        return false;
    }

    move(mousePos: Position, diagramPos: Position): void {
        this.grabber.setObjectPos(diagramPos.x, diagramPos.y);
        this.updateNodeWithLines(this.grabber.getObject() as Node);
    }

    end(mousePos: Position, diagramPos: Position): void {
        this.grabber.release();
    }

    private updateNodeWithLines(node: Node): void {
        this.controller.updateNodePos(node);
        this.controller.renderNodeConnections(node);
    }
}
