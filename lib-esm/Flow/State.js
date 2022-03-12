var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Context = /** @class */ (function () {
    function Context() {
        this.debug = true;
    }
    Context.prototype.switchState = function (s) {
        if (this.debug) {
            console.log("Switch State:", this.state.name, " >> ", s.name);
        }
        this.state.deactivate();
        this.state = s;
        this.state.activate();
    };
    return Context;
}());
export { Context };
var AbstractState = /** @class */ (function () {
    function AbstractState(name) {
        this.name = name;
        this.transitions = [];
    }
    AbstractState.prototype.activate = function () {
        this.transitions.forEach(function (transition) { return transition.activate(); });
    };
    AbstractState.prototype.deactivate = function () {
        this.transitions.forEach(function (transition) { return transition.deactivate(); });
    };
    AbstractState.prototype.switchState = function (s) {
        this.context.switchState(s);
    };
    return AbstractState;
}());
var AbstractTransition = /** @class */ (function () {
    function AbstractTransition(name) {
        this.name = name;
    }
    AbstractTransition.prototype.switchState = function () {
        console.log("Transition:", this.constructor.name);
        this.originState.switchState(this.targetState);
    };
    AbstractTransition.prototype.activate = function () {
    };
    AbstractTransition.prototype.deactivate = function () {
    };
    return AbstractTransition;
}());
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State(name, controller) {
        var _this = _super.call(this, name) || this;
        _this.controller = controller;
        return _this;
    }
    State.prototype.registerEventHandler = function (eventType, eventCallback) {
        this.eventHandlerId = this.controller.registerEventHandler(eventType, eventCallback);
    };
    State.prototype.deactivate = function () {
        _super.prototype.deactivate.call(this);
        if (this.eventHandlerId !== "" && this.eventHandlerId !== undefined) {
            this.controller.removeEventHandler(this.eventHandlerId);
        }
    };
    return State;
}(AbstractState));
export { State };
var Transition = /** @class */ (function (_super) {
    __extends(Transition, _super);
    function Transition(name, controller) {
        var _this = _super.call(this, name) || this;
        _this.controller = controller;
        return _this;
    }
    Transition.prototype.registerEventHandler = function (eventType, eventCallback) {
        this.eventHandlerId = this.controller.registerEventHandler(eventType, eventCallback);
    };
    Transition.prototype.deactivate = function () {
        _super.prototype.deactivate.call(this);
        if (this.eventHandlerId !== "" && this.eventHandlerId !== undefined) {
            this.controller.removeEventHandler(this.eventHandlerId);
        }
    };
    return Transition;
}(AbstractTransition));
export { Transition };
//# sourceMappingURL=State.js.map