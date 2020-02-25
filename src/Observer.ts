export class Observer<T> {
    protected handlers: Array<(T) => void>;

    constructor() {
        this.handlers = new Array<(T) => void>();
    }

    public subscribe(f: (T) => void) {
        this.handlers.push(f)
    }

    public unsubscribe(f: (T) => void) {
        const index = this.handlers.indexOf(f);
        if (index >= 0) {
            this.handlers.splice(index, 1);
        }
    }

    public notify(t: T) {
        this.handlers.forEach((f) => f(t))
    }
}
