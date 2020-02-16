import {Position} from "../data/Position";
import {DragAction} from "./DragActionInterface";
import {Grabber} from "./Grabber";
import {Controller} from "../Controller";

export class DragPortAction implements DragAction {
    private grabber: Grabber;
    private controller: Controller;

    constructor(controller: Controller) {
        this.grabber = new Grabber();
        this.controller = controller;
    }

    isActive(): boolean {
        return this.grabber.isGrabbed();
    }

    start(mousePos: Position, diagramPos: Position): boolean {
        const hoveredPortId = this.controller.getHoveredPortId(mousePos.x, mousePos.y);
        if (hoveredPortId === "") {
            return false;
        }
        this.grabber.grab(hoveredPortId, null, diagramPos.x, diagramPos.y);
        this.controller.updateGrabLine(diagramPos.x, diagramPos.y, diagramPos.x, diagramPos.y);

        return true;
    }

    move(mousePos: Position, diagramPointerPos: Position) {
        let x1 = this.grabber.x;
        let y1 = this.grabber.y;
        this.controller.updateGrabLine(x1, y1, diagramPointerPos.x, diagramPointerPos.y);
    }

    end(mousePos: Position, diagramPos: Position) {
        let targetPortId = this.controller.getHoveredPortId(mousePos.x, mousePos.y);
        if (targetPortId) {
            let grabbedPortId = this.grabber.name;
            let grabbedNode = this.controller.getNodeFromPortId(grabbedPortId);
            let targetNode = this.controller.getNodeFromPortId(targetPortId);
            let connection = this.controller.createConnection(grabbedNode.id, grabbedPortId, targetNode.id, targetPortId);
            if (this.controller.addConnection(connection)) {
                this.controller.renderConnection(connection);
            }
        }
        this.controller.removeGrabLine();
        this.grabber.release();
    }
}
