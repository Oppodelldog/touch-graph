import { Context, State, Transition } from "./State";
export type createStateCallback = (name: String) => State;
export type createTransitionCallback = (name: String) => Transition;
export declare class Builder {
    build(createState: createStateCallback, createTransition: createTransitionCallback): Context;
}
