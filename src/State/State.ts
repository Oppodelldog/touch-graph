export interface Activateable {
    activate()

    deactivate()
}

export class Context {
    state: State;

    switchState(s: State) {
        console.log("switch state from", this.state.name, "to", s.name);
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

    activate() {
        this.transitions.forEach((transition) => transition.activate())
    }

    deactivate() {
        this.transitions.forEach((transition) => transition.deactivate())
    }

    switchState(s: State) {
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

    switchState() {
        this.originState.switchState(this.targetState)
    }

    activate() {
    }

    deactivate() {
    }
}
