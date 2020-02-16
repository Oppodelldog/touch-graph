import {DragAction} from "./DragActionInterface";
import {Position} from "../data/Position";
import {Controller} from "../Controller";

export class DragDiagramAction implements DragAction {
    private isGrabbed: boolean;
    private controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
        this.isGrabbed = false;
    }

    isActive(): boolean {
        return this.isGrabbed;
    }

    start(mousePos: Position, diagramPos: Position): boolean {
        if (!this.controller.isCanvasHovered(mousePos.x, mousePos.y)) {
            return false;
        }
        this.controller.dragStartDiagram(mousePos.x, mousePos.y);
        this.isGrabbed = true;
        return true;
    }

    move(mousePos: Position, diagramPointerPos: Position): void {
        this.controller.dragMoveDiagram(mousePos.x, mousePos.y);
    }


    end(mousePos: Position, diagramPos: Position): void {
        this.controller.dragStopDiagram();
        this.controller.syncOffset();
        this.isGrabbed = false;
    }
}
