var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { State } from "../Flow/State";
var Idle = /** @class */ (function (_super) {
    __extends(Idle, _super);
    function Idle(name, controller) {
        return _super.call(this, name, controller) || this;
    }
    return Idle;
}(State));
export { Idle };
//# sourceMappingURL=Idle.js.map