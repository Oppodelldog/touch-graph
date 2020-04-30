import * as d3 from "d3";
import Node from "./data/Node"
import {Position} from "./data/Position";
import {EventCallback, EventType, ViewEvents} from "./ViewEvents";
import {ConnectionUpdate, ObservableController} from "./Controller";
import {Connection} from "./data/Connection";

const canvasElementId = "touch-graph";

export interface RenderInterface {
    renderNode(node): void

    removeConnection(connectionId: string): void;

    removeNode(nodeId: string): void;

    updateNodePos(node: Node): void

    updateNodeSelection(nodeId: string, selected: boolean): void

    updateLine(update: ConnectionUpdate): void

    centerAtPosition(x?: number, y?: number): void

    setScale(scale: number): void

    updateGrabLine(x1: number, y1: number, x2: number, y2: number): void

    removeGrabLine(): void

    bind(controller: ObservableController): void
}

export interface ViewInterface {
    getHoveredNodeId(x: number, y: number): string

    getHoveredPortId(x: number, y: number): string

    isCanvasHovered(x: number, y: number): boolean

    registerEventHandler(eventType: EventType, callback: EventCallback)

    removeEventHandler(id: string)

    onClickLine(f: (connectionId) => void): void;

    getOffsetForCenteredPosition(x: any, y: any, xOffset: number, yOffset: number): { x: number, y: number };

    getBoundingClientRect(): DOMRect;
}

export interface RendererInterface extends RenderInterface, ViewInterface {
}

export class Renderer implements RendererInterface {

    private readonly canvas: HTMLElement;
    private readonly backgroundCanvas: HTMLElement;
    private readonly svgCanvas: HTMLElement;
    private readonly htmlCanvas: HTMLElement;
    private readonly nodeElements: HTMLElement[] = [] as HTMLElement[];
    private readonly canvasLayers: HTMLElement[] = [] as HTMLElement[];
    private readonly svg;
    private readonly canvasLayersTransforms: { scale: string; translate: string };
    private readonly viewEvents: ViewEvents;
    private portRadius: number = 7;
    private scale: number = 1;
    private canvasX = 0;
    private canvasY = 0;
    private _onClickLine: (connectionId: any) => void = () => void {};

    constructor() {
        this.canvas = document.getElementById(canvasElementId);
        if (this.canvas == null) {
            throw new Error(`need a div tag with id='${canvasElementId}'`);
        }

        this.backgroundCanvas = Renderer.addDivElement("background-canvas", "div", this.canvas);
        this.htmlCanvas = Renderer.addDivElement("html-canvas", "div", this.canvas);

        this.svg = d3.select(this.canvas).append('svg');
        this.svg.attr("id", "svg-canvas");
        this.svgCanvas = document.getElementById("svg-canvas");

        this.canvasLayers = [this.backgroundCanvas, this.svgCanvas, this.htmlCanvas];
        this.canvasLayersTransforms = {translate: "translate(0,0)", scale: "scale(1)"};

        this.viewEvents = new ViewEvents(this.canvas, this);
    }

    public bind(controller: ObservableController) {
        controller.onNewNode.subscribe(this.renderNode.bind(this));
        controller.onMoveNode.subscribe((node: Node) => this.updateNodePos(node));
        controller.onRemoveNode.subscribe((node: Node) => this.removeNode(node.id));
        controller.onNewConnection.subscribe((update: ConnectionUpdate) => this.updateLine(update));
        controller.onUpdateConnection.subscribe((update: ConnectionUpdate) => this.updateLine(update));
        controller.onRemoveConnection.subscribe((c: Connection) => this.removeConnection(c.id));
        controller.onScaleChanged.subscribe((scale: number) => this.setScale(scale));
        controller.onDragConnectionLine.subscribe((line: { x1: number, y1: number, x2: number, y2: number }) => this.updateGrabLine(line.x1, line.y1, line.x2, line.y2));
        controller.onRemoveConnectionLine.subscribe(() => this.removeGrabLine());
        controller.onCenterCanvas.subscribe((pos: { x: number, y: number }) => this.centerAtPosition(pos.x, pos.y));
        controller.onDragCanvas.subscribe((pos: { x: number, y: number }) => this.dragCanvas(pos.x, pos.y));
        controller.onNodeSelectionChanged.subscribe((change: { node: Node, selected: boolean }) => this.updateNodeSelection(change.node.id, change.selected));
    }

    private getCanvasRect(): DOMRect {
        return this.canvas.getBoundingClientRect();
    }

