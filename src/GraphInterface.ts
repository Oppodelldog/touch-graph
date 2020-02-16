import {Connection, Node, Nodes, Port} from "./data";

export interface ApplicationInterface {

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
