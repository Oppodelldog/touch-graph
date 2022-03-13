import Node from "./data/Node";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {Connection} from "./data/Connection";
import {Connections} from "./data/Connections";
import {Drag} from "./data/Drag";
import UUID from "./UUID";
import {ViewInterface} from "./Renderer";
import {EventCallback, EventType} from "./ViewEvents";
import {Observer} from "./Observer";

export class ConnectionUpdate {
    public connection: Connection;
    public fromNode: Node;
    public toNode: Node;
}

export interface Data {
    connections: Connections;
    nodes: Nodes;
    selectedNodes: string[];
}

export abstract class ObservableController {
    public readonly onNewNode: Observer<Node> = new Observer<Node>();
    public readonly onRemoveNode: Observer<Node> = new Observer<Node>();
    public readonly onMoveNode: Observer<Node> = new Observer<Node>();
    public readonly onNodeSelectionChanged: Observer<{ node: Node, selected: boolean }> = new Observer<{ node: Node, selected: boolean }>();
    public readonly onNewConnection: Observer<ConnectionUpdate> = new Observer<ConnectionUpdate>();
    public readonly onUpdateConnection: Observer<ConnectionUpdate> = new Observer<ConnectionUpdate>();
    public readonly onRemoveConnection: Observer<Connection> = new Observer<Connection>();
    public readonly onCenterCanvas: Observer<{ x: number, y: number }> = new Observer<{ x: number, y: number }>();
    public readonly onDragCanvas: Observer<{ x: number, y: number }> = new Observer<{ x: number, y: number }>();
    public readonly onScaleChanged: Observer<number> = new Observer<number>();
    public readonly onDragConnectionLine: Observer<{ x1: number, y1: number, x2: number, y2: number }> = new Observer<{ x1: number, y1: number, x2: number, y2: number }>();
    public readonly onRemoveConnectionLine: Observer<void> = new Observer<void>();
    public readonly onConnectionTargetNotDefined: Observer<{ node: Node, port: Port }> = new Observer<{ node: Node, port: Port }>();
    public readonly onSetNodeCaption: Observer<Node> = new Observer<Node>();
    public readonly onSetPortName: Observer<{ node: Node, port: Port }> = new Observer<{ node: Node, port: Port }>();
    public readonly onRemovePort: Observer<Node> = new Observer<Node>();
    public readonly onAddPort: Observer<{ node: Node, port: Port }> = new Observer<{ node: Node, port: Port }>();
    public readonly onMoveInPort: Observer<{ node: Node, previousIndex: number, newIndex: number }> = new Observer<{ previousIndex: number, newIndex: number }>();
    public readonly onAddCustomCssClass: Observer<{ node: Node, cssClassName: string }> = new Observer<{ node: Node, cssClassName: string }>();
    public readonly onRemoveCustomCssClass: Observer<{ node: Node, cssClassName: string }> = new Observer<{ node: Node, cssClassName: string }>();
}

export class Controller extends ObservableController {
    public onValidateNewConnection: (connection: Connection) => boolean = () => true;
    public onConnectionValidated: (connection: Connection) => boolean = this.addConnection;
    private data: Data;
    private readonly drag: Drag;
    private view: ViewInterface;
    private scale: number = 1;

    constructor() {
        super();
        this.drag = new Drag();
        this.data = {
            nodes: new Nodes(),
            connections: new Connections(),
            selectedNodes: [],
        } as Data;
    }

    public connectView(view: ViewInterface): void {
        this.view = view;
        this.getView().onClickLine((connectionId) => {
            this.removeConnection(connectionId);
        });
    }

    public clear(): void {
        let allNodes = this.data.nodes.getAll();
        if (allNodes.length > 0) {
            allNodes.map((n) => n.id).forEach((id) => this.removeNode(id));
        }

        let allConnections = this.data.connections.getAll();
        if (allConnections.length > 0) {
            allConnections.map((c) => c.id).forEach((id) => this.removeConnection(id));
        }

        this.data.selectedNodes = [];
    }

    private newConnectionUpdate(connection: Connection): ConnectionUpdate {
        const update = new ConnectionUpdate();

        update.connection = connection;
        update.fromNode = this.getNodeById(connection.from.nodeId);
        update.toNode = this.getNodeById(connection.to.nodeId);
        return update;
    }

    public updateConnection(connection: Connection): void {
        this.onUpdateConnection.notify(this.newConnectionUpdate(connection));
    }

