import UUID from "./UUID";
export var EventType;
(function (EventType) {
    EventType[EventType["TouchStart"] = 0] = "TouchStart";
    EventType[EventType["TouchMove"] = 1] = "TouchMove";
    EventType[EventType["TouchEnd"] = 2] = "TouchEnd";
    EventType[EventType["Click"] = 3] = "Click";
    EventType[EventType["DoubleClick"] = 4] = "DoubleClick";
    EventType[EventType["Wheel"] = 5] = "Wheel";
    EventType[EventType["KeyDown"] = 6] = "KeyDown";
    EventType[EventType["KeyUp"] = 7] = "KeyUp";
})(EventType || (EventType = {}));
var ViewEvents = /** @class */ (function () {
    function ViewEvents(canvas, renderer) {
        this.eventCallbacks = [];
        this.canvas = canvas;
        this.renderer = renderer;
    }
    ViewEvents.getTouchEndEventTouch = function (event) {
        var touch = null;
        if (event.touches.length > 0) {
            touch = event.touches[0];
        }
        if (event.changedTouches.length > 0) {
            touch = event.changedTouches[0];
        }
        return touch;
    };
    ViewEvents.prototype.getTouchInputPos = function (event) {
        if (this.isTouchDevice()) {
            var touch = ViewEvents.getTouchEndEventTouch(event);
            return { x: touch.clientX, y: touch.clientY };
        }
        return { x: event.clientX, y: event.clientY };
    };
    ViewEvents.prototype.wrapCallback = function (eventType, callback) {
        var _this = this;
        switch (eventType) {
            case EventType.TouchStart:
            case EventType.TouchMove:
            case EventType.TouchEnd:
            case EventType.Click:
            case EventType.DoubleClick:
            case EventType.Wheel:
            case EventType.KeyDown:
            case EventType.KeyUp:
                return function (event) {
                    var touchInputPos = _this.getTouchInputPos(event);
                    var diagramInputPos = _this.renderer.getDiagramPosFromScreenCoordinates(touchInputPos.x, touchInputPos.y);
                    callback(event, touchInputPos, diagramInputPos);
                };
        }
    };
    ViewEvents.prototype.getEventNameByType = function (eventType) {
        var _a, _b;
        var desktop = (_a = {},
            _a[EventType.TouchStart] = "mousedown",
            _a[EventType.TouchMove] = "mousemove",
            _a[EventType.TouchEnd] = "mouseup",
            _a[EventType.Wheel] = "wheel",
            _a[EventType.DoubleClick] = "dblclick",
            _a[EventType.Click] = "click",
            _a[EventType.KeyDown] = "keydown",
            _a[EventType.KeyUp] = "keyup",
            _a);
        var touch = (_b = {},
            _b[EventType.TouchStart] = "touchstart",
            _b[EventType.TouchMove] = "touchmove",
            _b[EventType.TouchEnd] = "touchend",
            _b[EventType.Wheel] = "",
            _b[EventType.DoubleClick] = "",
            _b);
        return this.isTouchDevice() ? touch[eventType] : desktop[eventType];
    };
    ViewEvents.prototype.registerEventHandler = function (eventType, callback) {
        var id = UUID.NewId();
        var eventName = this.getEventNameByType(eventType);
        var wrappedCallback = this.wrapCallback(eventType, callback).bind(this);
        this.eventCallbacks[id] = {
            EventName: eventName,
            Callback: wrappedCallback
        };
        var eventTarget = this.getEventTarget(eventName);
        eventTarget.addEventListener(eventName, wrappedCallback);
        return id;
    };
    ViewEvents.prototype.getEventTarget = function (eventName) {
        if (eventName === "keyup" || eventName === "keydown") {
            return window;
        }
        return this.canvas;
    };
    ViewEvents.prototype.removeEventHandler = function (id) {
        var eventCallback = this.eventCallbacks[id];
        if (eventCallback === undefined) {
            throw new Error("could not find event callback for id:" + id);
        }
        var eventName = this.eventCallbacks[id].EventName;
        var callback = this.eventCallbacks[id].Callback;
        var eventTarget = this.getEventTarget(eventName);
        eventTarget.removeEventListener(eventName, callback);
        delete this.eventCallbacks[id];
    };
    ViewEvents.prototype.isTouchDevice = function () {
        return !!('ontouchstart' in window || navigator.maxTouchPoints);
    };
    return ViewEvents;
}());
export { ViewEvents };
//# sourceMappingURL=ViewEvents.js.map