    public onClickLine(f: (connectionId: any) => void): void {
        this._onClickLine = f;
    }

    private static addDivElement(id: string, type: string, canvasElement) {
        let el = document.createElement(type);
        el.id = id;
        canvasElement.appendChild(el);

        return el;
    }

    public renderNode(node): void {
        let div = document.getElementById("#" + node.id);
        if (div) {
            div.parentNode.removeChild(div);
        }
        div = document.createElement("div");
        div.className = "node " + node.customClass;
        div.id = node.id;

        const title = document.createElement("div");
        title.className = "title";
        title.innerHTML = node.caption;
        div.appendChild(title);

        const body = document.createElement("div");
        body.className = "body";
        div.appendChild(body);

        const portInContainer = document.createElement("div");
        portInContainer.className = "ports-in";
        this.createNodePorts(node.portsIn).forEach((e) => portInContainer.appendChild(e));
        body.appendChild(portInContainer);

        const portOutContainer = document.createElement("div");
        portOutContainer.className = "ports-out";
        this.createNodePorts(node.portsOut).forEach((e) => portOutContainer.appendChild(e));
        body.appendChild(portOutContainer);

        this.nodeElements.push(div);
        this.htmlCanvas.appendChild(div);

        this.updateNodePos(node);
    }

    private createNodePorts(ports) {
        let portElements = [];

        ports.forEach((port) => {
            let portWrapper = document.createElement("div");
            portWrapper.className = "port-wrapper";
            let portElement = document.createElement("div");
            portElement.className = "port";
            portElement.id = port.id;
            portWrapper.appendChild(portElement);
            if (port.caption !== "") {
                const label = document.createElement("span");
                label.innerHTML = port.caption;
                label.className = "port-caption";
                portWrapper.appendChild(label);
            }
            portElements.push(portWrapper);
        });
        return portElements;
    }

    private applyLayerTransforms(): void {
        this.canvasLayers.forEach((layer) => layer.style.transform = `${this.canvasLayersTransforms.translate} ${this.canvasLayersTransforms.scale}`);
    }

    public setScale(scale: number): void {
        const scaledBy = scale - this.scale;
        this.alignPositionForCenteredScaling(scaledBy);

        this.scale = scale;
        this.canvasLayersTransforms.scale = `scale(${scale})`;
        this.applyLayerTransforms();
    }

    private alignPositionForCenteredScaling(scaledBy: number): void {
        let center = this.getCenterScreenDiagramPos()
        let newCanvasX = this.canvasX - center.x * scaledBy;
        let newCanvasY = this.canvasY - center.y * scaledBy;
        this.setCanvasPosition(newCanvasX, newCanvasY);
    }

    private getCenterScreenDiagramPos(): Position {
        let center = Renderer.getScreenCenterPos();
        return this.getDiagramPosFromScreenCoordinates(center.x, center.y);
    }

    private static getScreenCenterPos(): Position {
        let centerX = document.documentElement.clientWidth / 2;
        let centerY = document.documentElement.clientHeight / 2;
        return {x: centerX, y: centerY} as Position;
    }

    private portPos(v: number): number {
        return v + this.portRadius + 1;
    }

    public updateNodePos(node: Node): void {
        let div = document.getElementById(node.id);
        if (div) {
            div.style.transform = "translate(" + node.x + "px, " + node.y + "px)";
        }
    }

    getOffsetForCenteredPosition(x: any, y: any, xOffset: number, yOffset: number): { x: number; y: number; } {
        const diagramCanvasRect = this.getCanvasRect();
        xOffset = -x * this.scale;
        yOffset = -y * this.scale;
        xOffset += diagramCanvasRect.width / 2;
        yOffset += diagramCanvasRect.height / 2;

        return {x: xOffset, y: yOffset};
    }

    public getHoveredNodeId(x: number, y: number): string {
        let touchedNodeId = "";
        this.nodeElements.forEach(nodeElement => {
            const rect = nodeElement.getBoundingClientRect();
            if (x >= rect.left && x <= (rect.width + rect.left)
                && y > rect.top && y < (rect.height + rect.top)) {
                touchedNodeId = nodeElement.id;
            }
        });

        return touchedNodeId;
    }

    public getHoveredPortId(x: number, y: number): string {
        let touchedPortId = "";
        let touchedNodeId = this.getHoveredNodeId(x, y);
        if (touchedNodeId) {
            document.querySelectorAll(".port").forEach(portElement => {
                const rect = portElement.getBoundingClientRect();
                if (x >= rect.left && x <= (rect.width + rect.left)
                    && y > rect.top && y < (rect.height + rect.top)) {
                    touchedPortId = portElement.id;
                }
            });
        }

        return touchedPortId;
    }

