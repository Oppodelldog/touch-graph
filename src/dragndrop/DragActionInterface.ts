import {Position} from "../data/Position";

export interface DragAction {
    isActive(): boolean;

    start(mousePos: Position, diagramPos: Position): boolean;

    move(mousePos: Position, diagramPointerPos: Position): void;

    end(mousePos: Position, diagramPos: Position): void;
}
