import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {Position} from "../data/Position"
import {EventCallback, EventType} from "../ViewEvents";

export class SelectingNodes extends State {
}

export class SelectNode extends Transition {
    private readonly clickFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.clickFunc = this.onClick.bind(this)
    }

    onClick(event, touchInput: Position) {
        // TODO: View logic from controller
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        this.controller.selectNode(nodeId);
        this.switchState();
        event.preventDefault();
    }

    activate() {
        super.activate();
        this.registerEventHandler(EventType.Click, this.clickFunc);
    }
}

export class SelectOneMoreNode extends Transition {
    private readonly clickFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.clickFunc = this.onClick.bind(this)
    }

    onClick(event, touchInput: Position) {
        console.log("SelectOneMoreNode")
        // TODO: View logic from controller
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (!this.controller.isNodeSelected(nodeId)) {
            this.controller.selectNode(nodeId);
            this.switchState();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    activate() {
        super.activate();
        this.registerEventHandler(EventType.Click, this.clickFunc);
    }
}

export class DeSelectNode extends Transition {
    private readonly clickFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.controller = controller;
        this.clickFunc = this.onClick.bind(this)
    }

    private onClick(event, touchInput: Position) {
        console.log("DeSelectNode")
        // TODO: View logic from controller
        let nodeId = this.controller.getHoveredNodeId(touchInput.x, touchInput.y);
        if (nodeId === "") {
            return;
        }
        if (this.controller.isNodeSelected(nodeId)) {
            this.controller.deselectNode(nodeId);
            this.switchState();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    public activate() {
        super.activate();
        this.controller.registerEventHandler(EventType.Click, this.clickFunc)
    }
}

export class SingleSelectionReturn extends Transition {
    constructor(name: string, controller: Controller) {
        super(name,controller);
    }

    public activate() {
        super.activate();
        this.controller.removeSelectedNodeKeepLatest();
        this.switchState();
    }
}

export class TurnOnMultiNodeSelectionMode extends Transition {
    private readonly keyDownFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.keyDownFunc = this.onKeyDownFunc.bind(this)
    }

    private onKeyDownFunc(event) {
        if (event.key === "Control") {
            this.switchState();
        }
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.KeyDown, this.keyDownFunc)
    }
}

export class TurnOffMultiNodeSelectionMode extends Transition {
    private readonly keyUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.keyUpFunc = this.onKeyUpFunc.bind(this)
    }

    private onKeyUpFunc(event) {
        if (event.key === "Control") {
            this.switchState();
        }
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.KeyUp, this.keyUpFunc)
    }
}
