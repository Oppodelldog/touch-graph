import Node from "./data/Node";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {Connection} from "./data/Connection";
import {Connections} from "./data/Connections";
import {Diagram} from "./data/Diagram";
import UUID from "./UUID";
import {Renderer, RenderInterface, ViewInterface} from "./Renderer";
import {EventCallback, EventType} from "./ViewEvents";
import {Observer} from "./Observer";

const canvasElementId = "touch-graph";

export abstract class ObservableController {
    public readonly onNewNode: Observer<Node> = new Observer<Node>();
    public readonly onRemoveNode: Observer<Node> = new Observer<Node>();
    public readonly onMoveNode: Observer<Node> = new Observer<Node>();
    public readonly onNodeSelectionChanged: Observer<{ Node: Node, Selected: boolean }> = new Observer<{ Node: Node, Selected: boolean }>();
    public readonly onNewConnection: Observer<Connection> = new Observer<Connection>();
    public readonly onRemoveConnection: Observer<Connection> = new Observer<Connection>();
    public readonly onUpdateConnection: Observer<Connection> = new Observer<Connection>();
    public readonly onMoveCanvas: Observer<{ X: number, Y: number }> = new Observer<{ X: number, Y: number }>();
    public readonly onScaleChanged: Observer<number> = new Observer<number>();
    public readonly onDragConnectionLine: Observer<{ X1: number, Y1: number, X2: number, Y2: number }> = new Observer<{ X1: number, Y1: number, X2: number, Y2: number }>();
    public readonly onRemoveConnectionLine: Observer<void> = new Observer<void>();
}

export class Controller extends ObservableController {
    public onValidateNewConnection: (connection: Connection) => boolean = () => true;

    private readonly connections: Connections;
    private readonly nodes: Nodes;
    private readonly renderer: RenderInterface;
    private readonly view: ViewInterface;
    private readonly diagram: Diagram;
    private readonly selectedNodes: string[];
    private readonly canvasElement: HTMLElement;
    private scale: number = 1;

    constructor() {
        super()
        this.canvasElement = document.getElementById(canvasElementId);
        if (this.canvasElement == null) {
            throw new Error(`need a div tag with id='${canvasElementId}'`);
        }
        this.diagram = new Diagram();
        this.nodes = new Nodes();
        this.connections = new Connections();
        const renderer = new Renderer(this.canvasElement);
        this.renderer = renderer;
        this.bindRenderer(this.renderer);
        this.view = renderer;
        this.view.onClickLine((connectionId) => {
            this.removeConnection(connectionId);
        });
        this.selectedNodes = [];
    }

    private bindRenderer(renderer: RenderInterface) {
        this.onNewNode.subscribe(renderer.renderNode.bind(this.renderer));
        this.onMoveNode.subscribe((node: Node) => renderer.updateNodePos(node));
        this.onRemoveNode.subscribe((node: Node) => renderer.removeNode(node.id));
        this.onNewConnection.subscribe((c: Connection) => {
            const fromNode = this.nodes.getById(c.from.nodeId);
            const toNode = this.nodes.getById(c.to.nodeId);
            renderer.updateLine(c.id, c.from.portId, c.to.portId, fromNode, toNode)
        });
        this.onUpdateConnection.subscribe((c: Connection) => {
            const fromNode = this.nodes.getById(c.from.nodeId);
            const toNode = this.nodes.getById(c.to.nodeId);
            renderer.updateLine(c.id, c.from.portId, c.to.portId, fromNode, toNode)
        });
        this.onRemoveConnection.subscribe((c: Connection) => renderer.removeConnection(c.id));
        this.onScaleChanged.subscribe((scale: number) => renderer.setScale(scale));
        this.onDragConnectionLine.subscribe((line: { X1: number, Y1: number, X2: number, Y2: number }) => renderer.updateGrabLine(line.X1, line.Y1, line.X2, line.Y2));
        this.onRemoveConnectionLine.subscribe(() => renderer.removeGrabLine());
        this.onMoveCanvas.subscribe((pos: { X: number, Y: number }) => renderer.updateCanvasPosition(pos.X, pos.Y));
        this.onNodeSelectionChanged.subscribe((change: { Node: Node, Selected: boolean }) => renderer.updateNodeSelection(change.Node.id, change.Selected));
    }

    public updateConnection(connection: Connection): void {
        this.onUpdateConnection.notify(connection);
    }

    public getNodes(): Nodes {
        return this.nodes;
    }

    public registerEventHandler(eventType: EventType, callback: EventCallback): string {
        return this.view.registerEventHandler(eventType, callback);
    }

    public removeEventHandler(id: string) {
        this.view.removeEventHandler(id);
    }

    public getNumberOfPortConnections(portId): number {
        return this.connections.getByPortId(portId).length;
    }

    public addConnection(connection: Connection): boolean {
        if (!this.onValidateNewConnection(connection)) {
            return false;
        }

        if (this.nodes.isInPort(connection.from.portId)) {
            let fromEndPoint = connection.from;
            connection.from = connection.to;
            connection.to = fromEndPoint;
        }

        this.connections.push(connection);
        this.onNewConnection.notify(connection);

        return true;
    }