    public isCanvasHovered(x: number, y: number): boolean {
        const rect = this.canvas.getBoundingClientRect();
        return x >= rect.left && x <= (rect.width + rect.left)
            && y > rect.top && y < (rect.height + rect.top);
    }

    public updateLine(update: ConnectionUpdate): void {
        const portFrom = document.getElementById(update.connection.from.portId);
        const portTo = document.getElementById(update.connection.to.portId);

        let x1 = this.portPos(portFrom.offsetLeft + update.fromNode.x);
        let y1 = this.portPos(portFrom.offsetTop + update.fromNode.y);
        let x2 = this.portPos(portTo.offsetLeft + update.toNode.x);
        let y2 = this.portPos(portTo.offsetTop + update.toNode.y);

        const id = Renderer.getConnectionElementId(update.connection.id);
        let path = this.svg.select("#" + id);
        if (path.empty()) {
            path = this.svg.append("path").attr("id", id);
        }

        const theRenderer = this;
        path.attr("class", "connection")
            .on("mouseover", function () {
                d3.select(this).attr("class", "connection connection--hovered");
            })
            .on("mouseout", function () {
                d3.select(this).attr("class", "connection");
            })
            .on("click", function () {
                theRenderer._onClickLine(update.connection.id);
                d3.select(this).remove();
            })
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .attr("d", `M${x1} ${y1} Q${x1} ${y2} ${x2} ${y2}`);
    }

    public updateGrabLine(x1: number, y1: number, x2: number, y2: number): void {
        const id = "grab-line";
        let path = this.svg.select("#" + id);
        if (path.empty()) {
            path = this.svg.append("path").attr("id", id);
        }

        path.attr("class", "connection grab-line")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .attr("d", `M${x1} ${y1} Q${x1} ${y2} ${x2} ${y2}`);
    }

    public removeGrabLine(): void {
        const id = "grab-line";
        this.svg.select("#" + id).remove();
    }

    public getDiagramPosFromScreenCoordinates(viewX: any, viewY: any): Position {
        const diagramCanvasRect = this.htmlCanvas.getBoundingClientRect();
        const diagramX = viewX - diagramCanvasRect.x;
        const diagramY = viewY - diagramCanvasRect.y;
        return {x: diagramX / this.scale, y: diagramY / this.scale} as Position;
    }

    public centerAtPosition(canvasX: number, canvasY: number): void {
        let scaledX = canvasX * this.scale;
        let scaledY = canvasY * this.scale;
        let screenCenter = Renderer.getScreenCenterPos();
        let deltaX = screenCenter.x - scaledX - this.canvasX;
        let deltaY = screenCenter.y - scaledY - this.canvasY;
        this.setCanvasPosition(this.canvasX + deltaX, this.canvasY + deltaY);
        this.applyLayerTransforms();
    }

    private dragCanvas(x: number, y: number) {
        this.setCanvasPosition(this.canvasX - x, this.canvasY - y);
        this.applyLayerTransforms();
    }

    public registerEventHandler(eventType: EventType, callback: EventCallback): string {
        return this.viewEvents.registerEventHandler(eventType, callback);
    }

    public removeEventHandler(id: string) {
        return this.viewEvents.removeEventHandler(id);
    }

    public updateNodeSelection(nodeId: string, selected: boolean): void {
        let div = document.getElementById(nodeId);
        if (div) {
            const classNameSelected = "node--selected";
            const classNameUnselected = "node--unselected";
            const className = (selected) ? classNameSelected : classNameUnselected;
            div.classList.remove(classNameSelected, classNameUnselected);
            div.classList.add(className)
        }
    }

    public removeNode(nodeId: string) {
        let div = document.getElementById(nodeId);
        if (div) {
            div.parentElement.removeChild(div);
        }
    }

    public removeConnection(connectionId: string) {
        const id = Renderer.getConnectionElementId(connectionId);
        this.svg.select("#" + id).remove();
    }

    private static getConnectionElementId(connectionId: string) {
        return "p_" + connectionId;
    }

    getBoundingClientRect(): DOMRect {
        return this.htmlCanvas.getBoundingClientRect();
    }

    private setCanvasPosition(x: number, y: number) {
        this.canvasX = x;
        this.canvasY = y;
        this.canvasLayersTransforms.translate = `translate(${x}px,${y}px)`;
    }
}
