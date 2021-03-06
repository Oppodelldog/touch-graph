import { Context } from "./State";
import { Config } from "./Config";
var IdleStateName = "Idle";
var Builder = /** @class */ (function () {
    function Builder() {
    }
    Builder.prototype.build = function (createState, createTransition) {
        var context = new Context();
        var config = new Config();
        var configItems = config.load();
        var idle = undefined;
        var tmpStates = [];
        //let tmpTransitions = [] as Transition[];
        configItems.forEach(function (configItem) {
            var from;
            var to;
            var transition;
            if (tmpStates[configItem.StateFrom] !== undefined) {
                from = tmpStates[configItem.StateFrom];
            }
            else {
                from = createState(configItem.StateFrom);
                from.context = context;
                tmpStates[configItem.StateFrom] = from;
            }
            if (tmpStates[configItem.StateTo] !== undefined) {
                to = tmpStates[configItem.StateTo];
            }
            else {
                to = createState(configItem.StateTo);
                to.context = context;
                tmpStates[configItem.StateTo] = to;
            }
            /*if (tmpTransitions[configItem.Transition] !== undefined) {
                transition = tmpTransitions[configItem.Transition];
            } else {

             */
            transition = createTransition(configItem.Transition);
            //  tmpTransitions[configItem.Transition] = transition;
            //}
            transition.targetState = to;
            from.transitions.push(transition);
            transition.originState = from;
            if (configItem.StateFrom === IdleStateName) {
                idle = from;
            }
        });
        if (idle === undefined) {
            throw new Error("Idle state must be defined");
        }
        context.state = idle;
        context.state.activate();
        return context;
    };
    return Builder;
}());
export { Builder };
//# sourceMappingURL=Builder.js.map