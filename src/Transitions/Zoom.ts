import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class Zooming extends State {
    private controller: Controller;
    public currentScale: number;
    public targetScale: any;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    activate() {
        this.controller.setScale(this.targetScale);
        super.activate();
    }

    deactivate() {
        super.deactivate();
    }
}

export class UseMousewheel extends Transition {
    private controller: Controller;
    private readonly wheelFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.wheelFunc = this.wheel.bind(this)
    }

    wheel(event) {
        let factor = (event.deltaY) > 0 ? 1 : -1;
        let currentScale = this.controller.getScale();
        let newScale = currentScale + (0.1 * factor);
        if (newScale < 0.1) {
            newScale = 0.1;
        }
        const targetState = this.targetState as Zooming;
        targetState.currentScale = currentScale;
        targetState.targetScale = newScale;
        this.switchState();
        event.preventDefault();
    };

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.Wheel, this.wheelFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class ZoomFinished extends Transition {
    private controller: Controller;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    activate() {
        this.switchState();
    }

    deactivate() {
    }
}