    public getNodes(): Nodes {
        return this.data.nodes;
    }

    public registerEventHandler(eventType: EventType, callback: EventCallback): string {
        return this.getView().registerEventHandler(eventType, callback);
    }

    public removeEventHandler(id: string) {
        this.getView().removeEventHandler(id);
    }

    public getNumberOfPortConnections(portId): number {
        return this.data.connections.getByPortId(portId).length;
    }

    public getPortConnections(portId: string): Connection[] {
        return this.data.connections.getByPortId(portId)
    }

    public requestAddConnection(connection: Connection): boolean {
        if (!this.onValidateNewConnection(connection)) {
            return false;
        }

        return this.onConnectionValidated(connection)
    }

    public addConnection(connection: Connection): boolean {
        if (this.data.nodes.isInPort(connection.from.portId)) {
            let fromEndPoint = connection.from;
            connection.from = connection.to;
            connection.to = fromEndPoint;
        }

        this.data.connections.push(connection);
        this.onNewConnection.notify({
            connection: connection,
            fromNode: this.getNodeById(connection.from.nodeId),
            toNode: this.getNodeById(connection.to.nodeId)
        } as ConnectionUpdate)
        this.updateConnection(connection);

        return true;
    }

    public abortConnectingNoTarget(node: Node, port: Port): void {
        this.onConnectionTargetNotDefined.notify({node, port})
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
        this.data.nodes.push(node);
        this.onNewNode.notify(node);
    }

    public setScale(scale): void {
        const minScale = 0.01;
        this.scale = scale;
        if (this.scale < minScale) {
            this.scale = minScale;
        }
        this.onScaleChanged.notify(this.scale);
    }

    public moveTo(x, y): void {
        this.centerPosition(x, y)
    }

    public center(x: any, y: any): void {
        let nodeId = this.getView().getHoveredNodeId(x, y);
        let node = this.data.nodes.getById(nodeId);
        if (node !== null) {
            this.centerNode(node);
        }
    }

    public centerNode(node: Node): void {
        this.moveTo(node.x, node.y);
    }

    public getScale(): number {
        return this.scale;
    }

    public getHoveredPortId(x: number, y: number): string {
        return this.getView().getHoveredPortId(x, y);
    }

    public updateGrabLine(x: number, y: number, x2: number, y2: number): void {
        this.onDragConnectionLine.notify({x1: x, y1: y, x2: x2, y2: y2});
    }

    public getNodeFromPortId(portId: string): Node {
        return this.data.nodes.getNodeFromPortId(portId);
    }

    public removeGrabLine(): void {
        this.onRemoveConnectionLine.notify()
    }

    public dragStartDiagram(x: number, y: number): void {
        this.drag.dragStart(x, y);
    }

    public dragMoveDiagram(x: number, y: number): void {
        let dragOffset = this.drag.getDraggedOffset(x, y);
        this.onDragCanvas.notify({x: dragOffset.x, y: dragOffset.y});
    }

    public dragStopDiagram(): void {
        this.drag.dragStop();
    }

    private centerPosition(x: number, y: number): void {
        this.onCenterCanvas.notify({x: x, y: y});
    }

    public isCanvasHovered(x: number, y: number): boolean {
        return this.getView().isCanvasHovered(x, y);
    }

    public getHoveredNodeId(x: number, y: number): string {
        return this.getView().getHoveredNodeId(x, y);
    }

    public isNodeHovered(x: number, y: number): boolean {
        return this.getView().getHoveredNodeId(x, y) !== "";
    }

    public getNodeById(nodeId: string): Node | null {
        return this.data.nodes.getById(nodeId);
    }

    public updateNodePos(node: Node): void {
        this.onMoveNode.notify(node);
        this.renderNodeConnections(node);
    }

    public updateAllNodePositions(): void {
        this.getNodes().forEach((node) => this.updateNodePos(node))
    }

    public renderNodeConnections(node: Node) {
        this.data.connections.getByNodeId(node.id).forEach((connection) => {
            this.updateConnection(connection);
        });
    }

    public selectNode(nodeId: string) {
        this.data.selectedNodes.push(nodeId);
        this.updateNodeSelection(nodeId);
    }

    private updateNodeSelection(nodeId: string) {
        const node = this.data.nodes.getById(nodeId);
        if (node === null) {
            return;
        }
        this.onNodeSelectionChanged.notify({node: node, selected: this.isNodeSelected(nodeId)})
    }

