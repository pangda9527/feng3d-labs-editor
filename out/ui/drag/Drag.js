"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Drag = /** @class */ (function () {
    function Drag() {
    }
    Drag.prototype.register = function (displayObject, setdargSource, accepttypes, onDragDrop) {
        this.unregister(displayObject);
        registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });
        if (setdargSource)
            displayObject.addEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
    };
    Drag.prototype.unregister = function (displayObject) {
        for (var i = registers.length - 1; i >= 0; i--) {
            if (registers[i].displayObject == displayObject) {
                registers.splice(i, 1);
            }
        }
        displayObject.removeEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
    };
    /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
    Drag.prototype.refreshAcceptables = function () {
        //获取可接受数据的对象列表
        acceptableitems = registers.reduce(function (value, item) {
            if (item != dragitem && acceptData(item, dragSource)) {
                value.push(item);
            }
            return value;
        }, []);
    };
    return Drag;
}());
exports.Drag = Drag;
;
exports.drag = new Drag();
var stage;
var registers = [];
/**
 * 对象与触发接受拖拽的对象列表
 */
var accepters = new Map();
/**
 * 被拖拽数据
 */
var dragSource;
/**
 * 被拖拽对象
 */
var dragitem;
/**
 * 可接受拖拽数据对象列表
 */
var acceptableitems;
function getitem(displayObject) {
    for (var i = 0; i < registers.length; i++) {
        if (registers[i].displayObject == displayObject)
            return registers[i];
    }
    return null;
}
/**
 * 判断是否接受数据
 * @param item
 * @param dragSource
 */
function acceptData(item, dragSource) {
    var hasdata = item.accepttypes.reduce(function (prevalue, accepttype) { return prevalue || !!dragSource[accepttype]; }, false);
    return hasdata;
}
function onItemMouseDown(event) {
    if (dragitem)
        return;
    dragitem = getitem(event.currentTarget);
    if (!dragitem.setdargSource) {
        dragitem = null;
        return;
    }
    if (dragitem) {
        stage = dragitem.displayObject.stage;
        stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
        stage.addEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
    }
}
function onMouseUp(event) {
    stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
    stage.removeEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
    acceptableitems = null;
    accepters.getKeys().forEach(function (element) {
        element.alpha = accepters.get(element);
        var accepteritem = getitem(element);
        accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
    });
    accepters.clear();
    dragitem = null;
}
function onMouseMove(event) {
    if (!acceptableitems) {
        //获取拖拽数据
        dragSource = {};
        dragitem.setdargSource(dragSource);
        //获取可接受数据的对象列表
        acceptableitems = registers.reduce(function (value, item) {
            if (item != dragitem && acceptData(item, dragSource)) {
                value.push(item);
            }
            return value;
        }, []);
    }
    accepters.getKeys().forEach(function (element) {
        element.alpha = accepters.get(element);
    });
    accepters.clear();
    acceptableitems.forEach(function (element) {
        if (element.displayObject.getTransformedBounds(stage).contains(event.stageX, event.stageY)) {
            accepters.set(element.displayObject, element.displayObject.alpha);
            element.displayObject.alpha = 0.5;
        }
    });
}
//# sourceMappingURL=Drag.js.map