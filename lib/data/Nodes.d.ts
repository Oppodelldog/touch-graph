import Node from "./Node";
export declare enum PortDirection {
    Unknown = 0,
    Input = 1,
    Output = 2
}
export default class Nodes {
    private readonly nodes;
    constructor();
    getById(nodeId: any): Node | null;
    getPortDirection(portId: string): PortDirection;
    getNodeFromPortId(portId: string): Node;
    isInPort(portId: string): boolean;
    isOutPort(portId: string): boolean;
    push(node: Node): void;
    forEach(forEachCallback: (node: any) => void): void;
    getAll(): Node[];
    remove(nodeId: string): void;
}
