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

export class State implements Activateable {
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

export abstract class Transition implements Activateable {
    originState: State;
    targetState: State;
    private name: string;

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
