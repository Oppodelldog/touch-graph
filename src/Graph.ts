import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {ConnectionUpdate, Controller, ObservableController} from "./Controller";
import {CallbackValidateNewConnection, GraphCallbackInterface, GraphInterface} from "./GraphInterface";
import {Renderer, RendererInterface, ViewInterface} from "./Renderer";
import {AppFlow} from "./AppFlow";

export function NewGraph(): Graph {
    const renderer = new Renderer()
    const controller = new Controller(renderer);
    return new Graph(renderer, controller);
}

export class Graph implements GraphInterface, GraphCallbackInterface {
    private readonly controller: Controller;
    private readonly renderer: RendererInterface;

    constructor(renderer: RendererInterface,controller:Controller) {
        this.renderer = renderer;
        this.controller = controller
        this.renderer.bind(this.controller as ObservableController);
        this.initStates();
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

    public onMoveCanvas(f: (pos: { x: number, y: number }) => void): void {
        this.controller.onCenterCanvas.subscribe(f)
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

    public onNodeSelectionChanged(f: ({node: Node, selected: boolean}) => void): void {
        this.controller.onNodeSelectionChanged.subscribe(f);
    }

    public onNewConnection(f: (connection: ConnectionUpdate) => void): void {
        this.controller.onNewConnection.subscribe(f);
    }

    public onUpdateConnection(f: (connection: ConnectionUpdate) => void): void {
        this.controller.onUpdateConnection.subscribe(f);
    }

    public onRemoveConnection(f: (connection: Connection) => void): void {
        this.controller.onRemoveConnection.subscribe(f);
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

    public moveTo(x: number, y: number): void {
        this.controller.moveTo(x, y)
    }

    private initStates(): void {
        AppFlow.init(this.controller);
    }

    public getBoundingClientRect(): DOMRect {
        return this.renderer.getBoundingClientRect();
    }

    public getNodeFromPortId(portId: string): Node {
        return this.controller.getNodeFromPortId(portId);
    }

    public getPortConnections(portId: string): Connection[] {
        return this.controller.getPortConnections(portId);
    }

    public updateAllNodePositions(): void {
        this.controller.updateAllNodePositions();
    }

    public clear(): void {
        this.controller.clear();
    }

    setNodeCaption(nodeId: string, caption: string): void {
        this.controller.setNodeCaption(nodeId,caption);
    }
}
