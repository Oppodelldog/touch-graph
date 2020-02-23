import {Position} from "./data/Position";
import UUID from "./UUID";
import {Renderer} from "./Renderer";

export enum EventType {
    TouchStart,
    TouchMove,
    TouchEnd,
    DoubleClick,
    Wheel,
}

interface EventCallbackRegistration {
    Callback: EventCallback
    EventName: string
}

export type EventCallback = (event, mousePos, diagramPos) => void

type EventNamesByType = {
    [key in EventType]: string;
};

export class ViewEvents{
    private eventCallbacks: EventCallbackRegistration[] = [] as EventCallbackRegistration[];
    private canvas:HTMLDivElement;
    private renderer:Renderer;

    constructor(canvas:HTMLDivElement,renderer:Renderer) {
        this.canvas = canvas;
        this.renderer = renderer;
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

    private getTouchInputPos(event): Position {
        if (this.isTouchDevice()) {
            let touch = ViewEvents.getTouchEndEventTouch(event);
            return {x: touch.clientX, y: touch.clientY} as Position
        }

        return {x: event.clientX, y: event.clientY} as Position
    }

    private wrapCallback(eventType: EventType, callback: EventCallback): (event) => void {
        switch (eventType) {
            case EventType.TouchStart:
            case EventType.TouchMove:
            case EventType.TouchEnd:
            case EventType.DoubleClick:
            case EventType.Wheel:
                return (event) => {
                    const touchInputPos = this.getTouchInputPos(event);
                    const diagramInputPos = this.renderer.getDiagramPos(touchInputPos.x, touchInputPos.y);
                    callback(event, touchInputPos, diagramInputPos)
                }
        }
    }

    private getEventNameByType(eventType: EventType): string {
        let desktop = {
            [EventType.TouchStart]: "mousedown",
            [EventType.TouchMove]: "mousemove",
            [EventType.TouchEnd]: "mouseup",
            [EventType.Wheel]: "wheel",
            [EventType.DoubleClick]: "dblclick",
        } as EventNamesByType;

        let touch = {
            [EventType.TouchStart]: "touchstart",
            [EventType.TouchMove]: "touchmove",
            [EventType.TouchEnd]: "touchend",
            [EventType.Wheel]: "",
            [EventType.DoubleClick]: "",
        } as EventNamesByType;

        return this.isTouchDevice() ? touch[eventType] : desktop[eventType];
    }

    public registerEventHandler(eventType: EventType, callback: EventCallback): string {
        const id = UUID.NewId();
        let eventName = this.getEventNameByType(eventType);
        let wrappedCallback = this.wrapCallback(eventType, callback).bind(this);
        this.eventCallbacks[id] = {
            EventName: eventName,
            Callback: wrappedCallback
        } as EventCallbackRegistration;

        this.canvas.addEventListener(eventName, wrappedCallback);

        return id
    }

    public removeEventHandler(id: string) {
        let eventName = this.eventCallbacks[id].EventName;
        let callback = this.eventCallbacks[id].Callback;
        this.canvas.removeEventListener(eventName, callback);
        delete this.eventCallbacks[id];
    }

    public isTouchDevice(): boolean {
        return !!('ontouchstart' in window || navigator.msMaxTouchPoints);
    }
}
