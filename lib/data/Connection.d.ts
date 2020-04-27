export declare class Connection {
    id: string;
    from: ConnectionEndpoint;
    to: ConnectionEndpoint;
    constructor();
}
export declare class ConnectionEndpoint {
    nodeId: string;
    portId: string;
    constructor();
}
