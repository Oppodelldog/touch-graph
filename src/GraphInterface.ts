import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {ConnectionUpdate} from "./Controller";
import {Connections} from "./data/Connections";

export type CallbackValidateNewConnection = (connection: Connection) => boolean;

export interface GraphCallbackInterface {
    onValidateNewConnection(f: CallbackValidateNewConnection): void

    onNewNode(f: (node: Node) => void): void

    onNodeSelectionChanged(f: ({node: Node, selected: boolean}) => void): void

    onRemoveNode(f: (node: Node) => void): void

    onMoveNode(f: (node: Node) => void): void

    onMoveCanvas(f: (pos: { x: number, y: number }) => void): void

    onScaleChanged(f: (scale: number) => void): void

    onDragConnectionLine(f: ({X1: x, Y1: y, X2: x2, Y2: y2}) => void): void

    onRemoveConnectionLine(f: () => void): void

    onUpdateConnection(f: (connectionUpdate: ConnectionUpdate) => void): void

    onNewConnection(f: (connectionUpdate: ConnectionUpdate) => void): void

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

    moveTo(x: number, y: number): void

    getBoundingClientRect(): DOMRect

    getNodeFromPortId(portId: string): Node

    getPortConnections(portId: string): Connection[]

    updateAllNodePositions(): void

    setNodeCaption(nodeId: string, caption: string): void

    setPortName(portId:string,name:string):void

    clear(): void
}
