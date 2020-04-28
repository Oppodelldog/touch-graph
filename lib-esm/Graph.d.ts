import Node from "./data/Node";
import { Connection } from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import { ConnectionUpdate } from "./Controller";
import { CallbackValidateNewConnection, GraphCallbackInterface, GraphInterface } from "./GraphInterface";
export declare class Graph implements GraphInterface, GraphCallbackInterface {
    private readonly controller;
    private readonly renderer;
    constructor();
    onValidateNewConnection(f: CallbackValidateNewConnection): void;
    onNewNode(f: (node: Node) => void): void;
    onRemoveNode(f: (node: Node) => void): void;
    onMoveNode(f: (node: Node) => void): void;
    onMoveCanvas(f: (pos: {
        x: number;
        y: number;
    }) => void): void;
    onScaleChanged(f: (scale: number) => void): void;
    onDragConnectionLine(f: ({ X1: x, Y1: y, X2: x2, Y2: y2 }: {
        X1: any;
        Y1: any;
        X2: any;
        Y2: any;
    }) => void): void;
    onRemoveConnectionLine(f: () => void): void;
    onNodeSelectionChanged(f: ({ Node: Node, Selected: boolean }: {
        Node: any;
        Selected: any;
    }) => void): void;
    onNewConnection(f: (connection: ConnectionUpdate) => void): void;
    onUpdateConnection(f: (connection: ConnectionUpdate) => void): void;
    onRemoveConnection(f: (connection: Connection) => void): void;
    getNodes(): Nodes;
    getNumberOfPortConnections(portId: any): number;
    addConnection(nodeA: any, portA: any, nodeB: any, portB: any): Connection | null;
    createNode(): Node;
    createPort(): Port;
    addNode(node: Node): void;
    setScale(scale: any): void;
    moveTo(x: any, y: any): void;
    private initStates;
    getBoundingClientRect(): DOMRect;
    getNodeFromPortId(portId: string): Node;
    getPortConnections(portId: string): Connection[];
}
