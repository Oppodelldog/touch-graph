import Node from "./Node"

export enum PortDirection {
    Unknown = 0,
    Input = 1,
    Output = 2
}

export default class Nodes {
    private readonly nodes: Node[];

    constructor() {
        this.nodes = new Array<Node>();
    }

    public getById(nodeId): Node | null {
        let nodes = this.nodes.filter((node) => node.id === nodeId);
        if (nodes.length === 1) {
            return nodes[0];
        }
        return null;
    }

    public getPortDirection(portId: string): PortDirection {
        if (this.isInPort(portId)) {
            return PortDirection.Input;
        } else if (this.isOutPort(portId)) {
            return PortDirection.Output;
        }

        return PortDirection.Unknown;
    }

    public getNodeFromPortId(portId: string): Node {
        let result = this.nodes.filter((node) => node.hasPort(portId));
        if (result.length === 1) {
            return result[0];
        }

        throw `node not found for portId '${portId}'`;
    }

    public isInPort(portId: string): boolean {
        return this.getNodeFromPortId(portId).isInPort(portId)
    }

    public isOutPort(portId: string): boolean {
        return this.getNodeFromPortId(portId).isOutPort(portId)
    }

    public push(node: Node) {
        this.nodes.push(node);
    }

    public forEach(forEachCallback: (node) => void) {
        this.nodes.forEach((n) => forEachCallback(n))
    }

    public getAll(): Node[] {
        return this.nodes
    }

    public remove(nodeId: string) {
        let node = this.getById(nodeId);
        if (node !== null) {
            let index = this.nodes.indexOf(node);
            this.nodes.splice(index, 1)
        } else {
            throw new Error("node not found:" + nodeId)
        }
    }
}
