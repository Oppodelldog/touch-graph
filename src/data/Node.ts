import {Port} from "./Port";

export class Node {
    public x: number;
    public y: number;
    public id: string;
    public portsIn: any[];
    public portsOut: any[];
    public type: string;
    public caption: string;
    public customClass: string;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.id = "";
        this.portsIn = [];
        this.portsOut = [];
        this.type = "";
        this.caption = "";
        this.customClass = "";
    }

    hasPort(portId: string): boolean {
        return this.portsIn.concat(this.portsOut).filter((port) => port.id === portId).length !== 0;
    }

    getPort(portId: string): Port | null {
        let ports = this.portsIn.concat(this.portsOut).filter((port) => port.id === portId);
        if (ports.length === 1) {
            return ports[0];
        }

        return null;
    }

    isInPort(portId: string): boolean {
        return this.portsIn.filter((port) => port.id === portId).length === 1;
    }

    isOutPort(portId: string): boolean {
        return this.portsOut.filter((port) => port.id === portId).length === 1;
    }

    addInPort(port: Port): void {
        this.portsIn.push(port);
    }

    addOutPort(port: Port): void {
        this.portsOut.push(port);
    }
}
