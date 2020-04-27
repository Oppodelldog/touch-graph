"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Builder_1 = require("./Flow/Builder");
var Idle_1 = require("./AppFlow/Idle");
var Zoom_1 = require("./AppFlow/Zoom");
var FocusElement_1 = require("./AppFlow/FocusElement");
var SelectNode_1 = require("./AppFlow/SelectNode");
var DeleteNodes_1 = require("./AppFlow/DeleteNodes");
var Touch_1 = require("./AppFlow/Touch");
var AppFlow = /** @class */ (function () {
    function AppFlow() {
    }
    AppFlow.init = function (controller) {
        new Builder_1.Builder().build(function (name) {
            switch (name) {
                case 'Idle':
                    return new Idle_1.Idle(name, controller);
                case 'Touched':
                    return new Touch_1.Touched(name, controller);
                case 'Move Diagram':
                    return new Touch_1.MoveDiagram(name, controller);
                case 'Move Node':
                    return new Touch_1.MoveNode(name, controller);
                case 'Move Port':
                    return new Touch_1.MovePort(name, controller);
                case 'Pinch Zoom':
                    return new Touch_1.PinchZoom(name, controller);
                case 'Mouse Zooming':
                    return new Zoom_1.MouseZooming(name, controller);
                case 'Adjusting Focus':
                    return new FocusElement_1.AdjustingFocus(name, controller);
                case 'Selecting Nodes':
                    return new SelectNode_1.SelectingNodes(name, controller);
                case 'Selecting multiple Nodes':
                    return new SelectNode_1.SelectingNodes(name, controller);
                case 'Deleting Selected Nodes':
                    return new DeleteNodes_1.DeletingNodes(name, controller);
                default:
                    throw new Error("undefined State: " + name);
            }
        }, function (name) {
            switch (name) {
                case 'Touch Start':
                    return new Touch_1.TouchStart(name, controller);
                case 'Touch Move on Diagram':
                    return new Touch_1.TouchMoveOnDiagram(name, controller);
                case 'Touch Move on Node':
                    return new Touch_1.TouchMoveOnNode(name, controller);
                case 'Touch Move on Port':
                    return new Touch_1.TouchMoveOnPort(name, controller);
                case 'Double Touch Move':
                    return new Touch_1.DoubleTouchMove(name, controller);
                case 'Touch End':
                    return new Touch_1.TouchEnd(name, controller);
                case 'Release Node':
                    return new Touch_1.ReleaseNode(name, controller);
                case 'Release Port':
                    return new Touch_1.ReleasePort(name, controller);
                case 'Release Diagram':
                    return new Touch_1.ReleaseDiagram(name, controller);
                case 'Use Mousewheel':
                    return new Zoom_1.UseMousewheel(name, controller);
                case 'Zoom finished':
                    return new Zoom_1.ZoomFinished(name, controller);
                case 'Double Click':
                    return new FocusElement_1.DoubleClick(name, controller);
                case 'Focus adjustment finished':
                    return new FocusElement_1.FocusAdjustmentFinished(name, controller);
                case 'Select Node':
                    return new SelectNode_1.SelectNode(name, controller);
                case 'Single Selection Return':
                    return new SelectNode_1.SingleSelectionReturn(name, controller);
                case 'Select one more Node':
                    return new SelectNode_1.SelectOneMoreNode(name, controller);
                case 'Deselect one Node':
                    return new SelectNode_1.DeSelectNode(name, controller);
                case 'Turn on multi selection':
                    return new SelectNode_1.TurnOnMultiNodeSelectionMode(name, controller);
                case 'Turn off multi selection':
                    return new SelectNode_1.TurnOffMultiNodeSelectionMode(name, controller);
                case 'Delete Nodes':
                    return new DeleteNodes_1.DeleteNodes(name, controller);
                case 'Nodes Deleted':
                    return new DeleteNodes_1.NodesDeleted(name, controller);
                default:
                    throw new Error("undefined Transition: " + name);
            }
        });
    };
    return AppFlow;
}());
exports.AppFlow = AppFlow;
//# sourceMappingURL=AppFlow.js.map