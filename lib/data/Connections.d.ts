import { Connection } from "./Connection";
export declare class Connections {
    private connections;
    constructor();
    getById(connectionId: string): Connection;
    getByPortId(portId: string): Connection[];
    getByNodeId(nodeId: string): Connection[];
    push(connection: Connection): void;
    remove(connectionId: string): void;
    forEach(forEachCallback: (connection: any) => void): void;
}
