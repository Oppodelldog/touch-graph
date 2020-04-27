export declare class Observer<T> {
    protected handlers: Array<(T: any) => void>;
    constructor();
    subscribe(f: (T: any) => void): void;
    unsubscribe(f: (T: any) => void): void;
    notify(t: T): void;
}
