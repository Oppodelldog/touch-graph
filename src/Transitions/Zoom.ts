import {State, Transition} from "../State/State";


interface ControllerInterface {
    getCanvasElement()

    getScale()

    setScale(v: number)
}

export class Zooming extends State {
    private controller: ControllerInterface;
    public currentScale: number;
    public targetScale: any;

    constructor(name: string, controller: ControllerInterface) {
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
    private controller: ControllerInterface;
    private readonly wheelFunc: Function;

    constructor(name: string, controller: ControllerInterface) {
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
        this.controller.getCanvasElement().addEventListener("wheel", this.wheelFunc);
    }

    deactivate() {
        this.controller.getCanvasElement().removeEventListener("wheel", this.wheelFunc);
    }
}

export class ZoomFinished extends Transition {
    constructor(name: string) {
        super(name);
    }

    activate() {
        this.switchState();
    }

    deactivate() {
    }
}
