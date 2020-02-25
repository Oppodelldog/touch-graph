import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {Controller} from "./Controller";
import {CallbackValidateNewConnection, GraphCallbackInterface, GraphInterface} from "./GraphInterface";
import {Builder} from "./State/Builder";
import {State, Transition} from "./State/State";
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
import {Idle} from "./Transitions/Idle";
import {DeleteNodes, DeletingNodes, NodesDeleted} from "./Transitions/DeleteNodes";

export enum PortDirection {
    Unknown = 0,
    Input = 1,
    Output = 2
}


export class Graph implements GraphInterface, GraphCallbackInterface {
    private readonly controller: Controller;

    constructor() {
        this.controller = new Controller();
    }

    public onValidateNewConnection(f: CallbackValidateNewConnection): void {
        this.controller.onValidateNewConnection = (connection) => f(connection)
    }

    public onNewNode(f: (node: Node) => void): void {
        this.controller.onNewNode.subscribe(f)
    }

    public onRemoveNode(f: (node: Node) => void): void {
        this.controller.onRemoveNode.subscribe(f)
    }

    public onMoveNode(f: (node: Node) => void): void {
        this.controller.onMoveNode.subscribe(f)
    }

    public onMoveCanvas(f: (pos: { X: number, Y: number }) => void): void {
        this.controller.onMoveCanvas.subscribe(f)
    }

    public onScaleChanged(f: (scale: number) => void): void {
        this.controller.onScaleChanged.subscribe(f)
    }

    public onDragConnectionLine(f: ({X1: x, Y1: y, X2: x2, Y2: y2}) => void): void {
        this.controller.onDragConnectionLine.subscribe(f)
    }

    public onRemoveConnectionLine(f: () => void): void {
        this.controller.onRemoveConnectionLine.subscribe(f)
    }

    public onNodeSelectionChanged(f: ({Node: Node, Selected: boolean}) => void): void {
        this.controller.onNodeSelectionChanged.subscribe(f);
    }

    public onNewConnection(f: (connection: Connection) => void): void {
        this.controller.onNewConnection.subscribe(f);
    }

    public onRemoveConnection(f: (connection: Connection) => void): void {
        this.controller.onRemoveConnection.subscribe(f);
    }
    public onUpdateConnection(f: (connection: Connection) => void): void {
        this.controller.onUpdateConnection.subscribe(f);
    }

    public getNodes(): Nodes {
        return this.controller.getNodes();
    }

    public getNumberOfPortConnections(portId): number {
        return this.controller.getNumberOfPortConnections(portId);
    }

    public addConnection(nodeA, portA, nodeB, portB): Connection | null {
        const connection = this.controller.createConnection(nodeA, portA, nodeB, portB);
        if (this.controller.addConnection(connection)) {
            return connection;
        }

        return null;
    }

    public createNode(): Node {
        return this.controller.createNode();
    }

    public createPort(): Port {
        return this.controller.createPort()
    }

    public addNode(node: Node): void {
        this.controller.addNode(node)
    }

    public setScale(scale): void {
        this.controller.setScale(scale)
    }

    public moveTo(x, y): void {
        this.controller.moveTo(x, y)
    }

    public start(): void {
        this.initStates();
    }

    private initStates(): void {
        new Builder().build(
            (name: string): State => {
                switch (name) {
                    case 'Idle':
                        return new Idle(name, this.controller);
                    case 'Node Grabbed':
                        return new NodeGrabbed(name, this.controller);
                    case 'Port Grabbed':
                        return new PortGrabbed(name, this.controller);
                    case 'Diagram Grabbed':
                        return new DiagramGrabbed(name, this.controller);
                    case 'Zooming':
                        return new Zooming(name, this.controller);
                    case 'Adjusting Focus':
                        return new AdjustingFocus(name, this.controller);
                    case 'Selecting Nodes':
                        return new SelectingNodes(name);
                    case 'Selecting multiple Nodes':
                        return new SelectingNodes(name);
                    case 'Deleting Selected Nodes':
                        return new DeletingNodes(name);
                    default:
                        throw new Error("undefined State: " + name);
                }
            },
            (name: string): Transition => {
                switch (name) {
                    case 'Grab Node':
                        return new GrabNode(name, this.controller);
                    case 'Release Node':
                        return new ReleaseNode(name, this.controller);
                    case 'Grab Port':
                        return new GrabPort(name, this.controller);
                    case 'Release Port':
                        return new ReleasePort(name, this.controller);
                    case 'Grab Diagram':
                        return new GrabDiagram(name, this.controller);
                    case 'Release Diagram':
                        return new ReleaseDiagram(name, this.controller);
                    case 'Use Mousewheel':
                        return new UseMousewheel(name, this.controller);
                    case 'Zoom finished':
                        return new ZoomFinished(name, this.controller);
                    case 'Double Click':
                        return new DoubleClick(name, this.controller);
                    case 'Focus adjustment finished':
                        return new FocusAdjustmentFinished(name, this.controller);
                    case 'Select Node':
                        return new SelectNode(name, this.controller);
                    case 'Single Selection Return':
                        return new SingleSelectionReturn(name, this.controller);
                    case 'Select one more Node':
                        return new SelectOneMoreNode(name, this.controller);
                    case 'Deselect one Node':
                        return new DeSelectNode(name, this.controller);
                    case 'Turn on multi selection':
                        return new TurnOnMultiNodeSelectionMode(name, this.controller);
                    case 'Turn off multi selection':
                        return new TurnOffMultiNodeSelectionMode(name, this.controller);
                    case 'Delete Nodes':
                        return new DeleteNodes(name, this.controller);
                    case 'Nodes Deleted':
                        return new NodesDeleted(name);
                    default:
                        throw new Error("undefined Transition: " + name);
                }
            }
        );
    }
}
