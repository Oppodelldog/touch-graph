"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.load = function () {
        var _this = this;
        var configItems = [];
        var configString = "\ndigraph {\n    \"Idle\"         -> \"Touched\"      [ label = \"Touch Start\" ]\n    \"Touched\"      -> \"Move Diagram\" [ label = \"Touch Move on Diagram\" ]\n    \"Touched\"      -> \"Move Node\"    [ label = \"Touch Move on Node\" ]\n    \"Touched\"      -> \"Move Port\"    [ label = \"Touch Move on Port\" ]\n    \"Touched\"      -> \"Pinch Zoom\"   [ label = \"Double Touch Move\" ]\n    \"Touched\"      -> \"Idle\"         [ label = \"Touch End\" ]\n    \"Move Diagram\" -> \"Pinch Zoom\"   [ label = \"Double Touch Move\" ]\n    \"Move Diagram\" -> \"Idle\"         [ label = \"Release Diagram\" ]\n    \"Move Node\"    -> \"Pinch Zoom\"   [ label = \"Double Touch Move\" ]\n    \"Move Node\"    -> \"Idle\"         [ label = \"Release Node\" ]\n    \"Move Port\"    -> \"Pinch Zoom\"   [ label = \"Double Touch Move\" ]\n    \"Move Port\"    -> \"Idle\"         [ label = \"Release Port\" ]\n    \"Pinch Zoom\"   -> \"Touched\"      [ label = \"Touch End\" ]\n\n    \"Idle\" -> \"Mouse Zooming\" [ label = \"Use Mousewheel\" ]\n    \"Mouse Zooming\" -> \"Idle\" [ label = \"Zoom finished\" ]\n\n    \"Idle\" -> \"Adjusting Focus\" [ label = \"Double Click\" ]\n    \"Adjusting Focus\" -> \"Idle\" [ label = \"Focus adjustment finished\" ]\n\n    \"Idle\" -> \"Selecting Nodes\" [ label = \"Select Node\" ]\n    \"Selecting Nodes\" -> \"Idle\" [ label = \"Single Selection Return\" ]\n\n    \"Idle\" -> \"Selecting multiple Nodes\" [ label = \"Turn on multi selection\" ]\n    \"Selecting multiple Nodes\" -> \"Selecting multiple Nodes\" [ label = \"Select one more Node\" ]\n    \"Selecting multiple Nodes\" -> \"Selecting multiple Nodes\" [ label = \"Deselect one Node\" ]\n    \"Selecting multiple Nodes\" -> \"Idle\" [ label = \"Turn off multi selection\" ]\n\n    \"Idle\" -> \"Deleting Selected Nodes\" [ label = \"Delete Nodes\" ]\n    \"Deleting Selected Nodes\" -> \"Idle\" [ label = \"Nodes Deleted\" ]\n}\n        ";
        var regex = /(?<FromState>"*[a-zA-Z ]*"*)\s*->\s*(?<ToState>"*[a-zA-Z ]*"*)\s*\[\s*label\s*=\s*(?<Transition>"*[a-zA-Z ]*"*)\s*]/gm;
        var m;
        configString.split('\n').forEach(function (line) {
            var item = _this.extractConfigItem(m, regex, line);
            if (item.StateFrom !== "" && item.StateTo !== "" && item.Transition !== "") {
                configItems.push(item);
            }
        });
        return configItems;
    };
    Config.prototype.extractConfigItem = function (m, regex, line) {
        var item = { StateFrom: "", StateTo: "", Transition: "" };
        while ((m = regex.exec(line)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach(function (match, groupIndex) {
                var value = match.replace(/"/g, "");
                switch (groupIndex) {
                    case 1:
                        item.StateFrom = value;
                        break;
                    case 2:
                        item.StateTo = value;
                        break;
                    case 3:
                        item.Transition = value;
                        break;
                }
            });
        }
        return item;
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=Config.js.map