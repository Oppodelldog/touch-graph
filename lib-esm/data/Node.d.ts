import Port from "./Port";
export default class Node {
    x: number;
    y: number;
    id: string;
    portsIn: any[];
    portsOut: any[];
    type: string;
    caption: string;
    customClass: string;
    userData: any;
    constructor();
    hasPort(portId: string): boolean;
    getPortById(portId: string): Port | null;
    isInPort(portId: string): boolean;
    isOutPort(portId: string): boolean;
    addInPort(port: Port): void;
    addOutPort(port: Port): void;
}
