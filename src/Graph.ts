import {Node} from "./data/Node";
import {Connection} from "./data/Connection";
import {Nodes} from "./data/Nodes";
import {Port} from "./data/Port";
import {Position} from "./data/Position"
import {Controller} from "./Controller";
import {GraphInterface} from "./GraphInterface";
import {Builder} from "./State/Builder";
import {State, Transition} from "./State/State";
import {GrabNode, NodeGrabbed, ReleaseNode} from "./Transitions/GrabNode";
import {GrabPort, PortGrabbed, ReleasePort} from "./Transitions/GrabPort";
import {DiagramGrabbed, GrabDiagram, ReleaseDiagram} from "./Transitions/GrabDiagram";
import {UseMousewheel, ZoomFinished, Zooming} from "./Transitions/Zoom";
import {AdjustingFocus, DoubleClick, FocusAdjustmentFinished} from "./Transitions/FocusElement";

export enum PortDirection {
    Unknown = 0,
    Input = 1,
    Output = 2
}

type CallbackValidateNewConnection = (connection: Connection) => void;

export class Graph implements GraphInterface {

    private readonly controller: Controller;

    constructor() {
        this.controller = new Controller();
    }

    onValidateNewConnection(f: CallbackValidateNewConnection): void {
        this.controller.onValidateNewConnection = (connection) => f(connection)
    }

    public getNodes(): Nodes {
        return this.controller.getNodes();
    }

    public getNumberOfPortConnections(portId): number {
        return this.controller.getNumberOfPortConnections(portId);
    }

    public addConnection(nodeA, portA, nodeB, portB): Connection | null {
        const connection = this.controller.createConnection(nodeA, portA, nodeB, portB);
        if (this.controller.addConnection(connection)) {
            return connection;
        }

        return null;
    }

    public createNode(): Node {
        return this.controller.createNode();
    }

    public createPort(): Port {
        return this.controller.createPort()
    }

    public addNode(node: Node): void {
        this.controller.addNode(node)
    }

    public setScale(scale): void {
        this.controller.setScale(scale)
    }

    public moveTo(x, y): void {
        this.controller.moveTo(x, y)
    }

    public start(): void {
        this.registerEvents();
        this.controller.renderAll();
    }

    private getDiagramPos(viewX, viewY): Position {
        return this.controller.getDiagramPos(viewX, viewY)
    }

    private doubleClick(x, y): void {
        this.controller.center(x, y)
    }

    private registerEvents(): void {
        const theApp = this;
        const canvasElement = this.controller.getCanvasElement();
        const theController = this.controller;

        let b = new Builder();
        let context = b.build(
            (name: string): State => {
                switch (name) {
                    case 'Node Grabbed':
                        return new NodeGrabbed(name, this.controller);
                    case 'Port Grabbed':
                        return new PortGrabbed(name, this.controller);
                    case 'Diagram Grabbed':
                        return new DiagramGrabbed(name, this.controller);
                    case 'Zooming':
                        return new Zooming(name, this.controller);
                    case 'Adjusting Focus':
                        return new AdjustingFocus(name, this.controller);
                    default:
                        return new State(name);
                }
            },
            (name: string): Transition => {
                switch (name) {
                    case 'Grab Node':
                        return new GrabNode(name, this.controller);
                    case 'Release Node':
                        return new ReleaseNode(name, this.controller);
                    case 'Grab Port':
                        return new GrabPort(name, this.controller);
                    case 'Release Port':
                        return new ReleasePort(name, this.controller);
                    case 'Grab Diagram':
                        return new GrabDiagram(name, this.controller);
                    case 'Release Diagram':
                        return new ReleaseDiagram(name, this.controller);
                    case 'Use Mousewheel':
                        return new UseMousewheel(name, this.controller);
                    case 'Zoom finished':
                        return new ZoomFinished(name);
                    case 'Double Click':
                        return new DoubleClick(name, this.controller);
                    case 'Focus adjustment finished':
                        return new FocusAdjustmentFinished(name);
                    default:
                        throw new Error("unexpected Transition: " + name);
                }
            }
        );

        if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
            // Touch device
            canvasElement.addEventListener("touchstart", function (event) {
            });
            canvasElement.addEventListener("touchmove", function (event) {
            });
            canvasElement.addEventListener("touchend", function (event) {
            });
            canvasElement.addEventListener("touchcancel", function (event) {
            });
        } else {
        }
    }

    private static getTouchEndEventTouch(event) {
        let touch = null;
        if (event.touches.length > 0) {
            touch = event.touches[0];
        }
        if (event.changedTouches.length > 0) {
            touch = event.changedTouches[0];
        }
        return touch;
    }
}
