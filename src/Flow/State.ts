import {Controller} from "../Controller";
import {EventCallback, EventType} from "../ViewEvents";

export interface Activateable {
    activate()

    deactivate()
}

export class Context {
    state: State;
    debug: boolean = true;

    public switchState(s: State) {
        if (this.debug) {
            console.log("switch state from", this.state.name, "to", s.name);
        }
        this.state.deactivate();
        this.state = s;
        this.state.activate();
    }
}

class AbstractState implements Activateable {
    context: Context;
    transitions: Transition[];
    public name: string;

    constructor(name: string) {
        this.name = name;
        this.transitions = [] as Transition[];
    }

    public activate() {
        this.transitions.forEach((transition) => transition.activate())
    }

    public deactivate() {
        this.transitions.forEach((transition) => transition.deactivate())
    }

    public switchState(s: State) {
        this.context.switchState(s)
    }
}

abstract class AbstractTransition implements Activateable {
    originState: State;
    targetState: State;
    name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    public switchState() {
        this.originState.switchState(this.targetState)
    }

    public activate() {
    }

    public deactivate() {
    }
}


export class State extends AbstractState {
    protected controller: Controller;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    protected registerEventHandler(eventType: EventType, eventCallback: EventCallback) {
        this.eventHandlerId = this.controller.registerEventHandler(eventType, eventCallback)
    }

    deactivate() {
        super.deactivate();

        if (this.eventHandlerId !== "" && this.eventHandlerId !== undefined) {
            this.controller.removeEventHandler(this.eventHandlerId);
        }
    }
}

export class Transition extends AbstractTransition {
    protected controller: Controller;
    private eventHandlerId: string;

    constructor(name: string, controller: Controller) {
        super(name);
        this.controller = controller;
    }

    protected registerEventHandler(eventType: EventType, eventCallback: EventCallback) {
        this.eventHandlerId = this.controller.registerEventHandler(eventType, eventCallback)
    }

    deactivate() {
        super.deactivate();

        if (this.eventHandlerId !== "" && this.eventHandlerId !== undefined) {
            this.controller.removeEventHandler(this.eventHandlerId);
        }
    }
}
