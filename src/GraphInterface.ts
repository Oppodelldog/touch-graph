import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";

export type CallbackValidateNewConnection = (connection: Connection) => boolean;
export type CallbackNewNode = (node: Node) => void;
export type CallbackRemoveNode = (node: Node) => void;
export type CallbackNewConnection = (connection: Connection) => void;

export interface GraphCallbackInterface {
    onValidateNewConnection(f: CallbackValidateNewConnection): void

    onNewNode(f: CallbackNewNode): void

    onRemoveNode(f: CallbackRemoveNode): void

    onNewConnection(f: CallbackNewConnection): void
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
