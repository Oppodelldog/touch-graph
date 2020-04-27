"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UUID = /** @class */ (function () {
    function UUID() {
    }
    UUID.NewId = function () {
        // noinspection SpellCheckingInspection
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return UUID;
}());
exports.default = UUID;
//# sourceMappingURL=UUID.js.map