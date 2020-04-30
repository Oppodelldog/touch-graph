import Node from "./data/Node";
import { Position } from "./data/Position";
import { EventCallback, EventType } from "./ViewEvents";
import { ConnectionUpdate, ObservableController } from "./Controller";
export interface RenderInterface {
    renderNode(node: any): void;
    removeConnection(connectionId: string): void;
    removeNode(nodeId: string): void;
    updateNodePos(node: Node): void;
    updateNodeSelection(nodeId: string, selected: boolean): void;
    updateLine(update: ConnectionUpdate): void;
    centerAtPosition(x?: number, y?: number): void;
    setScale(scale: number): void;
    updateGrabLine(x1: number, y1: number, x2: number, y2: number): void;
    removeGrabLine(): void;
}
export interface ViewInterface {
    getHoveredNodeId(x: number, y: number): string;
    getHoveredPortId(x: number, y: number): string;
    isCanvasHovered(x: number, y: number): boolean;
    registerEventHandler(eventType: EventType, callback: EventCallback): any;
    removeEventHandler(id: string): any;
    onClickLine(f: (connectionId: any) => void): void;
    getOffsetForCenteredPosition(x: any, y: any, xOffset: number, yOffset: number): {
        x: number;
        y: number;
    };
}
export declare class Renderer implements RenderInterface, ViewInterface {
    private readonly canvas;
    private readonly backgroundCanvas;
    private readonly svgCanvas;
    private readonly htmlCanvas;
    private readonly nodeElements;
    private readonly canvasLayers;
    private readonly svg;
    private readonly canvasLayersTransforms;
    private readonly viewEvents;
    private portRadius;
    private scale;
    private canvasX;
    private canvasY;
    private _onClickLine;
    constructor();
    bind(controller: ObservableController): void;
    private getCanvasRect;
    onClickLine(f: (connectionId: any) => void): void;
    private static addDivElement;
    renderNode(node: any): void;
    private createNodePorts;
    private applyLayerTransforms;
    setScale(scale: number): void;
    private alignPositionForCenteredScaling;
    private getCenterScreenDiagramPos;
    private static getScreenCenterPos;
    private portPos;
    updateNodePos(node: Node): void;
    getOffsetForCenteredPosition(x: any, y: any, xOffset: number, yOffset: number): {
        x: number;
        y: number;
    };
    getHoveredNodeId(x: number, y: number): string;
    getHoveredPortId(x: number, y: number): string;
    isCanvasHovered(x: number, y: number): boolean;
    updateLine(update: ConnectionUpdate): void;
    updateGrabLine(x1: number, y1: number, x2: number, y2: number): void;
    removeGrabLine(): void;
    getDiagramPosFromScreenCoordinates(viewX: any, viewY: any): Position;
    centerAtPosition(canvasX: number, canvasY: number): void;
    private dragCanvas;
    registerEventHandler(eventType: EventType, callback: EventCallback): string;
    removeEventHandler(id: string): void;
    updateNodeSelection(nodeId: string, selected: boolean): void;
    removeNode(nodeId: string): void;
    removeConnection(connectionId: string): void;
    private static getConnectionElementId;
    getBoundingClientRect(): DOMRect;
    private setCanvasPosition;
}
