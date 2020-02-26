import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {Position} from "../data/Position"
import {EventCallback, EventType} from "../ViewEvents";

export class SelectingNodes extends State {
}

export class SelectNode extends Transition {
    private controller: Controller;
    private readonly clickFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.clickFunc = this.onClick.bind(this)
    }

    onClick(event, touchInput: Position) {
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        this.controller.selectNode(nodeId);
        this.switchState();
        event.preventDefault();
    }

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.Click, this.clickFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class SelectOneMoreNode extends Transition {
    private controller: Controller;
    private readonly clickFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.clickFunc = this.onClick.bind(this)
    }

    onClick(event, touchInput: Position) {
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (!this.controller.isNodeSelected(nodeId)) {
            this.controller.selectNode(nodeId);
            this.switchState();
            event.preventDefault();
        }
    }

    activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.Click, this.clickFunc);
    }

    deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class DeSelectNode extends Transition {
    private controller: Controller;
    private readonly clickFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.clickFunc = this.onClick.bind(this)
    }

    private onClick(event, touchInput: Position) {
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (this.controller.isNodeSelected(nodeId)) {
            this.controller.deselectNode(nodeId);
            this.switchState();
            event.preventDefault();
        }
    }

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.Click, this.clickFunc)
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class SingleSelectionReturn extends Transition {
    private controller: Controller;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    public activate() {
        this.controller.removeSelectedNodeKeepLatest();
        this.switchState();
    }
}

export class TurnOnMultiNodeSelectionMode extends Transition {
    private controller: Controller;
    private readonly keyDownFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.keyDownFunc = this.onKeyDownFunc.bind(this)
    }

    private onKeyDownFunc(event) {
        if (event.key === "Control") {
            this.switchState();
        }
    }

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.KeyDown, this.keyDownFunc)
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class TurnOffMultiNodeSelectionMode extends Transition {
    private controller: Controller;
    private readonly keyUpFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.keyUpFunc = this.onKeyUpFunc.bind(this)
    }

    private onKeyUpFunc(event) {
        if (event.key === "Control") {
            this.switchState();
        }
    }

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.KeyUp, this.keyUpFunc)
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}
