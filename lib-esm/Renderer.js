import * as d3 from "d3";
import { ViewEvents } from "./ViewEvents";
var canvasElementId = "touch-graph";
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.nodeElements = [];
        this.canvasLayers = [];
        this.portRadius = 7;
        this.scale = 1;
        this.canvasX = 0;
        this.canvasY = 0;
        this._onClickLine = function () { return void {}; };
        this.canvas = document.getElementById(canvasElementId);
        if (this.canvas == null) {
            throw new Error("need a div tag with id='" + canvasElementId + "'");
        }
        this.backgroundCanvas = Renderer.addDivElement("background-canvas", "div", this.canvas);
        this.htmlCanvas = Renderer.addDivElement("html-canvas", "div", this.canvas);
        this.svg = d3.select(this.canvas).append('svg');
        this.svg.attr("id", "svg-canvas");
        this.svgCanvas = document.getElementById("svg-canvas");
        this.canvasLayers = [this.backgroundCanvas, this.svgCanvas, this.htmlCanvas];
        this.canvasLayersTransforms = { translate: "translate(0,0)", scale: "scale(1)" };
        this.viewEvents = new ViewEvents(this.canvas, this);
    }
    Renderer.prototype.bind = function (controller) {
        var _this = this;
        controller.onNewNode.subscribe(this.renderNode.bind(this));
        controller.onMoveNode.subscribe(function (node) { return _this.updateNodePos(node); });
        controller.onRemoveNode.subscribe(function (node) { return _this.removeNode(node.id); });
        controller.onNewConnection.subscribe(function (update) { return _this.updateLine(update); });
        controller.onUpdateConnection.subscribe(function (update) { return _this.updateLine(update); });
        controller.onRemoveConnection.subscribe(function (c) { return _this.removeConnection(c.id); });
        controller.onScaleChanged.subscribe(function (scale) { return _this.setScale(scale); });
        controller.onDragConnectionLine.subscribe(function (line) { return _this.updateGrabLine(line.x1, line.y1, line.x2, line.y2); });
        controller.onRemoveConnectionLine.subscribe(function () { return _this.removeGrabLine(); });
        controller.onCenterCanvas.subscribe(function (pos) { return _this.centerAtPosition(pos.x, pos.y); });
        controller.onDragCanvas.subscribe(function (pos) { return _this.dragCanvas(pos.x, pos.y); });
        controller.onNodeSelectionChanged.subscribe(function (change) { return _this.updateNodeSelection(change.node.id, change.selected); });
        controller.onSetNodeCaption.subscribe(function (node) { return _this.updateNodeCaption(node); });
        controller.onSetPortName.subscribe(function (change) { return _this.updatePortName(change.node, change.port); });
    };
    Renderer.prototype.getCanvasRect = function () {
        return this.canvas.getBoundingClientRect();
    };
    Renderer.prototype.onClickLine = function (f) {
        this._onClickLine = f;
    };
    Renderer.addDivElement = function (id, type, canvasElement) {
        var el = document.createElement(type);
        el.id = id;
        canvasElement.appendChild(el);
        return el;
    };
    Renderer.prototype.renderNode = function (node) {
        var div = document.getElementById(node.id);
        if (div) {
            div.parentNode.removeChild(div);
        }
        div = document.createElement("div");
        div.className = "node " + node.customClass;
        div.id = node.id;
        var title = document.createElement("div");
        title.className = "title";
        title.innerHTML = node.caption;
        div.appendChild(title);
        var body = document.createElement("div");
        body.className = "body";
        div.appendChild(body);
        var portInContainer = document.createElement("div");
        portInContainer.className = "ports-in";
        this.createNodePorts(node.portsIn).forEach(function (e) { return portInContainer.appendChild(e); });
        body.appendChild(portInContainer);
        var portOutContainer = document.createElement("div");
        portOutContainer.className = "ports-out";
        this.createNodePorts(node.portsOut).forEach(function (e) { return portOutContainer.appendChild(e); });
        body.appendChild(portOutContainer);
        this.nodeElements.push(div);
        this.htmlCanvas.appendChild(div);
        this.updateNodePos(node);
    };
    Renderer.prototype.createNodePorts = function (ports) {
        var portElements = [];
        ports.forEach(function (port) {
            var portWrapper = document.createElement("div");
            portWrapper.className = "port-wrapper";
            var portElement = document.createElement("div");
            portElement.className = "port";
            portElement.id = port.id;
            portWrapper.appendChild(portElement);
            if (port.caption !== "") {
                var label = document.createElement("span");
                label.innerHTML = port.caption;
                label.className = "port-caption";
                portWrapper.appendChild(label);
            }
            portElements.push(portWrapper);
        });
        return portElements;
    };
    Renderer.prototype.applyLayerTransforms = function () {
        var _this = this;
        this.canvasLayers.forEach(function (layer) { return layer.style.transform = _this.canvasLayersTransforms.translate + " " + _this.canvasLayersTransforms.scale; });
    };
    Renderer.prototype.setScale = function (scale) {
        var scaledBy = scale - this.scale;
        this.alignPositionForCenteredScaling(scaledBy);
        this.scale = scale;
        this.canvasLayersTransforms.scale = "scale(" + scale + ")";
        this.applyLayerTransforms();
    };
    Renderer.prototype.alignPositionForCenteredScaling = function (scaledBy) {
        var center = this.getCenterScreenDiagramPos();
        var newCanvasX = this.canvasX - center.x * scaledBy;
        var newCanvasY = this.canvasY - center.y * scaledBy;
        this.setCanvasPosition(newCanvasX, newCanvasY);
    };
    Renderer.prototype.getCenterScreenDiagramPos = function () {
        var center = Renderer.getScreenCenterPos();
        return this.getDiagramPosFromScreenCoordinates(center.x, center.y);
    };
    Renderer.getScreenCenterPos = function () {
        var centerX = document.documentElement.clientWidth / 2;
        var centerY = document.documentElement.clientHeight / 2;
        return { x: centerX, y: centerY };
    };
    Renderer.prototype.portPos = function (v) {
        return v + this.portRadius + 1;
    };
    Renderer.prototype.updateNodePos = function (node) {
        var div = document.getElementById(node.id);
        if (div) {
            div.style.transform = "translate(" + node.x + "px, " + node.y + "px)";
        }
    };
    Renderer.prototype.getOffsetForCenteredPosition = function (x, y, xOffset, yOffset) {
        var diagramCanvasRect = this.getCanvasRect();
        xOffset = -x * this.scale;
        yOffset = -y * this.scale;
        xOffset += diagramCanvasRect.width / 2;
        yOffset += diagramCanvasRect.height / 2;
        return { x: xOffset, y: yOffset };
    };
    Renderer.prototype.getHoveredNodeId = function (x, y) {
        var touchedNodeId = "";
        this.nodeElements.forEach(function (nodeElement) {
            var rect = nodeElement.getBoundingClientRect();
            if (x >= rect.left && x <= (rect.width + rect.left)
                && y > rect.top && y < (rect.height + rect.top)) {
                touchedNodeId = nodeElement.id;
            }
        });
        return touchedNodeId;
    };
    Renderer.prototype.getHoveredPortId = function (x, y) {
        var touchedPortId = "";
        var touchedNodeId = this.getHoveredNodeId(x, y);
        if (touchedNodeId) {
            document.querySelectorAll(".port").forEach(function (portElement) {
                var rect = portElement.getBoundingClientRect();
                if (x >= rect.left && x <= (rect.width + rect.left)
                    && y > rect.top && y < (rect.height + rect.top)) {
                    touchedPortId = portElement.id;
                }
            });
        }
        return touchedPortId;
    };
    Renderer.prototype.isCanvasHovered = function (x, y) {
        var rect = this.canvas.getBoundingClientRect();
        return x >= rect.left && x <= (rect.width + rect.left)
            && y > rect.top && y < (rect.height + rect.top);
    };
    Renderer.prototype.updateLine = function (update) {
        var portFrom = document.getElementById(update.connection.from.portId);
        var portTo = document.getElementById(update.connection.to.portId);
        var x1 = this.portPos(portFrom.offsetLeft + update.fromNode.x);
        var y1 = this.portPos(portFrom.offsetTop + update.fromNode.y);
        var x2 = this.portPos(portTo.offsetLeft + update.toNode.x);
        var y2 = this.portPos(portTo.offsetTop + update.toNode.y);
        var id = Renderer.getConnectionElementId(update.connection.id);
        var path = this.svg.select("#" + id);
        if (path.empty()) {
            path = this.svg.append("path").attr("id", id);
        }
        var theRenderer = this;
        path.attr("class", "connection")
            .on("mouseover", function () {
            d3.select(this).attr("class", "connection connection--hovered");
        })
            .on("mouseout", function () {
            d3.select(this).attr("class", "connection");
        })
            .on("click", function () {
            theRenderer._onClickLine(update.connection.id);
            d3.select(this).remove();
        })
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .attr("d", "M" + x1 + " " + y1 + " Q" + x1 + " " + y2 + " " + x2 + " " + y2);
    };
    Renderer.prototype.updateGrabLine = function (x1, y1, x2, y2) {
        var id = "grab-line";
        var path = this.svg.select("#" + id);
        if (path.empty()) {
            path = this.svg.append("path").attr("id", id);
        }
        path.attr("class", "connection grab-line")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .attr("d", "M" + x1 + " " + y1 + " Q" + x1 + " " + y2 + " " + x2 + " " + y2);
    };
    Renderer.prototype.removeGrabLine = function () {
        var id = "grab-line";
        this.svg.select("#" + id).remove();
    };
    Renderer.prototype.getDiagramPosFromScreenCoordinates = function (viewX, viewY) {
        var diagramCanvasRect = this.htmlCanvas.getBoundingClientRect();
        var diagramX = viewX - diagramCanvasRect.x;
        var diagramY = viewY - diagramCanvasRect.y;
        return { x: diagramX / this.scale, y: diagramY / this.scale };
    };
    Renderer.prototype.centerAtPosition = function (canvasX, canvasY) {
        var scaledX = canvasX * this.scale;
        var scaledY = canvasY * this.scale;
        var screenCenter = Renderer.getScreenCenterPos();
        var deltaX = screenCenter.x - scaledX - this.canvasX;
        var deltaY = screenCenter.y - scaledY - this.canvasY;
        this.setCanvasPosition(this.canvasX + deltaX, this.canvasY + deltaY);
        this.applyLayerTransforms();
    };
    Renderer.prototype.dragCanvas = function (x, y) {
        this.setCanvasPosition(this.canvasX - x, this.canvasY - y);
        this.applyLayerTransforms();
    };
    Renderer.prototype.registerEventHandler = function (eventType, callback) {
        return this.viewEvents.registerEventHandler(eventType, callback);
    };
    Renderer.prototype.removeEventHandler = function (id) {
        return this.viewEvents.removeEventHandler(id);
    };
    Renderer.prototype.updateNodeSelection = function (nodeId, selected) {
        var div = document.getElementById(nodeId);
        if (div) {
            var classNameSelected = "node--selected";
            var classNameUnselected = "node--unselected";
            var className = (selected) ? classNameSelected : classNameUnselected;
            div.classList.remove(classNameSelected, classNameUnselected);
            div.classList.add(className);
        }
    };
    Renderer.prototype.removeNode = function (nodeId) {
        var div = document.getElementById(nodeId);
        if (div) {
            div.parentElement.removeChild(div);
        }
    };
    Renderer.prototype.removeConnection = function (connectionId) {
        var id = Renderer.getConnectionElementId(connectionId);
        this.svg.select("#" + id).remove();
    };
    Renderer.getConnectionElementId = function (connectionId) {
        return "p_" + connectionId;
    };
    Renderer.prototype.getBoundingClientRect = function () {
        return this.htmlCanvas.getBoundingClientRect();
    };
    Renderer.prototype.setCanvasPosition = function (x, y) {
        this.canvasX = x;
        this.canvasY = y;
        this.canvasLayersTransforms.translate = "translate(" + x + "px," + y + "px)";
    };
    Renderer.prototype.updateNodeCaption = function (node) {
        this.renderNode(node);
    };
    Renderer.prototype.updatePortName = function (node, port) {
        this.renderNode(node);
    };
    return Renderer;
}());
export { Renderer };
//# sourceMappingURL=Renderer.js.map