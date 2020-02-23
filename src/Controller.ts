import {Node,} from "./data/Node";
import {Connection,} from "./data/Connection";
import {Nodes,} from "./data/Nodes";
import {Port} from "./data/Port";
import {Position} from "./data/Position"
import {Connections} from "./data/Connections";
import {Diagram} from "./data/Diagram";
import UUID from "./UUID";
import {Renderer} from "./Renderer";
import {EventCallback, EventType} from "./ViewEvents";

export class Controller {
    public onValidateNewConnection = null;
    private connections: Connections;
    private readonly nodes: Nodes;
    private readonly canvasElement;
    private renderer: Renderer;
    private diagram: Diagram;
    private scale = 1;

    constructor() {
        this.canvasElement = document.getElementById("canvas");
        this.diagram = new Diagram();
        this.nodes = new Nodes();
        this.connections = new Connections();
        this.renderer = new Renderer(this.canvasElement);
        this.renderer.onClickLine = (connectionId) => {
            this.connections.remove(connectionId);
        };
    }

    public getCanvasElement() {
        return this.canvasElement;
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
        if (this.onValidateNewConnection && !this.onValidateNewConnection(connection)) {
            return false;
        }

        if (this.nodes.isInPort(connection.from.portId)) {
            let fromEndPoint = connection.from;
            connection.from = connection.to;
            connection.to = fromEndPoint;
        }

        this.connections.push(connection);
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
    }

    public renderNodes(): void {
        this.nodes.forEach((node) => this.renderer.renderNode(node));
    }

    public updateNodes(): void {
        this.nodes.forEach((node) => this.renderer.updateNodePos(node));
    }

    public updateLines(): void {
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
        const diagramCanvasRect = document.getElementById("canvas").getBoundingClientRect();
        this.diagram.xOffset = -x * this.scale;
        this.diagram.yOffset = -y * this.scale;
        this.diagram.xOffset += diagramCanvasRect.width / 2;
        this.diagram.yOffset += diagramCanvasRect.height / 2;

        this.syncOffset();
        this.renderer.updateCanvasPosition()
    }

    public getDiagramPos(viewX, viewY): Position {
        return this.renderer.getDiagramPos(viewX, viewY);
    }

    center(x: any, y: any) {
        let nodeId = this.renderer.getHoveredNodeId(x, y);
        let node = this.nodes.getNodeById(nodeId);
        if (node !== null) {
            this.moveTo(node.x, node.y);
        }
    }

    public syncOffset(): void {
        this.renderer.diagramXOffset = this.diagram.xOffset;
        this.renderer.diagramYOffset = this.diagram.yOffset;
    }

    getScale(): number {
        return this.scale;
    }

    getHoveredPortId(x: number, y: number): string {
        return this.renderer.getHoveredPortId(x, y);
    }

    updateGrabLine(x: number, y: number, x2: number, y2: number): void {
        return this.renderer.updateGrabLine(x, y, x2, y2);
    }

    getNodeFromPortId(portId: string): Node {
        return this.nodes.getNodeFromPortId(portId);
    }

    removeGrabLine(): void {
        this.renderer.removeGrabLine();
    }

    dragStopDiagram(): void {

        this.diagram.dragStop()
    }

    dragMoveDiagram(x: number, y: number): void {
        this.diagram.dragMove(x, y);
        this.updateCanvasPosition(this.diagram.xDrag, this.diagram.yDrag);
    }

    updateCanvasPosition(x: number, y: number): void {
        this.renderer.updateCanvasPosition(x, y);
    }

    isCanvasHovered(x: number, y: number): boolean {
        return this.renderer.isCanvasHovered(x, y);
    }

    dragStartDiagram(x: number, y: number): void {
        this.diagram.dragStart(x, y);
    }

    getHoveredNodeId(x: number, y: number): string {
        return this.renderer.getHoveredNodeId(x, y);
    }

    getNodeById(nodeId: string) {
        return this.nodes.getNodeById(nodeId);
    }

    updateNodePos(node: Node): void {
        this.renderer.updateNodePos(node);
    }

    renderNodeConnections(node: Node) {
        this.connections.getByNodeId(node.id).forEach((connection) => {
            this.renderConnection(connection);
        });
    }

    renderAll() {
        this.renderNodes();
        this.updateNodes();
        this.updateLines();
    }
}
