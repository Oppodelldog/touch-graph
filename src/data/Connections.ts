import {Connection} from "./Connection";

export class Connections {
    private connections: Array<Connection>;

    constructor() {
        this.connections = new Array<Connection>();
    }

    getByPortId(portId: string): Connection[] {
        return this.connections.filter((connection) => connection.from.portId === portId || connection.to.portId === portId)
    }

    getByNodeId(nodeId: string): Connection[] {
        return this.connections.filter((connection) => connection.to.nodeId === nodeId || connection.from.nodeId === nodeId)
    }

    push(connection: Connection): void {
        this.connections.push(connection)
    }

    remove(connectionId: string): void {
        this.connections = this.connections.filter((connection) => connection.id !== connectionId);
    }

    forEach(forEachCallback: (connection) => void) {
        this.connections.forEach((c) => forEachCallback(c))
    }
}
