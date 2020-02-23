import {State, Transition} from "../State/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class DeletingNodes extends State {
}

export class DeleteNodes extends Transition {
    private controller: Controller;
    private readonly keyUpFunc: EventCallback;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
        this.keyUpFunc = this.onKeyUp.bind(this)
    }

    private onKeyUp(event) {
        if (event.key == "Delete") {
            this.controller.deleteSelectedNodes()
        }
    }

    public activate() {
        this.eventHandlerId = this.controller.registerEventHandler(EventType.KeyUp, this.keyUpFunc)
    }

    public deactivate() {
        this.controller.removeEventHandler(this.eventHandlerId);
    }
}

export class NodesDeleted extends Transition {
    constructor(name: string) {
        super(name);
    }

    public activate() {
        this.switchState();
    }
}


