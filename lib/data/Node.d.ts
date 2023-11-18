import Port from "./Port";
export default class Node {
    x: number;
    y: number;
    id: string;
    portsIn: Port[];
    portsOut: Port[];
    type: string;
    caption: string;
    customClasses: string[];
    userData: any;
    constructor();
    hasPort(portId: string): boolean;
    getPortById(portId: string): Port | null;
    removePort(portId: string): void;
    isInPort(portId: string): boolean;
    isOutPort(portId: string): boolean;
    addInPort(port: Port): void;
    addOutPort(port: Port): void;
}
