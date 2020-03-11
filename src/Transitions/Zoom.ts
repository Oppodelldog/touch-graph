import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class Zooming extends State {
    public currentScale: number;
    public targetScale: any;

    constructor(name: string, controller: Controller) {
        super(name, controller);
    }

    public activate() {
        this.controller.setScale(this.targetScale);
        super.activate();
    }
}

export class UseMousewheel extends Transition {
    private readonly wheelFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name, controller);
        this.wheelFunc = this.wheel.bind(this)
    }

    private wheel(event) {
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

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.Wheel, this.wheelFunc);
    }
}

export class ZoomFinished extends Transition {
    public activate() {
        this.switchState();
    }
}
