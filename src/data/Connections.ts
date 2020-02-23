import {Connection} from "./Connection";

export class Connections {
    private connections: Array<Connection>;

    constructor() {
        this.connections = new Array<Connection>();
    }

    public getByPortId(portId: string): Connection[] {
        return this.connections.filter((connection) => connection.from.portId === portId || connection.to.portId === portId)
    }

    public getByNodeId(nodeId: string): Connection[] {
        return this.connections.filter((connection) => connection.to.nodeId === nodeId || connection.from.nodeId === nodeId)
    }

    public push(connection: Connection): void {
        this.connections.push(connection)
    }

    public remove(connectionId: string): void {
        this.connections = this.connections.filter((connection) => connection.id !== connectionId);
    }

    public forEach(forEachCallback: (connection) => void) {
        this.connections.forEach((c) => forEachCallback(c))
    }
}
