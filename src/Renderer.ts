import d3 = require("d3");
import {Node} from "./data/Node"
import {Position} from "./data/Position";
import {EventCallback, EventType, ViewEvents} from "./ViewEvents";

interface RenderInterface {
    renderNode(node): void

    updateCanvasPosition(x?: number, y?: number): void

    setScale(scale: number): void

    updateNodePos(node: Node): void

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
    private nodeElements = [];
    private canvas: HTMLDivElement;
    public diagramXOffset = 0;
    public diagramYOffset = 0;
    private portRadius = 7;
    private readonly backgroundCanvas;
    private readonly svgCanvas;
    private readonly htmlCanvas;
    private canvasLayers;
    private svg;
    public onClickLine;
    private scale = 1;
    private canvasLayersTransforms: { scale: string; translate: string };
    private viewEvents: ViewEvents;

    constructor(canvas) {

        this.canvas = canvas;

        this.backgroundCanvas = document.getElementById("background-canvas");

        this.htmlCanvas = document.getElementById("html-canvas");

        this.svg = d3.select(canvas).append('svg');
        this.svg.attr("id", "svg-canvas");
        this.svgCanvas = document.getElementById("svg-canvas");

        this.canvasLayers = [this.backgroundCanvas, this.svgCanvas, this.htmlCanvas];
        this.canvasLayersTransforms = {translate: "translate(0,0)", scale: "scale(1)"};

        this.viewEvents = new ViewEvents(this.canvas, this);
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

    public updateCanvasPosition(x?: number, y?: number): void {
        if (typeof x === "undefined" || typeof y === "undefined") {
            x = this.diagramXOffset;
            y = this.diagramYOffset;
        }
        this.canvasLayersTransforms.translate = `translate(${x}px,${y}px)`;
        this.updateLayerTransforms();
    }

    public setScale(scale: number): void {
        this.scale = scale;
        this.canvasLayers.forEach((layer) => this.canvasLayersTransforms.scale = `scale(${scale})`);
        this.updateLayerTransforms();
    }

    private portCenter(v: number): number {
        return v + this.portRadius + 1;
    }

    private portPosX(v: number): number {
        return this.portCenter(v);
    }

    private portPosY(v: number): number {
        return this.portCenter(v);
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

        let x1 = this.portPosX(portFrom.offsetLeft + fromNode.x);
        let y1 = this.portPosY(portFrom.offsetTop + fromNode.y);
        let x2 = this.portPosX(portTo.offsetLeft + toNode.x);
        let y2 = this.portPosY(portTo.offsetTop + toNode.y);

        const id = "p_" + connectionId;
        let path = this.svg.select("#" + id);
        if (path.empty()) {
            path = this.svg.append("path").attr("id", id);
        }

        const theRenderer = this;
        path.attr("class", "connection")
            .on("mouseover", function (d) {
                d3.select(this).attr("class", "connection connection--hovered");
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("class", "connection");
            })
            .on("click", function (d) {
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

    getDiagramPos(viewX: any, viewY: any): Position {
        const diagramCanvasRect = this.htmlCanvas.getBoundingClientRect();
        const diagramX = viewX - diagramCanvasRect.x;
        const diagramY = viewY - diagramCanvasRect.y;
        return {x: diagramX / this.scale, y: diagramY / this.scale} as Position;
    }

    registerEventHandler(eventType: EventType, callback: EventCallback): string {
        return this.viewEvents.registerEventHandler(eventType, callback);
    }

    public removeEventHandler(id: string) {
        return this.viewEvents.removeEventHandler(id);
    }
}
