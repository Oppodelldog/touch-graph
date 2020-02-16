import {DragAction} from "./DragActionInterface";
import {Position} from "../data/Position";

export class DragActions implements DragAction {

    private readonly actions: DragAction[];

    constructor(actions: DragAction[]) {
        this.actions = actions;
    }

    isActive(): boolean {
        for (let action of this.actions) {
            if (action.isActive()) {
                return true;
            }
        }

        return false;
    }


    start(mousePos: Position, diagramPos: Position): boolean {
        for (let action of this.actions) {
            if (!action.start(mousePos, diagramPos)) {
                continue;
            }
            return true;
        }
    }

    move(mousePos: Position, diagramPos: Position): void {
        for (let action of this.actions) {
            if (!action.isActive()) {
                continue;
            }

            action.move(mousePos, diagramPos);
            break;
        }
    }

    end(mousePos: Position, diagramPos: Position): void {
        for (let action of this.actions) {
            if (!action.isActive()) {
                continue;
            }

            action.end(mousePos, diagramPos);
            break;
        }
    }
}