    public createNode(): Node {
        const node = new Node();
        node.id = UUID.NewId();

        return node;
    }

    public createPort(): Port {
        const port = new Port();
        port.id = UUID.NewId();

        return port;
    }

    public createConnection(nodeA, portA, nodeB, portB): Connection {
        const connection = new Connection();
        connection.id = UUID.NewId();
        connection.from.nodeId = nodeA;
        connection.from.portId = portA;
        connection.to.nodeId = nodeB;
        connection.to.portId = portB;

        return connection;
    }

    addNode(node: Node) {
        this.nodes.push(node);
        this.onNewNode.notify(node);
    }

    public setScale(scale): void {
        this.scale = scale;
        this.onScaleChanged.notify(this.scale);
    }

    public moveTo(x, y): void {
        const diagramCanvasRect = this.canvasElement.getBoundingClientRect();
        this.diagram.xOffset = -x * this.scale;
        this.diagram.yOffset = -y * this.scale;
        this.diagram.xOffset += diagramCanvasRect.width / 2;
        this.diagram.yOffset += diagramCanvasRect.height / 2;

        this.updateCanvasPosition(this.diagram.xOffset, this.diagram.yOffset)
    }

    public center(x: any, y: any) {
        let nodeId = this.view.getHoveredNodeId(x, y);
        let node = this.nodes.getById(nodeId);
        if (node !== null) {
            this.moveTo(node.x, node.y);
        }
    }

    public getScale(): number {
        return this.scale;
    }

    public getHoveredPortId(x: number, y: number): string {
        return this.view.getHoveredPortId(x, y);
    }

    public updateGrabLine(x: number, y: number, x2: number, y2: number): void {
        this.onDragConnectionLine.notify({X1: x, Y1: y, X2: x2, Y2: y2});
    }

    public getNodeFromPortId(portId: string): Node {
        return this.nodes.getNodeFromPortId(portId);
    }

    public removeGrabLine(): void {
        this.onRemoveConnectionLine.notify()
    }

    public dragStopDiagram(): void {
        this.diagram.dragStop();
        this.updateCanvasPosition(this.diagram.xOffset, this.diagram.yOffset)
    }

    public dragMoveDiagram(x: number, y: number): void {
        this.diagram.dragMove(x, y);
        this.updateCanvasPosition(this.diagram.xDrag, this.diagram.yDrag);
    }

    private updateCanvasPosition(x: number, y: number): void {
        this.onMoveCanvas.notify({X: x, Y: y});
    }

    public isCanvasHovered(x: number, y: number): boolean {
        return this.view.isCanvasHovered(x, y);
    }

    public dragStartDiagram(x: number, y: number): void {
        this.diagram.dragStart(x, y);
    }

    public getHoveredNodeId(x: number, y: number): string {
        return this.view.getHoveredNodeId(x, y);
    }

    public getNodeById(nodeId: string): Node | null {
        return this.nodes.getById(nodeId);
    }

    public updateNodePos(node: Node): void {
        this.onMoveNode.notify(node);
    }

    public renderNodeConnections(node: Node) {
        this.connections.getByNodeId(node.id).forEach((connection) => {
            this.updateConnection(connection);
        });
    }

    public selectNode(nodeId: string) {
        this.selectedNodes.push(nodeId);
        this.updateNodeSelection(nodeId);
    }

    private updateNodeSelection(nodeId: string) {
        const node = this.nodes.getById(nodeId);
        if (node === null) {
            return;
        }
        this.onNodeSelectionChanged.notify({Node: node, Selected: this.isNodeSelected(nodeId)})
    }

    public deselectNode(nodeId: string) {
        if (!this.isNodeSelected(nodeId)) {
            return;
        }
        let index = this.selectedNodes.indexOf(nodeId);
        if (index >= 0) {
            this.selectedNodes.splice(index, 1)
        }

        this.updateNodeSelection(nodeId);
    }

    public removeSelectedNodeKeepLatest() {
        this.selectedNodes.splice(0, this.selectedNodes.length - 1).forEach((removedNodeIds) => this.updateNodeSelection(removedNodeIds));
    }

    public isNodeSelected(nodeId: string) {
        return this.selectedNodes.indexOf(nodeId) >= 0;
    }

    private removeConnection(connectionId: string) {
        const removedConnection = this.connections.getById(connectionId);
        this.connections.remove(connectionId);
        this.onRemoveConnection.notify(removedConnection)
    }

    public deleteSelectedNodes() {
        this.selectedNodes.forEach((nodeId) => this.removeNode(nodeId))
    }

    private removeNode(nodeId: string) {
        const node = this.getNodeById(nodeId);
        this.nodes.remove(nodeId);
        this.connections.getByNodeId(nodeId).forEach((connection) => {
            this.removeConnection(connection.id);
        });
        this.onRemoveNode.notify(node);
    }
}
