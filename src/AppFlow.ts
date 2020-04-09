import {Builder} from "./Flow/Builder";
import {State, Transition} from "./Flow/State";
import {Idle} from "./AppFlow/Idle";
import {UseMousewheel, ZoomFinished, MouseZooming} from "./AppFlow/Zoom";
import {AdjustingFocus, DoubleClick, FocusAdjustmentFinished} from "./AppFlow/FocusElement";
import {
    DeSelectNode,
    SelectingNodes,
    SelectNode,
    SelectOneMoreNode,
    SingleSelectionReturn,
    TurnOffMultiNodeSelectionMode,
    TurnOnMultiNodeSelectionMode
} from "./AppFlow/SelectNode";
import {DeleteNodes, DeletingNodes, NodesDeleted} from "./AppFlow/DeleteNodes";
import {Controller} from "./Controller";
import {
    MoveDiagram,
    MoveNode, MovePort, DoubleTouchMove,
    PinchZoom, ReleaseDiagram, ReleaseNode, ReleasePort,
    Touched, TouchEnd,
    TouchMoveOnDiagram,
    TouchMoveOnNode, TouchMoveOnPort,
    TouchStart
} from "./AppFlow/Touch";

export class AppFlow {
    public static init(controller: Controller): void {
        new Builder().build(
            (name: string): State => {
                switch (name) {
                    case 'Idle':
                        return new Idle(name, controller);
                    case 'Touched':
                        return new Touched(name, controller);
                    case 'Move Diagram':
                        return new MoveDiagram(name, controller);
                    case 'Move Node':
                        return new MoveNode(name, controller);
                    case 'Move Port':
                        return new MovePort(name, controller);
                    case 'Pinch Zoom':
                        return new PinchZoom(name, controller);
                    case 'Mouse Zooming':
                        return new MouseZooming(name, controller);
                    case 'Adjusting Focus':
                        return new AdjustingFocus(name, controller);
                    case 'Selecting Nodes':
                        return new SelectingNodes(name, controller);
                    case 'Selecting multiple Nodes':
                        return new SelectingNodes(name, controller);
                    case 'Deleting Selected Nodes':
                        return new DeletingNodes(name, controller);
                    default:
                        throw new Error("undefined State: " + name);
                }
            },
            (name: string): Transition => {
                switch (name) {
                    case 'Touch Start':
                        return new TouchStart(name, controller);
                    case 'Touch Move on Diagram':
                        return new TouchMoveOnDiagram(name, controller);
                    case 'Touch Move on Node':
                        return new TouchMoveOnNode(name, controller);
                    case 'Touch Move on Port':
                        return new TouchMoveOnPort(name, controller);
                    case 'Double Touch Move':
                        return new DoubleTouchMove(name, controller);
                    case 'Touch End':
                        return new TouchEnd(name, controller);
                    case 'Release Node':
                        return new ReleaseNode(name, controller);
                    case 'Release Port':
                        return new ReleasePort(name, controller);
                    case 'Release Diagram':
                        return new ReleaseDiagram(name, controller);
                    case 'Use Mousewheel':
                        return new UseMousewheel(name, controller);
                    case 'Zoom finished':
                        return new ZoomFinished(name, controller);
                    case 'Double Click':
                        return new DoubleClick(name, controller);
                    case 'Focus adjustment finished':
                        return new FocusAdjustmentFinished(name, controller);
                    case 'Select Node':
                        return new SelectNode(name, controller);
                    case 'Single Selection Return':
                        return new SingleSelectionReturn(name, controller);
                    case 'Select one more Node':
                        return new SelectOneMoreNode(name, controller);
                    case 'Deselect one Node':
                        return new DeSelectNode(name, controller);
                    case 'Turn on multi selection':
                        return new TurnOnMultiNodeSelectionMode(name, controller);
                    case 'Turn off multi selection':
                        return new TurnOffMultiNodeSelectionMode(name, controller);
                    case 'Delete Nodes':
                        return new DeleteNodes(name, controller);
                    case 'Nodes Deleted':
                        return new NodesDeleted(name, controller);
                    default:
                        throw new Error("undefined Transition: " + name);
                }
            }
        );
    }
}
