import { Controller } from "../Controller";
import { EventCallback, EventType } from "../ViewEvents";
export interface Activateable {
    activate(): any;
    deactivate(): any;
}
export declare class Context {
    state: State;
    debug: boolean;
    switchState(s: State): void;
}
declare class AbstractState implements Activateable {
    context: Context;
    transitions: Transition[];
    name: string;
    constructor(name: string);
    activate(): void;
    deactivate(): void;
    switchState(s: State): void;
}
declare abstract class AbstractTransition implements Activateable {
    originState: State;
    targetState: State;
    name: string;
    protected constructor(name: string);
    switchState(): void;
    activate(): void;
    deactivate(): void;
}
export declare class State extends AbstractState {
    protected controller: Controller;
    private eventHandlerId;
    constructor(name: string, controller: Controller);
    protected registerEventHandler(eventType: EventType, eventCallback: EventCallback): void;
    deactivate(): void;
}
export declare class Transition extends AbstractTransition {
    protected controller: Controller;
    private eventHandlerId;
    constructor(name: string, controller: Controller);
    protected registerEventHandler(eventType: EventType, eventCallback: EventCallback): void;
    deactivate(): void;
}
export {};
