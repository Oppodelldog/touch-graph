import {Node} from "./data/Node";
import {Connection} from "./data/Connection";
import {Nodes} from "./data/Nodes";
import {Port} from "./data/Port";
import {Position} from "./data/Position"
import {DragPortAction} from "./dragndrop/DragPortAction";
import {DragNodeAction} from "./dragndrop/DragNodeAction";
import {DragAction} from "./dragndrop/DragActionInterface";
import {DragDiagramAction} from "./dragndrop/DragDiagramAction";
import {DragActions} from "./dragndrop/DragActions";
import {Controller} from "./Controller";
import {GraphInterface} from "./GraphInterface";

export enum PortDirection {
    Unknown = 0,
    Input = 1,
    Output = 2
}

type CallbackValidateNewConnection = (connection: Connection) => void;

export class Graph implements GraphInterface {

    private pinchStart = null;
    private dragActions: DragActions;
    private readonly controller: Controller;

    constructor() {
        this.controller = new Controller();
        this.dragActions = new DragActions([
            new DragPortAction(this.controller),
            new DragNodeAction(this.controller),
            new DragDiagramAction(this.controller)
        ] as DragAction[])
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

    private touchStart(x, y): void {
        const mousePos = {x: x, y: y} as Position;
        const diagramPointerPos = this.getDiagramPos(x, y);
        this.dragActions.start(mousePos, diagramPointerPos);
    }

    private touchMove(x, y): void {
        const mousePos = {x: x, y: y} as Position;
        const diagramPointerPos = this.getDiagramPos(x, y);
        this.dragActions.move(mousePos, diagramPointerPos);
    }

    private touchEnd(x, y): void {
        const mousePos = {x: x, y: y} as Position;
        const diagramPointerPos = this.getDiagramPos(x, y);
        this.dragActions.end(mousePos, diagramPointerPos);
    }

    private registerEvents(): void {
        const theApp = this;
        const canvasElement = this.controller.getCanvasElement();
        const theController = this.controller;

        if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
            // Touch device
            canvasElement.addEventListener("touchstart", function (event) {
                if (event.touches.length === 1) {
                    const touch = event.touches[0];
                    theApp.touchStart(touch.clientX, touch.clientY);
                } else if (event.touches.length === 2) {
                    if (theApp.pinchStart === null) {
                        let t1 = event.touches[0];
                        let t2 = event.touches[1];
                        theApp.pinchStart = Math.sqrt((t1.clientX - t2.clientX) * (t1.clientX - t2.clientX) + (t1.clientY - t2.clientY) * (t1.clientY - t2.clientY));
                    } else {
                        let t1 = event.touches[0];
                        let t2 = event.touches[1];
                        const newPinch = Math.sqrt((t1.clientX - t2.clientX) * (t1.clientX - t2.clientX) + (t1.clientY - t2.clientY) * (t1.clientY - t2.clientY));
                        theApp.setScale((theApp.pinchStart - newPinch) / 100);
                    }
                } else {
                    alert(event.touches.length)
                }
                event.preventDefault();
            });
            canvasElement.addEventListener("touchmove", function (event) {
                const touch = event.touches[0];
                theApp.touchMove(touch.clientX, touch.clientY);
                event.preventDefault();
            });
            canvasElement.addEventListener("touchend", function (event) {
                let touch = Graph.getTouchEndEventTouch(event);
                if (touch === null) {
                    throw "could not get touch end position.";
                }

                theApp.touchEnd(touch.clientX, touch.clientY);
                event.preventDefault();
            });
            canvasElement.addEventListener("touchcancel", function (event) {
                let touch = Graph.getTouchEndEventTouch(event);
                if (touch === null) {
                    throw "could not get touch end position.";
                }
                theApp.touchEnd(touch.clientX, touch.clientY);
                event.preventDefault();
            });
        } else {
            // Desktop Device
            canvasElement.addEventListener("mousedown", function (event) {
                theApp.touchStart(event.clientX, event.clientY);
                event.preventDefault();
            });
            canvasElement.addEventListener("mousemove", function (event) {
                theApp.touchMove(event.clientX, event.clientY);
                event.preventDefault();
            });
            canvasElement.addEventListener("mouseup", function (event) {
                theApp.touchEnd(event.clientX, event.clientY);
                event.preventDefault();
            });
            canvasElement.addEventListener("wheel", function (event) {
                let factor = (event.deltaY) > 0 ? 1 : -1;
                let newScale = theController.getScale() + (0.1 * factor);
                if (newScale < 0.1) {
                    newScale = 0.1;
                }
                theApp.setScale(newScale);
                event.preventDefault();
            });
        }

        canvasElement.addEventListener('dblclick', function (event) {
            theApp.doubleClick(event.clientX, event.clientY);
        })
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
