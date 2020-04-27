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
    constructor();
    hasPort(portId: string): boolean;
    isInPort(portId: string): boolean;
    isOutPort(portId: string): boolean;
    addInPort(port: Port): void;
    addOutPort(port: Port): void;
}
