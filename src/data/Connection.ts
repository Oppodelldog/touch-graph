export class Connection {
    public id: string;
    public from: ConnectionEndpoint;
    public to: ConnectionEndpoint;

    constructor() {
        this.id = "";
        this.from = new ConnectionEndpoint();
        this.to = new ConnectionEndpoint();
    }
}

export class ConnectionEndpoint {
    public nodeId: string;
    public portId: string;

    constructor() {
        this.nodeId = "";
        this.portId = "";
    }
}
