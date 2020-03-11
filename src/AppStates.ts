import {Builder} from "./Flow/Builder";
import {State, Transition} from "./Flow/State";
import {Idle} from "./Transitions/Idle";
import {GrabNode, NodeGrabbed, ReleaseNode} from "./Transitions/GrabNode";
import {GrabPort, PortGrabbed, ReleasePort} from "./Transitions/GrabPort";
import {DiagramGrabbed, GrabDiagram, ReleaseDiagram} from "./Transitions/GrabDiagram";
import {UseMousewheel, ZoomFinished, Zooming} from "./Transitions/Zoom";
import {AdjustingFocus, DoubleClick, FocusAdjustmentFinished} from "./Transitions/FocusElement";
import {
    DeSelectNode,
    SelectingNodes,
    SelectNode,
    SelectOneMoreNode,
    SingleSelectionReturn,
    TurnOffMultiNodeSelectionMode,
    TurnOnMultiNodeSelectionMode
} from "./Transitions/SelectNode";
import {DeleteNodes, DeletingNodes, NodesDeleted} from "./Transitions/DeleteNodes";
import {Controller} from "./Controller";

export class AppStates {
    public static init(controller: Controller): void {
        new Builder().build(
            (name: string): State => {
                switch (name) {
                    case 'Idle':
                        return new Idle(name, controller);
                    case 'Node Grabbed':
                        return new NodeGrabbed(name, controller);
                    case 'Port Grabbed':
                        return new PortGrabbed(name, controller);
                    case 'Diagram Grabbed':
                        return new DiagramGrabbed(name, controller);
                    case 'Zooming':
                        return new Zooming(name, controller);
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
                    case 'Grab Node':
                        return new GrabNode(name, controller);
                    case 'Release Node':
                        return new ReleaseNode(name, controller);
                    case 'Grab Port':
                        return new GrabPort(name, controller);
                    case 'Release Port':
                        return new ReleasePort(name, controller);
                    case 'Grab Diagram':
                        return new GrabDiagram(name, controller);
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
