import { Context, State, Transition } from "./State";
export declare type createStateCallback = (name: String) => State;
export declare type createTransitionCallback = (name: String) => Transition;
export declare class Builder {
    build(createState: createStateCallback, createTransition: createTransitionCallback): Context;
}
