import Node from "./data/Node";
import Nodes from "./data/Nodes";
import {Connection} from "./data/Connection";
import {Connections} from "./data/Connections";
import Port from "./data/Port";
import {Diagram} from "./data/Diagram";
import UUID from "./UUID";
import {Renderer} from "./Renderer";
import {EventCallback, EventType} from "./ViewEvents";

const canvasElementId = "touch-graph";

export class Controller {
    public onValidateNewConnection: (connection: Connection) => boolean = () => true;
    public onNewNode: (node: Node) => void = () => void {};
    public onRemoveNode: (node: Node) => void = () => void {};
    public onNewConnection: (connection: Connection) => void = () => void {};

    private readonly connections: Connections;
    private readonly nodes: Nodes;
    private readonly renderer: Renderer;
    private readonly diagram: Diagram;
    private readonly selectedNodes: string[];
    private readonly canvasElement: HTMLElement;
    private scale: number = 1;

    constructor() {
        this.canvasElement = document.getElementById(canvasElementId);
        if (this.canvasElement == null) {
            throw new Error(`need a div tag with id='${canvasElementId}'`);
        }
        this.diagram = new Diagram();
        this.nodes = new Nodes();
        this.connections = new Connections();
        this.renderer = new Renderer(this.canvasElement);
        this.renderer.onClickLine = (connectionId) => {
            this.connections.remove(connectionId);
        };
        this.selectedNodes = [];
    }

    public renderConnection(connection: Connection): void {
        let fromNode = this.nodes.getNodeById(connection.from.nodeId);
        let toNode = this.nodes.getNodeById(connection.to.nodeId);
        this.renderer.updateLine(connection.id, connection.from.portId, connection.to.portId, fromNode, toNode);
    }

    public getNodes(): Nodes {
        return this.nodes;
    }

    public registerEventHandler(eventType: EventType, callback: EventCallback): string {
        return this.renderer.registerEventHandler(eventType, callback);
    }

    public removeEventHandler(id: string) {
        this.renderer.removeEventHandler(id);
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

        this.onNewConnection(connection);

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
        this.onNewNode(node);
    }

    public renderNodes(): void {
        this.nodes.forEach((node) => this.renderer.renderNode(node));
    }

    public updateConnection(): void {
        this.connections.forEach((connection) => {
            let fromNode = this.nodes.getNodeById(connection.from.nodeId);
            let toNode = this.nodes.getNodeById(connection.to.nodeId);
            this.renderer.updateLine(connection.id, connection.from.portId, connection.to.portId, fromNode, toNode)
        });
    }

    public setScale(scale): void {
        this.scale = scale;
        this.renderer.setScale(this.scale);
    }

    public moveTo(x, y): void {
        const diagramCanvasRect = this.canvasElement.getBoundingClientRect();
        this.diagram.xOffset = -x * this.scale;
        this.diagram.yOffset = -y * this.scale;
        this.diagram.xOffset += diagramCanvasRect.width / 2;
        this.diagram.yOffset += diagramCanvasRect.height / 2;

        this.renderer.updateCanvasPosition(this.diagram.xOffset,this.diagram.yOffset)
    }

    public center(x: any, y: any) {
        let nodeId = this.renderer.getHoveredNodeId(x, y);
        let node = this.nodes.getNodeById(nodeId);
        if (node !== null) {
            this.moveTo(node.x, node.y);
        }
    }

    public getScale(): number {
        return this.scale;
    }

    public getHoveredPortId(x: number, y: number): string {
        return this.renderer.getHoveredPortId(x, y);
    }

    public updateGrabLine(x: number, y: number, x2: number, y2: number): void {
        return this.renderer.updateGrabLine(x, y, x2, y2);
    }

    public getNodeFromPortId(portId: string): Node {
        return this.nodes.getNodeFromPortId(portId);
    }

    public removeGrabLine(): void {
        this.renderer.removeGrabLine();
    }

    public dragStopDiagram(): void {
        this.diagram.dragStop();
        this.renderer.updateCanvasPosition(this.diagram.xOffset,this.diagram.yOffset)
    }

    public dragMoveDiagram(x: number, y: number): void {
        this.diagram.dragMove(x, y);
        this.updateCanvasPosition(this.diagram.xDrag, this.diagram.yDrag);
    }

    public updateCanvasPosition(x: number, y: number): void {
        this.renderer.updateCanvasPosition(x, y);
    }

    public isCanvasHovered(x: number, y: number): boolean {
        return this.renderer.isCanvasHovered(x, y);
    }

    public dragStartDiagram(x: number, y: number): void {
        this.diagram.dragStart(x, y);
    }

    public getHoveredNodeId(x: number, y: number): string {
        return this.renderer.getHoveredNodeId(x, y);
    }

    public getNodeById(nodeId: string): Node | null {
        return this.nodes.getNodeById(nodeId);
    }

    public updateNodePos(node: Node): void {
        this.renderer.updateNodePos(node);
    }

    public renderNodeConnections(node: Node) {
        this.connections.getByNodeId(node.id).forEach((connection) => {
            this.renderConnection(connection);
        });
    }

    public renderAll() {
        this.renderNodes();
        this.updateConnection();
    }

    public selectNode(nodeId: string) {
        this.selectedNodes.push(nodeId);
        this.renderer.updateNodeSelection(nodeId, this.isNodeSelected(nodeId))
    }

    public deselectNode(nodeId: string) {
        if (!this.isNodeSelected(nodeId)) {
            return;
        }
        let index = this.selectedNodes.indexOf(nodeId);
        if (index >= 0) {
            this.selectedNodes.splice(index, 1)
        }
        this.renderer.updateNodeSelection(nodeId, this.isNodeSelected(nodeId))
    }

    public removeSelectedNodeKeepLatest() {
        this.selectedNodes.splice(0, this.selectedNodes.length - 1);
        this.nodes.forEach((node) => this.renderer.updateNodeSelection(node.id, this.isNodeSelected(node.id)));
    }

    public isNodeSelected(nodeId: string) {
        return this.selectedNodes.indexOf(nodeId) >= 0;
    }

    public deleteSelectedNodes() {
        this.selectedNodes.forEach((nodeId) => {
            const node = this.getNodeById(nodeId);
            this.nodes.remove(nodeId);
            this.connections.getByNodeId(nodeId).forEach((connection) => {
                this.connections.remove(connection.id);
                this.renderer.removeConnection(connection.id);
            });
            this.renderer.removeNode(nodeId);
            this.onRemoveNode(node);
        })
    }
}
