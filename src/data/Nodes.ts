import {PortDirection} from "../Graph";
import {Node} from "./Node"

export class Nodes {
    private readonly nodes: Node[];

    constructor() {
        this.nodes = new Array<Node>();
    }

    getNodeById(nodeId): Node | null {
        let nodes = this.nodes.filter((node) => node.id === nodeId);
        if (nodes.length === 1) {
            return nodes[0];
        }
        return null;
    }

    getPortDirection(portId: string): PortDirection {
        if (this.isInPort(portId)) {
            return PortDirection.Input;
        } else if (this.isOutPort(portId)) {
            return PortDirection.Output;
        }

        return PortDirection.Unknown;
    }

    getNodeFromPortId(portId: string): Node {
        let result = this.nodes.filter((node) => node.hasPort(portId));
        if (result.length === 1) {
            return result[0];
        }

        throw `node not found for portId '${portId}'`;
    }

    isInPort(portId: string): boolean {
        return this.getNodeFromPortId(portId).isInPort(portId)
    }

    isOutPort(portId: string): boolean {
        return this.getNodeFromPortId(portId).isOutPort(portId)
    }

    push(node: Node) {
        this.nodes.push(node);
    }

    forEach(forEachCallback: (node) => void) {
        this.nodes.forEach((n) => forEachCallback(n))
    }

    getAll(): Node[] {
        return this.nodes
    }
}
