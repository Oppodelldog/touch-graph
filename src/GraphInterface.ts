import Node from "./data/Node";
import {Connection} from "./data/Connection";
import Nodes from "./data/Nodes";
import Port from "./data/Port";
import {ConnectionUpdate} from "./Controller";

export type CallbackValidateNewConnection = (connection: Connection) => boolean;

export interface GraphCallbackInterface {
    onValidateNewConnection(f: CallbackValidateNewConnection): void

    onNewNode(f: (node: Node) => void): void

    onNodeSelectionChanged(f: ({node, selected}) => void): void

    onRemoveNode(f: (node: Node) => void): void

    onMoveNode(f: (node: Node) => void): void

    onMoveCanvas(f: (pos: { x: number, y: number }) => void): void

    onScaleChanged(f: (scale: number) => void): void

    onDragConnectionLine(f: ({X1, Y1, X2, Y2}) => void): void

    onRemoveConnectionLine(f: () => void): void

    onUpdateConnection(f: (connectionUpdate: ConnectionUpdate) => void): void

    onNewConnection(f: (connectionUpdate: ConnectionUpdate) => void): void

    onRemoveConnection(f: (connection: Connection) => void): void

    onConnectionTargetNotDefined(f: ({node, port}) => void): void
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

    setPortCaption(portId:string,caption:string):void

    removePort(portId:string):void

    addInPort(caption:string, nodeId:string):void;

    moveInPortDown(portId: string): void;

    moveInPortUp(portId: string): void;

    clear(): void;

    setCustomCssClass(nodeId: string, className: string): void;

    removeCustomCssClass(nodeId: string, className: string): void
}
