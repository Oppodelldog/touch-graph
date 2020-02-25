import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";

export type CallbackValidateNewConnection = (connection: Connection) => boolean;

export interface GraphCallbackInterface {
    onValidateNewConnection(f: CallbackValidateNewConnection): void

    onNewNode(f: (node: Node) => void): void

    onRemoveNode(f: (node: Node) => void): void

    onMoveNode(f: (node: Node) => void): void

    onMoveCanvas(f: (pos: { X: number, Y: number }) => void): void

    onScaleChanged(f: (scale: number) => void): void

    onDragConnectionLine(f: ({X1: x, Y1: y, X2: x2, Y2: y2}) => void): void

    onRemoveConnectionLine(f: () => void): void

    onUpdateConnection(f: (connection: Connection) => void): void

    onNodeSelectionChanged(f: ({Node: Node, Selected: boolean}) => void): void

    onNewConnection(f: (connection: Connection) => void): void

    onRemoveConnection(f: (connection: Connection) => void): void
}

export interface GraphInterface {

    getNodes(): Nodes

    getNumberOfPortConnections(portId): number

    addConnection(nodeA, portA, nodeB, portB): Connection | null

    createNode(): Node

    createPort(): Port

    addNode(node: Node): void

    setScale(scale): void

    moveTo(x, y): void

    start(): void
}
