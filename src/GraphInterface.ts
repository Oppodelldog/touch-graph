import {Node,} from "./data/Node";
import {Connection,} from "./data/Connection";
import {Nodes,} from "./data/Nodes";
import {Port} from "./data/Port";


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
