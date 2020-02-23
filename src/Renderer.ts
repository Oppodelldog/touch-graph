import d3 = require("d3");
import Node from "./data/Node"
import {Position} from "./data/Position";
import {EventCallback, EventType, ViewEvents} from "./ViewEvents";

interface RenderInterface {
    renderNode(node): void

    updateCanvasPosition(x?: number, y?: number): void

    setScale(scale: number): void

    updateNodePos(node: Node): void

    updateNodeSelection(nodeId: string, selected: boolean): void

    updateLine(connectionId, fromPortId, toPortId, fromNode, toNode): void

    updateGrabLine(x1: number, y1: number, x2: number, y2: number): void

    removeGrabLine(): void
}

interface ViewInterface {
    getHoveredNodeId(x: number, y: number): string

    getHoveredPortId(x: number, y: number): string

    isCanvasHovered(x: number, y: number): boolean
}

export class Renderer implements RenderInterface, ViewInterface {
    private readonly canvas: HTMLDivElement;
    private readonly backgroundCanvas;
    private readonly svgCanvas;
    private readonly htmlCanvas;
    private readonly nodeElements = [];
    private readonly canvasLayers;
    private readonly svg;
    private readonly canvasLayersTransforms: { scale: string; translate: string };
    private readonly viewEvents: ViewEvents;
    private portRadius = 7;
    public onClickLine;
    private scale = 1;

    constructor(canvas) {
        this.canvas = canvas;

        this.backgroundCanvas = Renderer.addDivElement("background-canvas", "div", this.canvas);
        this.htmlCanvas = Renderer.addDivElement("html-canvas", "div", this.canvas);

        this.svg = d3.select(canvas).append('svg');
        this.svg.attr("id", "svg-canvas");
        this.svgCanvas = document.getElementById("svg-canvas");

        this.canvasLayers = [this.backgroundCanvas, this.svgCanvas, this.htmlCanvas];
        this.canvasLayersTransforms = {translate: "translate(0,0)", scale: "scale(1)"};

        this.viewEvents = new ViewEvents(this.canvas, this);
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

    private updateLayerTransforms(): void {
        this.canvasLayers.forEach((layer) => layer.style.transform = `${this.canvasLayersTransforms.translate} ${this.canvasLayersTransforms.scale}`);
    }

    public updateCanvasPosition(x: number, y: number): void {
        this.canvasLayersTransforms.translate = `translate(${x}px,${y}px)`;
        this.updateLayerTransforms();
    }

    public setScale(scale: number): void {
        this.scale = scale;
        this.canvasLayersTransforms.scale = `scale(${scale})`;
        this.updateLayerTransforms();
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

    public getHoveredNodeId(x: number, y: number): string {
        let touchedNodeId = "";
        this.nodeElements.forEach(nodeElement => {
                const rect = nodeElement.getBoundingClientRect();
                if (x >= rect.left && x <= (rect.width + rect.left)
                    && y > rect.top && y < (rect.height + rect.top)) {
                    touchedNodeId = nodeElement.id;
                }
            }
        );

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
                }
            );
        }

        return touchedPortId;
    }

    public isCanvasHovered(x: number, y: number): boolean {
        const rect = this.canvas.getBoundingClientRect();
        return x >= rect.left && x <= (rect.width + rect.left)
            && y > rect.top && y < (rect.height + rect.top);
    }

    public updateLine(connectionId, fromPortId, toPortId, fromNode, toNode): void {
        const portFrom = document.getElementById(fromPortId);
        const portTo = document.getElementById(toPortId);

        let x1 = this.portPos(portFrom.offsetLeft + fromNode.x);
        let y1 = this.portPos(portFrom.offsetTop + fromNode.y);
        let x2 = this.portPos(portTo.offsetLeft + toNode.x);
        let y2 = this.portPos(portTo.offsetTop + toNode.y);

        const id = Renderer.getConnectionElementId(connectionId);
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
                if (theRenderer.onClickLine) {
                    theRenderer.onClickLine(connectionId);
                }
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

    public getDiagramPos(viewX: any, viewY: any): Position {
        const diagramCanvasRect = this.htmlCanvas.getBoundingClientRect();
        const diagramX = viewX - diagramCanvasRect.x;
        const diagramY = viewY - diagramCanvasRect.y;
        return {x: diagramX / this.scale, y: diagramY / this.scale} as Position;
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
}
