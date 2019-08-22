var MouseTail, mouseMove, mouseUp, mouseDown,
    events = {
        MOUSEUP: "mouseup",
        MOUSEDOWN: "mousedown",
        MOUSEMOVE: "mousemove",
        UPDATE: "update"
    };

///////////////////////////////////////////////////////////
// helpers
///////////////////////////////////////////////////////////
function addEvent(el, event, fn) {
    if (el.addEventListener) {
        return el.addEventListener(event, fn, false);
    } else {
        return el.attachEvent("on" + event, function() {
            return (fn.call(el, window.event));
        });
    }
}

function removeEvent(el, event, fn) {
    if (el.removeEventListener) {
        return el.removeEventListener(event, fn);
    } else if (el.detachEvent) {
        return el.detachEvent("on" + event, fn);
    }
}

///////////////////////////////////////////////////////////
// constructor
///////////////////////////////////////////////////////////
MouseTail = function(el, config) {
    this.el = el || document;
    this.defaults = {
        bounded: false
    };

    if (config) {
        for (var prop in config) {
            if (config.hasOwnProperty(prop)) {
                this.defaults[prop] = config[prop];
            }
        }
    }

    this.startTracking();
};

// or

MouseTail.create = function(el, config) {
    return new MouseTail(el, config);
};

///////////////////////////////////////////////////////////
// class methods
///////////////////////////////////////////////////////////
MouseTail.createTracker = function(startX, startY) {
    var lastX = startX || 0,
        lastY = startY || 0;

    return function(currentX, currentY) {
        if (currentX === undefined) {
            currentX = lastX;
        }

        if (currentY === undefined) {
            currentY = lastY;
        }

        data = {
            startX: startX,
            startY: startY,
            lastX: lastX,
            lastY: lastY,
            currentX: currentX,
            currentY: currentY,
            deltaX: currentX - lastX,
            deltaY: currentY - lastY,
            distanceX: currentX - startX,
            distanceY: currentY - startY
        };

        lastX = currentX;
        lastY = currentY;

        return data;
    };
};

MouseTail.getCursorPosition = function(event) {
    var x = 0,
        y = 0;

    event = event || window.event;

    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    } else if (event.clientX || event.clientY) {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
        x: x,
        y: y
    };
};

///////////////////////////////////////////////////////////
// instance methods
///////////////////////////////////////////////////////////
MouseTail.prototype.startTracking = function() {
    mouseDown = this._onMouseDown.bind(this);
    addEvent(this.el, events.MOUSEDOWN, mouseDown);
};


MouseTail.prototype.stopTracking = function() {
    removeEvent(this.el, events.MOUSEDOWN, mouseDown);
};

///////////////////////////////////////////////////////////
// psudo private methods
///////////////////////////////////////////////////////////
MouseTail.prototype._onMouseDown = function() {
    var pos = MouseTail.getCursorPosition(event);
    mouseUp = this._onMouseUp.bind(this);
    mouseMove = this._onMouseMove.bind(this);

    this.currentTracker = MouseTail.createTracker(pos.x - this.el.offsetLeft, pos.y - this.el.offsetTop);

    addEvent(this.defaults.bounded ? this.el : document, events.MOUSEMOVE, mouseMove);
    addEvent(window, events.MOUSEUP, mouseUp);
    this._trigger(events.MOUSEDOWN);
};

MouseTail.prototype._onMouseMove = function(e) {
    var pos = MouseTail.getCursorPosition(event);
    this._trigger(events.UPDATE, this.currentTracker(pos.x - this.el.offsetLeft, pos.y - this.el.offsetTop));
};

MouseTail.prototype._onMouseUp = function() {
    this.currentTracker = null;
    removeEvent(this.defaults.bounded ? this.el : document, events.MOUSEMOVE, mouseMove);
    removeEvent(window, events.MOUSEUP, mouseUp);
    this._trigger(events.MOUSEUP);
};

///////////////////////////////////////////////////////////
// eventing
// lifted from simple.js (http://simplejs.org/)
///////////////////////////////////////////////////////////
MouseTail.prototype.on = function(event, callback, context) {
    var callbacks = this._callbacks || (this._callbacks = {});
    var events = callbacks[event] || (callbacks[event] = []);
    events.push({
        callback: callback,
        context: context
    });
};

MouseTail.prototype.off = function(event, callback, context) {
    if (!callback && !context) {
        delete this._callbacks[event];
    }
    var events = this._callbacks[event] || [];
    for (var i = 0; i < events.length; i++) {
        if (!(callback && events[i].callback !== callback || context && events[i].context !== context)) {
            events.splice(i, 1);
        }
    }
};

MouseTail.prototype._trigger = function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var callbacks = this._callbacks || {};
    var events = callbacks[event] || [];
    for (var i = 0; i < events.length; i++) {
        events[i].callback.apply(events[i].context || this, args);
    }
};

module.exports = MouseTail;
