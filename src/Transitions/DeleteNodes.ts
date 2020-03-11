import {State, Transition} from "../Flow/State";
import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export class DeletingNodes extends State {
}

export class DeleteNodes extends Transition {
    private readonly keyUpFunc: EventCallback;

    constructor(name: string, controller: Controller) {
        super(name,controller);
        this.keyUpFunc = this.onKeyUp.bind(this)
    }

    private onKeyUp(event) {
        if (event.key == "Delete") {
            this.controller.deleteSelectedNodes()
        }
    }

    public activate() {
        super.activate();
        this.registerEventHandler(EventType.KeyUp, this.keyUpFunc)
    }
}

export class NodesDeleted extends Transition {
    public activate() {
        this.switchState();
    }
}


