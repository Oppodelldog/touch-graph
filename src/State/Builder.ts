import {Context, State, Transition} from "./State";
import {Config} from "./Config";

const IdleStateName = "Idle";

export type createStateCallback = (name: String) => State;
export type createTransitionCallback = (name: String) => Transition;

export class Builder {
    build(createState: createStateCallback, createTransition: createTransitionCallback): Context {
        let context = new Context();
        let config = new Config();
        let configItems = config.load();
        let idle: State;
        let tmpStates = [] as State[];
        let tmpTransitions = [] as Transition[];
        configItems.forEach((configItem) => {
            let from: State;
            let to: State;
            let transition: Transition;
            if (tmpStates[configItem.StateFrom] !== undefined) {
                from = tmpStates[configItem.StateFrom];
            } else {
                from = createState(configItem.StateFrom);
                from.context = context;
                tmpStates[configItem.StateFrom] = from;
            }
            if (tmpStates[configItem.StateTo] !== undefined) {
                to = tmpStates[configItem.StateTo];
            } else {
                to = createState(configItem.StateTo);
                to.context = context;
                tmpStates[configItem.StateTo] = to;
            }
            if (tmpTransitions[configItem.Transition] !== undefined) {
                transition = tmpTransitions[configItem.Transition];
            } else {
                transition = createTransition(configItem.Transition);
                tmpTransitions[configItem.Transition] = transition;
            }
            transition.targetState = to;
            from.transitions.push(transition);
            transition.state = from;

            if (configItem.StateFrom === IdleStateName) {
                idle = from;
            }
        });

        context.state = idle;
        context.state.activate();

        return context;
    }
}
