import Port from "./Port";

export default class Node {
    public x: number;
    public y: number;
    public id: string;
    public portsIn: Port[];
    public portsOut: Port[];
    public type: string;
    public caption: string;
    public customClasses: string[];
    public userData: any;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.id = "";
        this.portsIn = [];
        this.portsOut = [];
        this.type = "";
        this.caption = "";
        this.customClasses = [];
        this.userData = {};
    }

    public hasPort(portId: string): boolean {
        return this.portsIn.concat(this.portsOut).filter((port) => port.id === portId).length !== 0;
    }

    public getPortById(portId: string): Port | null {
        let ports = this.portsIn.concat(this.portsOut).filter((port) => port.id === portId);
        if (ports.length === 1) {
            return ports[0];
        }
        return null;
    }

    public removePort(portId: string): void {
        this.portsIn = this.portsIn.filter((port: Port) => port.id !== portId);
        this.portsOut = this.portsOut.filter((port: Port) => port.id !== portId);
    }

    public isInPort(portId: string): boolean {
        return this.portsIn.filter((port) => port.id === portId).length === 1;
    }

    public isOutPort(portId: string): boolean {
        return this.portsOut.filter((port) => port.id === portId).length === 1;
    }

    public addInPort(port: Port): void {
        this.portsIn.push(port);
    }

    public addOutPort(port: Port): void {
        this.portsOut.push(port);
    }
}
