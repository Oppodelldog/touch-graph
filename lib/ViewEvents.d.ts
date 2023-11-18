import { Renderer } from "./Renderer";
export declare enum EventType {
    TouchStart = 0,
    TouchMove = 1,
    TouchEnd = 2,
    Click = 3,
    DoubleClick = 4,
    Wheel = 5,
    KeyDown = 6,
    KeyUp = 7
}
export type EventCallback = (event: any, mousePos: any, diagramPos: any) => void;
export declare class ViewEvents {
    private eventCallbacks;
    private readonly canvas;
    private renderer;
    constructor(canvas: HTMLElement, renderer: Renderer);
    private static getTouchEndEventTouch;
    private getTouchInputPos;
    private wrapCallback;
    private getEventNameByType;
    registerEventHandler(eventType: EventType, callback: EventCallback): string;
    private getEventTarget;
    removeEventHandler(id: string): void;
    isTouchDevice(): boolean;
}
