import Node from "./data/Node";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import { Connection } from "./data/Connection";
import { ViewInterface } from "./Renderer";
import { EventCallback, EventType } from "./ViewEvents";
import { Observer } from "./Observer";
export declare class ConnectionUpdate {
    connection: Connection;
    fromNode: Node;
    toNode: Node;
}
export declare abstract class ObservableController {
    readonly onNewNode: Observer<Node>;
    readonly onRemoveNode: Observer<Node>;
    readonly onMoveNode: Observer<Node>;
    readonly onNodeSelectionChanged: Observer<{
        node: Node;
        selected: boolean;
    }>;
    readonly onNewConnection: Observer<ConnectionUpdate>;
    readonly onUpdateConnection: Observer<ConnectionUpdate>;
    readonly onRemoveConnection: Observer<Connection>;
    readonly onCenterCanvas: Observer<{
        x: number;
        y: number;
    }>;
    readonly onDragCanvas: Observer<{
        x: number;
        y: number;
    }>;
    readonly onScaleChanged: Observer<number>;
    readonly onDragConnectionLine: Observer<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }>;
    readonly onRemoveConnectionLine: Observer<void>;
    readonly onSetNodeCaption: Observer<Node>;
    readonly onSetPortName: Observer<{
        node: Node;
        port: Port;
    }>;
}
export declare class Controller extends ObservableController {
    onValidateNewConnection: (connection: Connection) => boolean;
    private readonly connections;
    private readonly nodes;
    private readonly view;
    private readonly diagram;
    private readonly selectedNodes;
    private scale;
    constructor(view: ViewInterface);
    clear(): void;
    private newConnectionUpdate;
    updateConnection(connection: Connection): void;
    getNodes(): Nodes;
    registerEventHandler(eventType: EventType, callback: EventCallback): string;
    removeEventHandler(id: string): void;
    getNumberOfPortConnections(portId: any): number;
    getPortConnections(portId: string): Connection[];
    addConnection(connection: Connection): boolean;
    createNode(): Node;
    createPort(): Port;
    createConnection(nodeA: any, portA: any, nodeB: any, portB: any): Connection;
    addNode(node: Node): void;
    setScale(scale: any): void;
    moveTo(x: any, y: any): void;
    center(x: any, y: any): void;
    getScale(): number;
    getHoveredPortId(x: number, y: number): string;
    updateGrabLine(x: number, y: number, x2: number, y2: number): void;
    getNodeFromPortId(portId: string): Node;
    removeGrabLine(): void;
    dragStartDiagram(x: number, y: number): void;
    dragMoveDiagram(x: number, y: number): void;
    dragStopDiagram(): void;
    private centerPosition;
    isCanvasHovered(x: number, y: number): boolean;
    getHoveredNodeId(x: number, y: number): string;
    isNodeHovered(x: number, y: number): boolean;
    getNodeById(nodeId: string): Node | null;
    updateNodePos(node: Node): void;
    updateAllNodePositions(): void;
    renderNodeConnections(node: Node): void;
    selectNode(nodeId: string): void;
    private updateNodeSelection;
    deselectNode(nodeId: string): void;
    removeSelectedNodeKeepLatest(): void;
    isNodeSelected(nodeId: string): boolean;
    private removeConnection;
    deleteSelectedNodes(): void;
    private removeNode;
    setNodeCaption(nodeId: string, caption: string): void;
    setPortCaption(portId: string, caption: string): void;
}