    public deselectNode(nodeId: string) {
        if (!this.isNodeSelected(nodeId)) {
            return;
        }
        let index = this.data.selectedNodes.indexOf(nodeId);
        if (index >= 0) {
            this.data.selectedNodes.splice(index, 1)
        }

        this.updateNodeSelection(nodeId);
    }

    public removeSelectedNodeKeepLatest() {
        this.data.selectedNodes.splice(0, this.data.selectedNodes.length - 1).forEach((removedNodeIds) => this.updateNodeSelection(removedNodeIds));
    }

    public isNodeSelected(nodeId: string) {
        return this.data.selectedNodes.indexOf(nodeId) >= 0;
    }

    public removeConnection(connectionId: string) {
        const removedConnection = this.data.connections.getById(connectionId);
        this.data.connections.remove(connectionId);
        this.onRemoveConnection.notify(removedConnection)
    }

    public deleteSelectedNodes() {
        this.data.selectedNodes.forEach((nodeId) => this.removeNode(nodeId))
    }

    public removeNode(nodeId: string) {
        const node = this.getNodeById(nodeId);
        this.data.nodes.remove(nodeId);
        this.data.connections.getByNodeId(nodeId).forEach((connection) => {
            this.removeConnection(connection.id);
        });
        this.onRemoveNode.notify(node);
    }

    setNodeCaption(nodeId: string, caption: string) {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }

        node.caption = caption;
        this.onSetNodeCaption.notify(node);
        this.renderNodeConnections(node);
    }

    setPortCaption(portId: string, caption: string) {
        let node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }
        let port = node.getPortById(portId);
        port.caption = caption;
        this.onSetPortName.notify({node: node, port: port});
        this.renderNodeConnections(node);
    }

    moveInPortDown(portId: string): void {
        let node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }

        let index = node.portsIn.findIndex((port: Port) => port.id === portId);
        if (index === -1) {
            return;
        }

        let swapIndex;
        if (index + 1 < node.portsIn.length) {
            swapIndex = index + 1;
        } else {
            swapIndex = 0;
        }
        let swappedPort = node.portsIn[swapIndex];
        node.portsIn[swapIndex] = node.portsIn[index];
        node.portsIn[index] = swappedPort;
        this.onMoveInPort.notify({node: node, previousIndex: index, newIndex: swapIndex});
        this.renderNodeConnections(node);
    }

    moveInPortUp(portId: string): void {
        let node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }

        let index = node.portsIn.findIndex((port: Port) => port.id === portId);
        if (index === -1) {
            return;
        }

        let swapIndex;
        if (index - 1 > 0) {
            swapIndex = index - 1;
        } else {
            swapIndex = node.portsIn.length - 1;
        }
        let swappedPort = node.portsIn[swapIndex];
        node.portsIn[swapIndex] = node.portsIn[index];
        node.portsIn[index] = swappedPort;
        this.onMoveInPort.notify({node: node, previousIndex: index, newIndex: swapIndex});
        this.renderNodeConnections(node);
    }

    removePort(portId: string) {
        let node = this.getNodeFromPortId(portId);
        if (node === null) {
            return;
        }
        node.removePort(portId);
        this.data.connections.getByPortId(portId).forEach((connection: Connection) => this.removeConnection(connection.id));
        this.onRemovePort.notify(node);
        this.renderNodeConnections(node);
    }

    addInPort(caption: string, nodeId: string) {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }
        let port = this.createPort();
        port.caption = caption;
        node.portsIn.push(port)
        this.onAddPort.notify({node: node, port: port});
        this.renderNodeConnections(node);
    }

    setCustomCssClass(nodeId: string, className: string): void {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }
        let exists = node.customClasses.findIndex((cls) => cls === className) > -1;
        if (!exists) {
            node.customClasses.push(className);
            this.onAddCustomCssClass.notify({node: node, cssClassName: className});
        }
    }

    removeCustomCssClass(nodeId: string, className: string): void {
        let node = this.getNodeById(nodeId);
        if (node === null) {
            return;
        }
        let exists = node.customClasses.findIndex((cls) => cls === className) > -1;
        if (exists) {
            node.customClasses = node.customClasses.filter((cls) => cls !== className);
            this.onRemoveCustomCssClass.notify({node: node, cssClassName: className});
        }

    }

    private getView(): ViewInterface {
        if (this.view === undefined) {
            throw new Error("no view connected");
        }
        return this.view;
    }
}
