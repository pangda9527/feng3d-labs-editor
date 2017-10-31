var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="native.d.ts" />
var feng3d;
(function (feng3d) {
    var native;
    (function (native) {
        native.file = {
            stat: stat,
            readdir: readdir,
            writeFile: writeFile,
            writeJsonFile: writeJsonFile,
            readFile: readFile,
            mkdir: mkdir,
            rename: rename,
            move: move,
            remove: remove,
            detailStat: detailStat,
        };
        var fs = require("fs-extra");
        function stat(path, callback) {
            var stats = fs.stat(path, (err, stats) => {
                if (err) {
                    return callback({ message: err.message }, null);
                }
                if (stats) {
                    var fileInfo = {
                        path: path,
                        size: stats.size,
                        isDirectory: stats.isDirectory(),
                        birthtime: stats.birthtime.getTime(),
                        mtime: stats.mtime.getTime(),
                        children: []
                    };
                }
                callback(null, fileInfo);
            });
        }
        function detailStat(path, depth, callback) {
            var stats = fs.stat(path, (err, stats) => {
                if (err) {
                    return callback({ message: err.message }, null);
                }
                if (stats) {
                    var fileInfo = {
                        path: path,
                        size: stats.size,
                        isDirectory: stats.isDirectory(),
                        birthtime: stats.birthtime.getTime(),
                        mtime: stats.mtime.getTime(),
                        children: []
                    };
                    if (fileInfo.isDirectory && depth > 0) {
                        fileInfo.children = [];
                        fs.readdir(path, (err, files) => {
                            if (files.length == 0) {
                                callback(null, fileInfo);
                            }
                            else {
                                var statfiles = files.concat();
                                statfiles.forEach(element => {
                                    detailStat(path + "/" + element, depth - 1, (err, childInfo) => {
                                        fileInfo.children.push(childInfo);
                                        files.splice(files.indexOf(element), 1);
                                        if (files.length == 0) {
                                            callback(null, fileInfo);
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else {
                        callback(null, fileInfo);
                    }
                }
            });
        }
        function readdir(path, callback) {
            fs.readdir(path, (err, files) => {
                callback(rerr(err), files);
            });
        }
        function writeFile(path, data, callback) {
            fs.open(path, "w", (err, fd) => {
                if (err) {
                    callback && callback(rerr(err));
                    return;
                }
                fs.writeFile(path, data, (err1) => {
                    callback && callback(rerr(err1));
                    fs.close(fd, (err) => {
                    });
                });
            });
        }
        function readFile(path, callback) {
            fs.open(path, "r", (err, fd) => {
                if (err) {
                    callback(rerr(err), undefined);
                    return;
                }
                fs.readFile(path, 'utf8', (err1, data) => {
                    callback(rerr(err1), data);
                    fs.close(fd, (err) => {
                    });
                });
            });
        }
        function remove(path, callback) {
            var stat = fs.statSync(path);
            if (!stat) {
                console.warn("给定的路径不存在，请给出正确的路径");
                return;
            }
            if (stat.isDirectory()) {
                //返回文件和子目录的数组
                var files = fs.readdirSync(path);
                files.forEach(function (file, index) {
                    remove(path + "/" + file, null);
                });
                //清除文件夹
                fs.rmdirSync(path);
            }
            else {
                fs.unlinkSync(path);
            }
            callback && callback(null);
        }
        function mkdir(path, callback) {
            fs.mkdir(path, (err) => {
                callback(rerr(err));
            });
        }
        function rename(oldPath, newPath, callback) {
            fs.rename(oldPath, newPath, (err) => {
                callback(rerr(err));
            });
        }
        function move(src, dest, callback) {
            // var sourceFile = path.join(__dirname, fileName);
            // var destPath = path.join(__dirname, "dest", fileName);
            var srcstats = fs.statSync(src);
            if (!srcstats) {
                callback({ message: `源文件${src}不存在！` });
                return;
            }
            var deststats = fs.statSync(dest);
            if (deststats) {
                callback({ message: `目标路径${dest}存在文件！` });
                return;
            }
            var readStream = fs.createReadStream(src);
            var writeStream = fs.createWriteStream(dest);
            readStream.pipe(writeStream);
            remove(src);
            callback(null);
        }
        function rerr(err) {
            if (err) {
                var rerrobj = { message: err.message };
            }
            return rerrobj;
        }
        function writeJsonFile(path, data, callback) {
            var content = JSON.stringify(data, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            writeFile(path, content, callback);
        }
    })(native = feng3d.native || (feng3d.native = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var web;
    (function (web) {
        web.client = {
            callServer: callServer
        };
        var callbackMap = {};
        var callbackAutoID = 0;
        //阻塞信息
        var blockMsgs = [];
        var ws;
        /**
         * 调用服务端方法
         * @param objectid 服务端对象编号
         * @param func 方法名称
         * @param param 参数
         */
        function callServer(objectid, func, param, callback) {
            var callbackid = callbackAutoID++;
            callbackMap[callbackid] = callback;
            var msg = { objectid: objectid, func: func, param: param, callbackid: callbackid };
            send(msg);
        }
        function send(msg) {
            if (ws && ws.readyState == ws.OPEN) {
                ws.send(JSON.stringify(msg));
            }
            else {
                blockMsgs.push(msg);
                readyWS((ws) => {
                    blockMsgs.forEach(element => {
                        ws.send(JSON.stringify(element));
                    });
                    blockMsgs.length = 0;
                });
            }
        }
        function readyWS(callback) {
            if (ws) {
                if (ws.readyState == ws.OPEN) {
                    callback(ws);
                    return;
                }
                if (ws.readyState == ws.CONNECTING) {
                    return;
                }
                ws.onopen = null;
                ws.onmessage = null;
            }
            ws = new WebSocket("ws://localhost:8181");
            ws.onopen = function (e) {
                console.log('Connection to server opened');
                callback(ws);
            };
            ws.onmessage = (ev) => {
                var msg = JSON.parse(ev.data);
                if (msg.callbackid !== undefined) {
                    var callback = callbackMap[msg.callbackid];
                    if (callback)
                        callback.apply(null, msg.data);
                    else
                        console.log("收到服务器回调信息", msg);
                    delete callbackMap[msg.callbackid];
                }
            };
        }
    })(web = feng3d.web || (feng3d.web = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var web;
    (function (web) {
        web.file = {
            stat: stat,
            readdir: readdir,
            writeFile: writeFile,
            readFile: readFile,
            remove: remove,
            mkdir: mkdir,
            rename: rename,
            move: move,
        };
        function stat(path, callback) {
            web.client.callServer("file", "stat", [path], callback);
        }
        function detailStat(path, depth, callback) {
            web.client.callServer("file", "detailStat", [path, depth], callback);
        }
        function readdir(path, callback) {
            web.client.callServer("file", "readdir", [path], callback);
        }
        function writeFile(path, data, callback) {
            web.client.callServer("file", "writeFile", [path, data], callback);
        }
        function readFile(path, callback) {
            web.client.callServer("file", "readFile", [path], callback);
        }
        function remove(path, callback) {
            web.client.callServer("file", "remove", [path], callback);
        }
        function mkdir(path, callback) {
            web.client.callServer("file", "mkdir", [path], callback);
        }
        function rename(oldPath, newPath, callback) {
            web.client.callServer("file", "rename", [oldPath, newPath], callback);
        }
        function move(src, dest, callback) {
            web.client.callServer("file", "move", [src, dest], callback);
        }
    })(web = feng3d.web || (feng3d.web = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.file = feng3d.native.file;
        // export var file = feng3d.web.file;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.ipc = require('electron').ipcRenderer;
        editor.shell = require('electron').shell;
        editor.electron = { call: call };
        var callbackautoid = 0;
        var callbacks = {};
        function call(id, param) {
            var callbackid = callbackautoid++;
            callbacks[callbackid] = param && param.callback;
            editor.ipc.send("electron", id, callbackid, param && param.param);
        }
        editor.ipc.on("electron", (e, id, callbackid, param) => {
            var callback = callbacks[callbackid];
            callback && callback(param);
            delete callbacks[callbackid];
        });
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.editorcache = {};
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.drag = {
            register: register,
            unregister: unregister,
            /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
            refreshAcceptables: refreshAcceptables,
        };
        var stage;
        var registers = [];
        /**
         * 接受拖拽数据对象列表
         */
        var accepters;
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
        function unregister(displayObject) {
            for (var i = registers.length - 1; i >= 0; i--) {
                if (registers[i].displayObject == displayObject) {
                    registers.splice(i, 1);
                }
            }
            displayObject.removeEventListener(editor.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
        }
        function register(displayObject, setdargSource, accepttypes, onDragDrop) {
            unregister(displayObject);
            registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });
            if (setdargSource)
                displayObject.addEventListener(editor.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
        }
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
            var hasdata = item.accepttypes.reduce((prevalue, accepttype) => { return prevalue || !!dragSource[accepttype]; }, false);
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
                stage.addEventListener(editor.MouseEvent.MOUSE_MOVE, onMouseMove, null);
                stage.addEventListener(editor.MouseEvent.MOUSE_UP, onMouseUp, null);
            }
        }
        function onMouseUp(event) {
            stage.removeEventListener(editor.MouseEvent.MOUSE_MOVE, onMouseMove, null);
            stage.removeEventListener(editor.MouseEvent.MOUSE_UP, onMouseUp, null);
            acceptableitems && acceptableitems.forEach(element => {
                element.displayObject.removeEventListener(editor.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.removeEventListener(editor.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
            acceptableitems = null;
            accepters && accepters.forEach(accepter => {
                accepter.alpha = 1.0;
                var accepteritem = getitem(accepter);
                accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
            });
            accepters = null;
            dragitem = null;
        }
        function onMouseMove(event) {
            stage.removeEventListener(editor.MouseEvent.MOUSE_MOVE, onMouseMove, null);
            //获取拖拽数据
            dragSource = {};
            dragitem.setdargSource(dragSource);
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce((value, item) => {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
            acceptableitems.forEach(element => {
                element.displayObject.addEventListener(editor.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.addEventListener(editor.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
        }
        function refreshAcceptables() {
            acceptableitems && acceptableitems.forEach(element => {
                element.displayObject.removeEventListener(editor.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.removeEventListener(editor.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
            acceptableitems = null;
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce((value, item) => {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
            acceptableitems.forEach(element => {
                element.displayObject.addEventListener(editor.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.addEventListener(editor.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
        }
        function onMouseOver(event) {
            var displayObject = event.currentTarget;
            accepters = accepters || [];
            if (accepters.indexOf(displayObject) == -1) {
                accepters.push(displayObject);
                displayObject.alpha = 0.5;
            }
        }
        function onMouseOut(event) {
            var displayObject = event.currentTarget;
            accepters = accepters || [];
            var index = accepters.indexOf(displayObject);
            if (index != -1) {
                accepters.splice(index, 1);
                displayObject.alpha = 1.0;
            }
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.editorshortcut = {
            init: init,
        };
        function init() {
            //监听命令
            feng3d.shortcut.on("deleteSeletedObject3D", onDeleteSeletedObject3D);
        }
        function onDeleteSeletedObject3D() {
            if (!editor.editor3DData.selectedObject)
                return;
            if (editor.editor3DData.selectedObject instanceof feng3d.GameObject) {
                editor.editor3DData.selectedObject.remove();
            }
            else {
                editor.assets.deletefile(editor.editor3DData.selectedObject.path);
            }
            //
            editor.editor3DData.selectedObject = null;
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Feng3dView extends eui.Component {
            constructor() {
                super();
                this.skinName = "Feng3dViewSkin";
                feng3d.Stats.init();
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.canvas = document.getElementById("glcanvas");
                this.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.fullbutton.addEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.onResize();
                editor.drag.register(this, null, ["file_gameobject", "file_script"], (dragdata) => {
                    if (dragdata.file_gameobject) {
                        editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, editor.hierarchyTree.rootnode.gameobject);
                    }
                    if (dragdata.file_script) {
                        var gameobject = feng3d.mouse3DManager.getSelectedObject3D();
                        if (!gameobject || !gameobject.scene)
                            gameobject = editor.hierarchyTree.rootnode.gameobject;
                        feng3d.GameObjectUtil.addScript(gameobject, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.canvas = null;
                this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.fullbutton.removeEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                editor.drag.unregister(this);
            }
            onResize() {
                if (!this.stage)
                    return;
                var lt = this.localToGlobal(0, 0);
                var rb = this.localToGlobal(this.width, this.height);
                var bound1 = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
                // var bound2 = this.getTransformedBounds(this.stage);
                var bound = bound1;
                var style = this.canvas.style;
                style.position = "absolute";
                style.left = bound.x + "px";
                style.top = bound.y + "px";
                style.width = bound.width + "px";
                style.height = bound.height + "px";
                feng3d.Stats.instance.dom.style.left = bound.x + "px";
                feng3d.Stats.instance.dom.style.top = bound.y + "px";
                if (bound.contains(feng3d.input.clientX, feng3d.input.clientY)) {
                    feng3d.shortcut.activityState("mouseInView3D");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInView3D");
                }
            }
            onclick() {
                var gameObject = feng3d.mouse3DManager.getSelectedObject3D();
                if (!gameObject || !gameObject.scene)
                    return;
                var node = editor.hierarchyTree.getNode(gameObject);
                while (!node && (gameObject == gameObject.parent))
                    ;
                {
                    node = editor.hierarchyTree.getNode(gameObject);
                }
                if (node && gameObject) {
                    if (gameObject.scene.gameObject == gameObject) {
                        editor.editor3DData.selectedObject = null;
                    }
                    else {
                        editor.editor3DData.selectedObject = gameObject;
                    }
                }
            }
        }
        editor.Feng3dView = Feng3dView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.maskview = {
            mask: mask,
        };
        function mask(displayObject) {
            var maskReck = new eui.Rect();
            maskReck.alpha = 0;
            if (displayObject.stage) {
                onAddedToStage();
            }
            else {
                displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            function onAddedToStage() {
                maskReck.width = displayObject.stage.stageWidth;
                maskReck.height = displayObject.stage.stageHeight;
                editor.editorui.popupLayer.addChildAt(maskReck, 0);
                //
                maskReck.addEventListener(editor.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
            }
            function removeDisplayObject() {
                if (displayObject.parent)
                    displayObject.parent.removeChild(displayObject);
            }
            function onRemoveFromStage() {
                maskReck.removeEventListener(editor.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                if (maskReck.parent) {
                    maskReck.parent.removeChild(maskReck);
                }
            }
            function unmask() {
                displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            return unmask;
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
         */
        editor.popupview = {
            popup: popup
        };
        function popup(object, closecallback, param) {
            param = param || {};
            var view = feng3d.objectview.getObjectView(object);
            var background = new eui.Rect(param.width || 300, param.height || 300, 0xf0f0f0);
            view.addChildAt(background, 0);
            editor.maskview.mask(view);
            view.x = (editor.editorui.stage.stageWidth - view.width) / 2;
            view.y = (editor.editorui.stage.stageHeight - view.height) / 2;
            editor.editorui.popupLayer.addChild(view);
            view.addEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);
            function removefromstage() {
                view.removeEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);
                closecallback();
            }
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Accordion extends eui.Component {
            constructor() {
                super();
                this.components = [];
                this.titleName = "";
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "AccordionSkin";
            }
            addContent(component) {
                if (!this.contentGroup)
                    this.components.push(component);
                else
                    this.contentGroup.addChild(component);
            }
            onComplete() {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                if (this.components) {
                    for (var i = 0; i < this.components.length; i++) {
                        this.contentGroup.addChild(this.components[i]);
                    }
                    this.components = null;
                    delete this.components;
                }
            }
            onRemovedFromStage() {
                this.titleButton.removeEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
            }
            onTitleButtonClick() {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            }
        }
        editor.Accordion = Accordion;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class TreeItemRenderer extends eui.ItemRenderer {
            constructor() {
                super();
                /**
                 * 子节点相对父节点的缩进值，以像素为单位。默认17。
                 */
                this.indentation = 17;
                this.watchers = [];
                this.skinName = "TreeItemRendererSkin";
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                //
                this.disclosureButton.addEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
                this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
                this.updateView();
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
                eui.Watcher.watch(this, ["indentation"], this.updateView, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
                //
                this.disclosureButton.removeEventListener(editor.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            }
            onDisclosureButtonClick() {
                if (this.data)
                    this.data.isOpen = !this.data.isOpen;
            }
            updateView() {
                this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
                this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
                this.disclosureButton.selected = this.data ? this.data.isOpen : false;
            }
        }
        editor.TreeItemRenderer = TreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class MenuItemRenderer extends eui.ItemRenderer {
            constructor() {
                super();
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "MenuItemRender";
            }
            dataChanged() {
                super.dataChanged();
                this.updateView();
            }
            onComplete() {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.addEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);
                this.updateView();
            }
            onRemovedFromStage() {
                this.removeEventListener(editor.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
            }
            updateView() {
                if (!this.data)
                    return;
                if (this.data.type == 'separator') {
                    this.skin.currentState = "separator";
                }
                else {
                    this.skin.currentState = "normal";
                }
            }
            onItemMouseDown(event) {
                this.data.click && this.data.click();
            }
        }
        editor.MenuItemRenderer = MenuItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Tree extends feng3d.Event {
            get rootnode() {
                return this._rootnode;
            }
            set rootnode(value) {
                if (this._rootnode == value)
                    return;
                if (this._rootnode) {
                    feng3d.watcher.unwatch(this._rootnode, "isOpen", this.isopenchanged, this);
                }
                this._rootnode = value;
                if (this._rootnode) {
                    feng3d.watcher.watch(this._rootnode, "isOpen", this.isopenchanged, this);
                }
            }
            /**
             * 判断是否包含节点
             */
            contain(node, rootnode) {
                rootnode = rootnode || this.rootnode;
                var result = false;
                treeMap(rootnode, (item) => {
                    if (item == node)
                        result = true;
                });
                return result;
            }
            addNode(node, parentnode) {
                parentnode = parentnode || this.rootnode;
                feng3d.debuger && console.assert(!this.contain(parentnode, node), "无法添加到自身节点中!");
                node.parent = parentnode;
                parentnode.children.push(node);
                this.updateChildrenDepth(node);
                feng3d.watcher.watch(node, "isOpen", this.isopenchanged, this);
                this.dispatch("added", node);
                this.dispatch("changed", node);
            }
            removeNode(node) {
                var parentnode = node.parent;
                if (!parentnode)
                    return;
                var index = parentnode.children.indexOf(node);
                feng3d.debuger && console.assert(index != -1);
                parentnode.children.splice(index, 1);
                node.parent = null;
                feng3d.watcher.unwatch(node, "isOpen", this.isopenchanged, this);
                this.dispatch("removed", node);
                this.dispatch("changed", node);
            }
            destroy(node) {
                this.removeNode(node);
                if (node.children) {
                    for (var i = node.children.length - 1; i >= 0; i--) {
                        this.destroy(node.children[i]);
                    }
                    node.children.length = 0;
                }
            }
            updateChildrenDepth(node) {
                node.depth = ~~node.parent.depth + 1;
                treeMap(node, (node) => {
                    node.depth = ~~node.parent.depth + 1;
                });
            }
            getShowNodes(node) {
                node = node || this.rootnode;
                var nodes = [node];
                if (node.isOpen) {
                    node.children.forEach(element => {
                        nodes = nodes.concat(this.getShowNodes(element));
                    });
                }
                return nodes;
            }
            isopenchanged(host, property, oldvalue) {
                this.dispatch("openChanged", host);
            }
        }
        editor.Tree = Tree;
        function treeMap(treeNode, callback) {
            if (treeNode.children) {
                treeNode.children.forEach(element => {
                    callback(element, treeNode);
                    treeMap(element, callback);
                });
            }
        }
        editor.treeMap = treeMap;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Vector3DView extends eui.Component {
            constructor() {
                super();
                this.vm = new feng3d.Vector3D(1, 2, 3);
                this._showw = false;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "Vector3DViewSkin";
            }
            set showw(value) {
                if (this._showw == value)
                    return;
                this._showw = value;
                this.skin.currentState = this._showw ? "showw" : "default";
            }
            onComplete() {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.skin.currentState = this._showw ? "showw" : "default";
                this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.wTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            onRemovedFromStage() {
                this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.wTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            onTextChange(event) {
                switch (event.currentTarget) {
                    case this.xTextInput:
                        this.vm.x = Number(this.xTextInput.text);
                        break;
                    case this.yTextInput:
                        this.vm.y = Number(this.yTextInput.text);
                        break;
                    case this.zTextInput:
                        this.vm.z = Number(this.zTextInput.text);
                        break;
                    case this.wTextInput:
                        this.vm.w = Number(this.wTextInput.text);
                        break;
                }
            }
        }
        editor.Vector3DView = Vector3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DComponentView extends eui.Component {
            /**
             * 对象界面数据
             */
            constructor(component) {
                super();
                this.component = component;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "Object3DComponentSkin";
            }
            /**
             * 更新界面
             */
            updateView() {
                if (this.componentView)
                    this.componentView.updateView();
            }
            onComplete() {
                var componentName = feng3d.ClassUtils.getQualifiedClassName(this.component).split(".").pop();
                this.accordion.titleName = componentName;
                this.componentView = feng3d.objectview.getObjectView(this.component);
                this.accordion.addContent(this.componentView);
                this.deleteButton.visible = !(this.component instanceof feng3d.Transform);
                this.deleteButton.addEventListener(editor.MouseEvent.CLICK, this.onDeleteButton, this);
            }
            onDeleteButton(event) {
                if (this.component.gameObject)
                    this.component.gameObject.removeComponent(this.component);
            }
        }
        editor.Object3DComponentView = Object3DComponentView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.menu = {
            popup: popup,
        };
        function popup(menu, mousex, mousey, width = 150) {
            var list = new eui.List();
            list.itemRenderer = editor.MenuItemRenderer;
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);
            list.x = mousex || feng3d.input.clientX;
            list.y = mousey || feng3d.input.clientY;
            if (width !== undefined)
                list.width = width;
            editor.editorui.popupLayer.addChild(list);
            list.dataProvider = dataProvider;
            setTimeout(function () {
                editor.editorui.stage.once(editor.MouseEvent.CLICK, onStageClick, null);
            }, 1);
            function onStageClick() {
                editor.editorui.popupLayer.removeChild(list);
            }
        }
        // let template = [{
        //     label: 'Edit',
        //     submenu: [{
        //         label: 'Undo',
        //         accelerator: 'CmdOrCtrl+Z',
        //         role: 'undo'
        //     }, {
        //         label: 'Redo',
        //         accelerator: 'Shift+CmdOrCtrl+Z',
        //         role: 'redo'
        //     }, {
        //         type: 'separator'
        //     }, {
        //         label: 'Cut',
        //         accelerator: 'CmdOrCtrl+X',
        //         role: 'cut'
        //     }, {
        //         label: 'Copy',
        //         accelerator: 'CmdOrCtrl+C',
        //         role: 'copy'
        //     }, {
        //         label: 'Paste',
        //         accelerator: 'CmdOrCtrl+V',
        //         role: 'paste'
        //     }, {
        //         label: 'Select All',
        //         accelerator: 'CmdOrCtrl+A',
        //         role: 'selectall'
        //     }]
        // }, {
        //     label: 'View',
        //     submenu: [{
        //         label: 'Reload',
        //         accelerator: 'CmdOrCtrl+R',
        //         click: function (item, focusedWindow)
        //         {
        //             if (focusedWindow)
        //             {
        //                 // on reload, start fresh and close any old
        //                 // open secondary windows
        //                 if (focusedWindow.id === 1)
        //                 {
        //                     BrowserWindow.getAllWindows().forEach(function (win)
        //                     {
        //                         if (win.id > 1)
        //                         {
        //                             win.close()
        //                         }
        //                     })
        //                 }
        //                 focusedWindow.reload()
        //             }
        //         }
        //     }, {
        //         label: 'Toggle Full Screen',
        //         accelerator: (function ()
        //         {
        //             if (process.platform === 'darwin')
        //             {
        //                 return 'Ctrl+Command+F'
        //             } else
        //             {
        //                 return 'F11'
        //             }
        //         })(),
        //         click: function (item, focusedWindow)
        //         {
        //             if (focusedWindow)
        //             {
        //                 focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        //             }
        //         }
        //     }, {
        //         label: 'Toggle Developer Tools',
        //         accelerator: (function ()
        //         {
        //             if (process.platform === 'darwin')
        //             {
        //                 return 'Alt+Command+I'
        //             } else
        //             {
        //                 return 'Ctrl+Shift+I'
        //             }
        //         })(),
        //         click: function (item, focusedWindow)
        //         {
        //             if (focusedWindow)
        //             {
        //                 focusedWindow.toggleDevTools()
        //             }
        //         }
        //     }, {
        //         type: 'separator'
        //     }, {
        //         label: 'App Menu Demo',
        //         click: function (item, focusedWindow)
        //         {
        //             if (focusedWindow)
        //             {
        //                 const options = {
        //                     type: 'info',
        //                     title: 'Application Menu Demo',
        //                     buttons: ['Ok'],
        //                     message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
        //                 }
        //                 electron.dialog.showMessageBox(focusedWindow, options, function () { })
        //             }
        //         }
        //     }]
        // }, {
        //     label: 'Window',
        //     role: 'window',
        //     submenu: [{
        //         label: 'Minimize',
        //         accelerator: 'CmdOrCtrl+M',
        //         role: 'minimize'
        //     }, {
        //         label: 'Close',
        //         accelerator: 'CmdOrCtrl+W',
        //         role: 'close'
        //     }, {
        //         type: 'separator'
        //     }, {
        //         label: 'Reopen Window',
        //         accelerator: 'CmdOrCtrl+Shift+T',
        //         enabled: false,
        //         key: 'reopenMenuItem',
        //         click: function ()
        //         {
        //             app.emit('activate')
        //         }
        //     }]
        // }, {
        //     label: 'Help',
        //     role: 'help',
        //     submenu: [{
        //         label: 'Learn More',
        //         click: function ()
        //         {
        //             electron.shell.openExternal('http://electron.atom.io')
        //         }
        //     }]
        // }]
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认基础对象界面
         * @author feng 2016-3-11
         */
        let OVBaseDefault = class OVBaseDefault extends eui.Component {
            constructor(objectViewInfo) {
                super();
                this._space = objectViewInfo.owner;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OVBaseDefault";
            }
            onComplete() {
                this.updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            getAttributeView(attributeName) {
                return null;
            }
            getblockView(blockName) {
                return null;
            }
            /**
             * 更新界面
             */
            updateView() {
                this.label.text = String(this._space);
            }
        };
        OVBaseDefault = __decorate([
            feng3d.OVComponent()
        ], OVBaseDefault);
        editor.OVBaseDefault = OVBaseDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性界面
         * @author feng 2016-3-10
         */
        let OAVDefault = class OAVDefault extends eui.Component {
            constructor(attributeViewInfo) {
                super();
                this._space = attributeViewInfo.owner;
                this._attributeName = attributeViewInfo.name;
                this._attributeType = attributeViewInfo.type;
                this.attributeViewInfo = attributeViewInfo;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OAVDefault";
            }
            set dragparam(param) {
                if (param) {
                    //
                    editor.drag.register(this, (dragsource) => {
                        if (param.datatype)
                            dragsource[param.datatype] = this.attributeValue;
                    }, [param.accepttype], (dragSource) => {
                        this.attributeValue = dragSource[param.accepttype];
                    });
                }
            }
            onComplete() {
                this.text.percentWidth = 100;
                this.label.text = this._attributeName;
                this.updateView();
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                if (this.attributeViewInfo.componentParam) {
                    for (var key in this.attributeViewInfo.componentParam) {
                        if (this.attributeViewInfo.componentParam.hasOwnProperty(key)) {
                            this[key] = this.attributeViewInfo.componentParam[key];
                        }
                    }
                }
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                editor.drag.unregister(this);
            }
            ontxtfocusin() {
                this._textfocusintxt = true;
            }
            ontxtfocusout() {
                this._textfocusintxt = false;
            }
            onEnterFrame() {
                if (this._textfocusintxt)
                    return;
                this.updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            get attributeName() {
                return this._attributeName;
            }
            get attributeValue() {
                return this._space[this._attributeName];
            }
            set attributeValue(value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
            }
            /**
             * 更新界面
             */
            updateView() {
                this.text.enabled = this.attributeViewInfo.writable;
                if (this.attributeValue === undefined) {
                    this.text.text = String(this.attributeValue);
                }
                else if (!(this.attributeValue instanceof Object)) {
                    this.text.text = String(this.attributeValue);
                }
                else {
                    this.text.enabled = false;
                    var valuename = this.attributeValue["name"] || "";
                    this.text.text = valuename + " (" + feng3d.ClassUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + ")";
                    this.once(editor.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
                }
            }
            onDoubleClick() {
                editor.editor3DData.inspectorViewData.showData(this.attributeValue);
            }
            onTextChange() {
                switch (this._attributeType) {
                    case "String":
                        this.attributeValue = this.text.text;
                        break;
                    case "number":
                        var num = Number(this.text.text);
                        num = isNaN(num) ? 0 : num;
                        this.attributeValue = num;
                        break;
                    case "Boolean":
                        this.attributeValue = Boolean(this.text.text);
                        break;
                    default:
                        throw `无法处理类型${this._attributeType}!`;
                }
            }
        };
        OAVDefault = __decorate([
            feng3d.OAVComponent()
        ], OAVDefault);
        editor.OAVDefault = OAVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性块界面
         * @author feng 2016-3-22
         */
        let OBVDefault = class OBVDefault extends eui.Component {
            /**
             * @inheritDoc
             */
            constructor(blockViewInfo) {
                super();
                this._space = blockViewInfo.owner;
                this._blockName = blockViewInfo.name;
                this.itemList = blockViewInfo.itemList;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OBVDefault";
            }
            onComplete() {
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.$updateView();
            }
            initView() {
                if (this._blockName != null && this._blockName.length > 0) {
                    this.addChildAt(this.border, 0);
                    this.group.addChildAt(this.titleGroup, 0);
                }
                else {
                    this.removeChild(this.border);
                    this.group.removeChild(this.titleGroup);
                }
                this.attributeViews = [];
                var objectAttributeInfos = this.itemList;
                for (var i = 0; i < objectAttributeInfos.length; i++) {
                    var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
                    displayObject.percentWidth = 100;
                    this.contentGroup.addChild(displayObject);
                    this.attributeViews.push(displayObject);
                }
                this.isInitView = true;
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].space = this._space;
                }
                this.$updateView();
            }
            get blockName() {
                return this._blockName;
            }
            /**
             * 更新自身界面
             */
            $updateView() {
                if (!this.isInitView) {
                    this.initView();
                }
            }
            updateView() {
                this.$updateView();
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].updateView();
                }
            }
            getAttributeView(attributeName) {
                for (var i = 0; i < this.attributeViews.length; i++) {
                    if (this.attributeViews[i].attributeName == attributeName) {
                        return this.attributeViews[i];
                    }
                }
                return null;
            }
            onTitleButtonClick() {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            }
        };
        OBVDefault = __decorate([
            feng3d.OBVComponent()
        ], OBVDefault);
        editor.OBVDefault = OBVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认使用块的对象界面
         * @author feng 2016-3-22
         */
        let OVDefault = class OVDefault extends eui.Component {
            /**
             * 对象界面数据
             */
            constructor(objectViewInfo) {
                super();
                this._objectViewInfo = objectViewInfo;
                this._space = objectViewInfo.owner;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OVDefault";
            }
            onComplete() {
                //
                this.blockViews = [];
                var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
                for (var i = 0; i < objectBlockInfos.length; i++) {
                    var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
                    displayObject.percentWidth = 100;
                    this.group.addChild(displayObject);
                    this.blockViews.push(displayObject);
                }
                this.$updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                for (var i = 0; i < this.blockViews.length; i++) {
                    this.blockViews[i].space = this._space;
                }
                this.$updateView();
            }
            /**
             * 更新界面
             */
            updateView() {
                this.$updateView();
                for (var i = 0; i < this.blockViews.length; i++) {
                    this.blockViews[i].updateView();
                }
            }
            /**
             * 更新自身界面
             */
            $updateView() {
            }
            getblockView(blockName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    if (this.blockViews[i].blockName == blockName) {
                        return this.blockViews[i];
                    }
                }
                return null;
            }
            getAttributeView(attributeName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    var attributeView = this.blockViews[i].getAttributeView(attributeName);
                    if (attributeView != null) {
                        return attributeView;
                    }
                }
                return null;
            }
        };
        OVDefault = __decorate([
            feng3d.OVComponent()
        ], OVDefault);
        editor.OVDefault = OVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        let BooleanAttrView = class BooleanAttrView extends eui.Component {
            constructor(attributeViewInfo) {
                super();
                this._space = attributeViewInfo.owner;
                this._attributeName = attributeViewInfo.name;
                this._attributeType = attributeViewInfo.type;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "BooleanAttrViewSkin";
            }
            onComplete() {
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.label.text = this._attributeName;
                this.updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            updateView() {
                this.checkBox["selected"] = this.attributeValue;
            }
            onChange(event) {
                this.attributeValue = this.checkBox["selected"];
            }
            get attributeName() {
                return this._attributeName;
            }
            get attributeValue() {
                return this._space[this._attributeName];
            }
            set attributeValue(value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                    var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                    objectViewEvent.space = this._space;
                    objectViewEvent.attributeName = this._attributeName;
                    objectViewEvent.attributeValue = this.attributeValue;
                    this.dispatchEvent(objectViewEvent);
                }
            }
        };
        BooleanAttrView = __decorate([
            feng3d.OAVComponent()
        ], BooleanAttrView);
        editor.BooleanAttrView = BooleanAttrView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性界面
         * @author feng 2016-3-10
         */
        let OAVNumber = class OAVNumber extends editor.OAVDefault {
            /**
             * 默认对象属性界面
             * @author feng 2016-3-10
             */
            constructor() {
                super(...arguments);
                this.fractionDigits = 3;
            }
            /**
             * 更新界面
             */
            updateView() {
                var pow = Math.pow(10, 3);
                var value = Math.round(this.attributeValue * pow) / pow;
                this.text.text = String(value);
            }
        };
        OAVNumber = __decorate([
            feng3d.OAVComponent()
        ], OAVNumber);
        editor.OAVNumber = OAVNumber;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    class ObjectViewEvent extends egret.Event {
        constructor(type, bubbles = false, cancelable = false) {
            super(type, bubbles, cancelable);
        }
        toString() {
            return "[{0} type=\"{1}\" space=\"{2}\"  attributeName=\"{3}\" attributeValue={4}]".replace("{0}", egret.getQualifiedClassName(this).split("::").pop()).replace("{1}", this.type).replace("{2}", egret.getQualifiedClassName(this).split("::").pop()).replace("{3}", this.attributeName).replace("{4}", JSON.stringify(this.attributeValue));
        }
    }
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        let OAVVector3D = class OAVVector3D extends eui.Component {
            constructor(attributeViewInfo) {
                super();
                this._space = attributeViewInfo.owner;
                this._attributeName = attributeViewInfo.name;
                this._attributeType = attributeViewInfo.type;
                this.attributeViewInfo = attributeViewInfo;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OAVVector3DSkin";
            }
            onComplete() {
                this.vector3DView.vm = this.attributeValue;
                eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
                if (this.attributeViewInfo.componentParam) {
                    for (var key in this.attributeViewInfo.componentParam) {
                        if (this.attributeViewInfo.componentParam.hasOwnProperty(key)) {
                            this.vector3DView[key] = this.attributeViewInfo.componentParam[key];
                        }
                    }
                }
                this.updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            get attributeName() {
                return this._attributeName;
            }
            get attributeValue() {
                return this._space[this._attributeName];
            }
            set attributeValue(value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            }
            /**
             * 更新界面
             */
            updateView() {
            }
        };
        OAVVector3D = __decorate([
            feng3d.OAVComponent()
        ], OAVVector3D);
        editor.OAVVector3D = OAVVector3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        let OAVArray = class OAVArray extends eui.Component {
            constructor(attributeViewInfo) {
                super();
                this._space = attributeViewInfo.owner;
                this._attributeName = attributeViewInfo.name;
                this._attributeType = attributeViewInfo.type;
                this.attributeViewInfo = attributeViewInfo;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OAVArray";
            }
            onComplete() {
                this.$updateView();
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            get attributeName() {
                return this._attributeName;
            }
            get attributeValue() {
                return this._space[this._attributeName];
            }
            set attributeValue(value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            }
            /**
             * 更新自身界面
             */
            $updateView() {
                if (!this.isInitView) {
                    this.initView();
                }
            }
            initView() {
                this.attributeViews = [];
                var attributeValue = this.attributeValue;
                this.sizeTxt.text = this.attributeValue.length.toString();
                for (var i = 0; i < attributeValue.length; i++) {
                    var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
                    displayObject.percentWidth = 100;
                    this.contentGroup.addChild(displayObject);
                    this.attributeViews[i] = displayObject;
                }
                this.currentState = "hide";
                this.isInitView = true;
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.titleButton.addEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.titleButton.removeEventListener(editor.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            }
            /**
             * 更新界面
             */
            updateView() {
                this.$updateView();
            }
            onTitleButtonClick() {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            }
            onsizeTxtfocusout() {
                var size = parseInt(this.sizeTxt.text);
                var attributeValue = this.attributeValue;
                var attributeViews = this.attributeViews;
                if (size != attributeValue.length) {
                    attributeValue.length = size;
                    for (var i = 0; i < attributeViews.length; i++) {
                        if (attributeViews[i].parent) {
                            attributeViews[i].parent.removeChild(attributeViews[i]);
                        }
                    }
                    for (var i = 0; i < attributeValue.length; i++) {
                        if (attributeViews[i] == null) {
                            var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
                            attributeViews[i] = displayObject;
                            displayObject.percentWidth = 100;
                        }
                        this.contentGroup.addChild(attributeViews[i]);
                    }
                }
            }
        };
        OAVArray = __decorate([
            feng3d.OAVComponent()
        ], OAVArray);
        editor.OAVArray = OAVArray;
        class OAVArrayItem extends editor.OAVDefault {
            constructor(arr, index, componentParam) {
                var attributeViewInfo = {
                    name: index,
                    writable: true,
                    componentParam: componentParam,
                    owner: arr,
                };
                super(attributeViewInfo);
            }
            onComplete() {
                super.onComplete();
                this.label.width = 60;
            }
        }
        editor.OAVArrayItem = OAVArrayItem;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        let OAVObject3DComponentList = class OAVObject3DComponentList extends eui.Component {
            constructor(attributeViewInfo) {
                super();
                this.accordions = [];
                this._space = attributeViewInfo.owner;
                this._attributeName = attributeViewInfo.name;
                this._attributeType = attributeViewInfo.type;
                this.attributeViewInfo = attributeViewInfo;
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "OAVObject3DComponentListSkin";
            }
            onComplete() {
                this.addComponentButton.addEventListener(editor.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
                this.initView();
            }
            onAddComponentButtonClick() {
                var globalPoint = this.addComponentButton.localToGlobal(0, 0);
                editor.needcreateComponentGameObject = this.space;
                editor.menu.popup(editor.createObject3DComponentConfig, globalPoint.x, globalPoint.y, 180);
            }
            get space() {
                return this._space;
            }
            set space(value) {
                this._space = value;
                this.updateView();
            }
            get attributeName() {
                return this._attributeName;
            }
            get attributeValue() {
                return this._space[this._attributeName];
            }
            set attributeValue(value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            }
            initView() {
                this.accordions.length = 0;
                this.group.layout.gap = -1;
                var components = this.attributeValue;
                for (var i = 0; i < components.length; i++) {
                    this.addComponentView(components[i]);
                }
                this.space.on("addedComponent", this.onaddedcompont, this);
                this.space.on("removedComponent", this.onremovedComponent, this);
                editor.drag.register(this.addComponentButton, null, ["file_script"], (dragdata) => {
                    if (dragdata.file_script) {
                        feng3d.GameObjectUtil.addScript(this.space, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            }
            addComponentView(component) {
                if (component instanceof feng3d.Transform) {
                    //隐藏拥有以下组件的Transform组件
                    if (this.space.getComponent(feng3d.Scene3D)
                        || this.space.getComponent(feng3d.Trident)
                        || this.space.getComponent(editor.GroundGrid))
                        return;
                }
                if (component instanceof feng3d.BoundingComponent)
                    return;
                if (component instanceof feng3d.RenderAtomicComponent)
                    return;
                if (component instanceof feng3d.WireframeComponent)
                    return;
                var displayObject = new editor.Object3DComponentView(component);
                displayObject.percentWidth = 100;
                this.group.addChild(displayObject);
            }
            /**
             * 更新界面
             */
            updateView() {
                for (var i = 0, n = this.group.numChildren; i < n; i++) {
                    var child = this.group.getChildAt(i);
                    if (child instanceof editor.Object3DComponentView)
                        child.updateView();
                }
            }
            removedComponentView(component) {
                for (var i = this.group.numChildren - 1; i >= 0; i--) {
                    var displayObject = this.group.getChildAt(i);
                    if (displayObject instanceof editor.Object3DComponentView && displayObject.component == component) {
                        this.group.removeChild(displayObject);
                    }
                }
            }
            onaddedcompont(event) {
                this.addComponentView(event.data);
            }
            onremovedComponent(event) {
                this.removedComponentView(event.data);
            }
        };
        OAVObject3DComponentList = __decorate([
            feng3d.OAVComponent()
        ], OAVObject3DComponentList);
        editor.OAVObject3DComponentList = OAVObject3DComponentList;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 巡视界面数据
         * @author feng     2017-03-20
         */
        class InspectorViewData extends feng3d.Event {
            constructor(editor3DData) {
                super();
                this.viewDataList = [];
                eui.Watcher.watch(editor3DData, ["selectedObject"], this.updateView, this);
            }
            showData(data, removeBack = false) {
                if (this.viewData) {
                    this.viewDataList.push(this.viewData);
                }
                if (removeBack) {
                    this.viewDataList.length = 0;
                }
                //
                this.viewData = data;
                this.dispatch("change");
            }
            back() {
                this.viewData = this.viewDataList.pop();
                this.dispatch("change");
            }
            updateView() {
                this.showData(editor.editor3DData.selectedObject, true);
            }
        }
        editor.InspectorViewData = InspectorViewData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 巡视界面
         * @author feng     2017-03-20
         */
        class InspectorView extends eui.Component {
            constructor() {
                super();
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "InspectorViewSkin";
            }
            onComplete() {
                this.group.percentWidth = 100;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.inspectorViewData = editor.editor3DData.inspectorViewData;
                this.inspectorViewData.on("change", this.onDataChange, this);
                this.backButton.addEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
                this.backButton.visible = this.inspectorViewData.viewDataList.length > 0;
            }
            onRemovedFromStage() {
                this.inspectorViewData.off("change", this.onDataChange, this);
                this.backButton.removeEventListener(editor.MouseEvent.CLICK, this.onBackClick, this);
                this.inspectorViewData = null;
            }
            onDataChange() {
                this.updateView();
            }
            updateView() {
                this.backButton.visible = this.inspectorViewData.viewDataList.length > 0;
                if (this.view && this.view.parent) {
                    this.view.parent.removeChild(this.view);
                }
                if (this.inspectorViewData.viewData) {
                    this.view = feng3d.objectview.getObjectView(this.inspectorViewData.viewData);
                    this.view.percentWidth = 100;
                    this.group.addChild(this.view);
                }
            }
            onBackClick() {
                this.inspectorViewData.back();
            }
        }
        editor.InspectorView = InspectorView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class HierarchyTreeItemRenderer extends editor.TreeItemRenderer {
            constructor() {
                super();
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.addEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                editor.drag.register(this, this.setdargSource.bind(this), ["gameobject", "file_gameobject", "file_script"], (dragdata) => {
                    if (dragdata.gameobject) {
                        if (!dragdata.gameobject.contains(this.data.gameobject)) {
                            var localToWorldMatrix = dragdata.gameobject.transform.localToWorldMatrix;
                            this.data.gameobject.addChild(dragdata.gameobject);
                            dragdata.gameobject.transform.localToWorldMatrix = localToWorldMatrix;
                        }
                    }
                    if (dragdata.file_gameobject) {
                        editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, this.data.gameobject);
                    }
                    if (dragdata.file_script) {
                        feng3d.GameObjectUtil.addScript(this.data.gameobject, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.removeEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                editor.drag.unregister(this);
            }
            setdargSource(dragSource) {
                dragSource.gameobject = this.data.gameobject;
            }
            onclick() {
                editor.editor3DData.selectedObject = this.data.gameobject;
            }
            onrightclick(e) {
                var menuconfig = [];
                //scene3d无法删除
                if (this.data.gameobject.scene.gameObject != this.data.gameobject) {
                    menuconfig.push({
                        label: "delete", click: () => {
                            this.data.gameobject.parent.removeChild(this.data.gameobject);
                        }
                    });
                }
                menuconfig.push({
                    label: "save", click: () => {
                        editor.assets.saveGameObject(this.data.gameobject);
                    }
                });
                if (menuconfig.length > 0)
                    editor.menu.popup(menuconfig);
            }
        }
        editor.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class HierarchyView extends eui.Component {
            constructor() {
                super();
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "HierarchyViewSkin";
            }
            onComplete() {
                this.list.itemRenderer = editor.HierarchyTreeItemRenderer;
                this.listData = this.list.dataProvider = new eui.ArrayCollection();
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.addButton.addEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.hierarchyTree.on("added", this.updateHierarchyTree, this);
                editor.hierarchyTree.on("removed", this.updateHierarchyTree, this);
                editor.hierarchyTree.on("openChanged", this.updateHierarchyTree, this);
                feng3d.watcher.watch(editor.editor3DData, "selectedObject", this.selectedObject3DChanged, this);
                this.updateHierarchyTree();
            }
            onRemovedFromStage() {
                this.addButton.removeEventListener(editor.MouseEvent.CLICK, this.onAddButtonClick, this);
                editor.hierarchyTree.off("added", this.updateHierarchyTree, this);
                editor.hierarchyTree.off("removed", this.updateHierarchyTree, this);
                editor.hierarchyTree.off("openChanged", this.updateHierarchyTree, this);
                feng3d.watcher.unwatch(editor.editor3DData, "selectedObject", this.selectedObject3DChanged, this);
            }
            updateHierarchyTree() {
                var nodes = editor.hierarchyTree.getShowNodes();
                this.listData.replaceAll(nodes);
            }
            selectedObject3DChanged(host, property, oldvalue) {
                if (oldvalue instanceof feng3d.GameObject) {
                    var newnode = editor.hierarchyTree.getNode(oldvalue);
                    if (newnode) {
                        newnode.selected = false;
                    }
                    //清除选中效果
                    var wireframeComponent = oldvalue.getComponent(feng3d.WireframeComponent);
                    if (wireframeComponent)
                        oldvalue.removeComponent(wireframeComponent);
                }
                if (editor.editor3DData.selectedObject && editor.editor3DData.selectedObject instanceof feng3d.GameObject) {
                    var newnode = editor.hierarchyTree.getNode(editor.editor3DData.selectedObject);
                    if (newnode) {
                        newnode.selected = true;
                        var parentNode = newnode.parent;
                        while (parentNode) {
                            parentNode.isOpen = true;
                            parentNode = parentNode.parent;
                        }
                    }
                    //新增选中效果
                    var wireframeComponent = editor.editor3DData.selectedObject.getComponent(feng3d.WireframeComponent);
                    if (!wireframeComponent)
                        editor.editor3DData.selectedObject.addComponent(feng3d.WireframeComponent);
                }
            }
            onAddButtonClick() {
                var globalPoint = this.addButton.localToGlobal(0, 0);
                editor.menu.popup(editor.createObjectConfig, globalPoint.x, globalPoint.y);
            }
        }
        editor.HierarchyView = HierarchyView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.assets = {
            //attribute
            /**
             * 项目根路径
             */
            projectPath: "",
            assetsPath: "",
            showFloder: "",
            rootfileinfo: null,
            //function
            initproject: initproject,
            getFileInfo: getFileInfo,
            deletefile: deletefile,
            addfile: addfile,
            addfolder: addfolder,
            rename: rename,
            move: move,
            getparentdir: getparentdir,
            popupmenu: popupmenu,
            getnewpath: getnewpath,
            saveGameObject: saveGameObject,
            saveObject: saveObject,
        };
        function initproject(path, callback) {
            var assetsPath = path + "/Assets";
            editor.file.mkdir(assetsPath, (err) => {
                editor.file.detailStat(assetsPath, Number.MAX_VALUE, (err, fileInfo) => {
                    editor.assets.projectPath = path;
                    editor.assets.assetsPath = assetsPath;
                    //
                    editor.assets.rootfileinfo = fileInfo;
                    editor.assets.showFloder = fileInfo.path;
                    editor.treeMap(fileInfo, (node, parent) => {
                        fileInfo.children && fileInfo.children.sort(fileinfocompare);
                    });
                    editor.assetstree.init(fileInfo);
                    callback();
                });
            });
        }
        function getFileInfo(path, fileinfo = null) {
            fileinfo = fileinfo || editor.assets.rootfileinfo;
            if (path == fileinfo.path)
                return fileinfo;
            if (path.indexOf(fileinfo.path) == -1)
                return null;
            if (fileinfo.children) {
                for (var i = 0; i < fileinfo.children.length; i++) {
                    var result = getFileInfo(path, fileinfo.children[i]);
                    if (result)
                        return result;
                }
            }
            return null;
        }
        function deletefile(path) {
            if (path == editor.assets.assetsPath) {
                alert("无法删除根目录");
                return;
            }
            editor.file.remove(path, (err) => {
                deletefileinfo(path);
            });
            if (/\.ts\b/.test(path)) {
                deletefile(path.replace(/\.ts\b/, ".js"));
                deletefile(path.replace(/\.ts\b/, ".js.map"));
            }
        }
        function deletefileinfo(path) {
            var paths = path.split("/");
            paths.pop();
            var parentdir = paths.join("/");
            var parentfileinfo = getFileInfo(parentdir);
            if (!parentfileinfo.children)
                return;
            for (var i = parentfileinfo.children.length - 1; i >= 0; i--) {
                var element = parentfileinfo.children[i];
                if (element.path == path) {
                    parentfileinfo.children.splice(i, 1);
                    if (element.isDirectory) {
                        editor.assetstree.remove(element.path);
                    }
                }
            }
            if (path == editor.assets.showFloder)
                editor.assets.showFloder = getparentdir(path);
            editor.editorui.assetsview.updateShowFloder();
        }
        function addfileinfo(fileinfo) {
            fileinfo.children = fileinfo.children || [];
            //
            var parentdir = editor.assets.getparentdir(fileinfo.path);
            var parentfileinfo = getFileInfo(parentdir);
            parentfileinfo.children = parentfileinfo.children || [];
            //
            var has = parentfileinfo.children.reduce((value, a) => { return value || a.path == fileinfo.path; }, false);
            if (!has) {
                parentfileinfo.children.push(fileinfo);
                parentfileinfo.children.sort(fileinfocompare);
                if (fileinfo.isDirectory) {
                    editor.assetstree.add(fileinfo);
                }
            }
            editor.editorui.assetsview.updateShowFloder();
        }
        function addfile(path, content, newfile = true) {
            if (newfile) {
                editor.assets.getnewpath(path, (path) => {
                    addfile(path, content, false);
                });
                return;
            }
            editor.file.writeFile(path, content, (e) => {
                editor.file.stat(path, (err, stats) => {
                    addfileinfo(stats);
                });
            });
        }
        function addfolder(folder, newfile = true) {
            if (newfile) {
                editor.assets.getnewpath(folder, (path) => {
                    addfolder(path, false);
                });
                return;
            }
            editor.file.mkdir(folder, (e) => {
                editor.file.stat(folder, (err, stats) => {
                    addfileinfo(stats);
                });
            });
        }
        function getparentdir(path) {
            var paths = path.split("/");
            paths.pop();
            var parentdir = paths.join("/");
            return parentdir;
        }
        function popupmenu(fileinfo) {
            var folderpath = editor.assets.getparentdir(fileinfo.path);
            if (fileinfo.isDirectory)
                folderpath = fileinfo.path;
            var menuconfig = [
                {
                    label: "create folder", click: () => {
                        editor.assets.addfolder(folderpath + "/" + "New Folder");
                    }
                },
                {
                    label: "create script", click: () => {
                        editor.file.readFile("feng3d-editor/template/templates/NewScript.ts", (err, data) => {
                            editor.assets.addfile(folderpath + "/NewScript.ts", data);
                        });
                    }
                },
                {
                    label: "create json", click: () => {
                        editor.assets.addfile(folderpath + "/new json.json", "{}");
                    }
                },
                {
                    label: "create txt", click: () => {
                        editor.assets.addfile(folderpath + "/new text.txt", "");
                    }
                },
                { type: "separator" },
                {
                    label: "导入模型", click: () => {
                        editor.electron.call("selected-file", {
                            callback: (path) => {
                                if (!path)
                                    return;
                                path = path.replace(/\\/g, "/");
                                var extensions = path.split(".").pop();
                                switch (extensions) {
                                    case "mdl":
                                        feng3d.Loader.loadText(path, (content) => {
                                            feng3d.war3.MdlParser.parse(content, (war3Model) => {
                                                war3Model.root = path.substring(0, path.lastIndexOf("/") + 1);
                                                var gameobject = war3Model.getMesh();
                                                gameobject.name = path.split("/").pop().split(".").shift();
                                                saveGameObject(gameobject);
                                            });
                                        });
                                        break;
                                    case "obj":
                                        feng3d.ObjLoader.load(path, new feng3d.StandardMaterial(), function (gameobject) {
                                            gameobject.name = path.split("/").pop().split(".").shift();
                                            saveGameObject(gameobject);
                                        });
                                        break;
                                    case "fbx":
                                        // fbxLoader.load(path, (gameobject) =>
                                        // {
                                        //     gameobject.name = path.split("/").pop().split(".").shift();
                                        //     saveGameObject(gameobject);
                                        //     // engine.root.addChild(gameobject);
                                        // });
                                        editor.threejsLoader.load(path, (gameobject) => {
                                            gameobject.name = path.split("/").pop().split(".").shift();
                                            saveGameObject(gameobject);
                                            // engine.root.addChild(gameobject);
                                        });
                                        break;
                                    case "md5mesh":
                                        feng3d.MD5Loader.load(path, (gameobject) => {
                                            gameobject.name = path.split("/").pop().split(".").shift();
                                            saveGameObject(gameobject);
                                            // engine.root.addChild(gameobject);
                                        });
                                        break;
                                    case "md5anim":
                                        feng3d.MD5Loader.loadAnim(path, (animationclip) => {
                                            animationclip.name = path.split("/").pop().split(".").shift();
                                            var obj = feng3d.serialization.serialize(animationclip);
                                            editor.assets.saveObject(obj, animationclip.name + ".anim");
                                        });
                                        break;
                                }
                            }, param: { name: '模型文件', extensions: ["obj", 'mdl', 'fbx', "md5mesh", 'md5anim'] }
                        });
                    }
                },
                { type: "separator" },
                {
                    label: "delete", click: () => {
                        editor.assets.deletefile(fileinfo.path);
                    }
                }
            ];
            //判断是否为本地应用
            if (editor.shell) {
                menuconfig.splice(0, 0, {
                    label: "open folder", click: () => {
                        editor.shell.showItemInFolder(folderpath + "/.");
                    }
                });
            }
            editor.menu.popup(menuconfig);
        }
        /**
         * 获取一个新路径
         */
        function getnewpath(path, callback) {
            var index = 0;
            var basepath = "";
            var ext = "";
            if (path.indexOf(".") == -1) {
                basepath = path;
                ext = "";
            }
            else {
                basepath = path.substring(0, path.indexOf("."));
                ext = path.substring(path.indexOf("."));
            }
            searchnewpath();
            function newpath() {
                var path = index == 0 ?
                    (basepath + ext) :
                    (basepath + " " + index + ext);
                index++;
                return path;
            }
            function searchnewpath() {
                var path = newpath();
                editor.file.stat(path, (err, stats) => {
                    if (err)
                        callback(path);
                    else {
                        searchnewpath();
                    }
                });
            }
        }
        function rename(oldPath, newPath, callback) {
            editor.file.rename(oldPath, newPath, (err) => {
                if (err)
                    return;
                var fileinfo = getFileInfo(oldPath);
                deletefileinfo(oldPath);
                fileinfo.path = newPath;
                addfileinfo(fileinfo);
                if (fileinfo.isDirectory)
                    editor.editorui.assetsview.updateAssetsTree();
                if (editor.assets.showFloder == oldPath) {
                    editor.assets.showFloder = newPath;
                }
                callback && callback();
            });
        }
        function move(src, dest, callback) {
            if (dest.indexOf(src) != -1)
                return;
            editor.file.move(src, dest, (err) => {
                var fileinfo = getFileInfo(src);
                deletefileinfo(src);
                fileinfo.path = dest;
                addfileinfo(fileinfo);
                if (fileinfo.isDirectory)
                    editor.editorui.assetsview.updateAssetsTree();
                if (editor.assets.showFloder == src) {
                    editor.assets.showFloder = dest;
                }
                callback && callback(err);
            });
        }
        function fileinfocompare(a, b) {
            if (a.isDirectory > b.isDirectory)
                return -1;
            if (a.isDirectory < b.isDirectory)
                return 1;
            if (a.path < b.path)
                return -1;
            return 1;
        }
        function saveGameObject(gameobject) {
            var obj = feng3d.serialization.serialize(gameobject);
            var output = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            editor.assets.addfile(editor.assets.showFloder + "/" + gameobject.name + ".gameobject", output);
        }
        function saveObject(object, filename) {
            var output = JSON.stringify(object, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            editor.assets.addfile(editor.assets.showFloder + "/" + filename, output);
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class AssetsFileNode {
            constructor(fileinfo) {
                this.image = "resource/assets/icons/json.png";
                this.name = "文件名称";
                this.selected = false;
                if (fileinfo.isDirectory) {
                    this.image = "folder_png";
                }
                else if (/(.jpg|.png)\b/.test(fileinfo.path)) {
                    this.image = fileinfo.path;
                }
                else {
                    var filename = fileinfo.path.split("/").pop();
                    var extension = filename.split(".").pop();
                    if (RES.getRes(extension + "_png")) {
                        this.image = extension + "_png";
                    }
                    else {
                        this.image = "file_png";
                    }
                }
                this.fileinfo = fileinfo;
                this.name = fileinfo.path.split("/").pop().split(".").shift();
            }
        }
        editor.AssetsFileNode = AssetsFileNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var assetsTreeNodeMap = {};
        class AssetsTree extends editor.Tree {
            init(fileinfo) {
                var node = assetsTreeNodeMap[fileinfo.path] = { isOpen: true, fileinfo: fileinfo, label: fileinfo.path.split("/").pop(), children: [] };
                this.rootnode = node;
                //
                editor.treeMap(fileinfo, (node, parent) => {
                    this.add(node);
                });
            }
            getAssetsTreeNode(path) {
                return assetsTreeNodeMap[path];
            }
            remove(path) {
                var assetsTreeNode = assetsTreeNodeMap[path];
                if (assetsTreeNode)
                    this.removeNode(assetsTreeNode);
                delete assetsTreeNodeMap[path];
            }
            add(fileinfo) {
                if (!fileinfo.isDirectory)
                    return;
                if (assetsTreeNodeMap[fileinfo.path])
                    return;
                var parentdir = editor.assets.getparentdir(fileinfo.path);
                var parentassetsTreeNode = this.getAssetsTreeNode(parentdir);
                //   
                var node = assetsTreeNodeMap[fileinfo.path] = { isOpen: true, fileinfo: fileinfo, label: fileinfo.path.split("/").pop(), children: [] };
                this.addNode(node, parentassetsTreeNode);
                parentassetsTreeNode.children.sort((a, b) => { return a.label < b.label ? -1 : 1; });
            }
            getNode(path) {
                return assetsTreeNodeMap[path];
            }
        }
        editor.AssetsTree = AssetsTree;
        editor.assetstree = new AssetsTree();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class AssetsFileItemRenderer extends eui.ItemRenderer {
            constructor() {
                super();
                this.skinName = "AssetsFileItemRenderer";
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.addEventListener(editor.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
                this.addEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.nameLabel.addEventListener(editor.MouseEvent.CLICK, this.onnameLabelclick, this);
                this.nameeditTxt.textDisplay.textAlign = egret.HorizontalAlign.CENTER;
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.removeEventListener(editor.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
                this.removeEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.nameLabel.removeEventListener(editor.MouseEvent.CLICK, this.onnameLabelclick, this);
            }
            dataChanged() {
                super.dataChanged();
                if (this.data) {
                    var accepttypes = [];
                    if (this.data.fileinfo.isDirectory) {
                        editor.drag.register(this, (dragsource) => {
                            if (this.data.fileinfo.path.split(".").pop() == "gameobject") {
                                dragsource.file_gameobject = this.data.fileinfo.path;
                            }
                            dragsource.file = this.data.fileinfo.path;
                        }, ["file"], (dragdata) => {
                            var filepath = dragdata.file;
                            var dest = this.data.fileinfo.path + "/" + filepath.split("/").pop();
                            editor.assets.move(filepath, dest);
                        });
                    }
                    else {
                        editor.drag.register(this, (dragsource) => {
                            var extension = this.data.fileinfo.path.split(".").pop();
                            if (extension == "gameobject") {
                                dragsource.file_gameobject = this.data.fileinfo.path;
                            }
                            if (extension == "ts") {
                                dragsource.file_script = this.data.fileinfo.path;
                            }
                            if (extension == "anim") {
                                var path = this.data.fileinfo.path;
                                feng3d.Loader.loadText(path, (content) => {
                                    var animationclip = feng3d.serialization.deserialize(JSON.parse(content));
                                    dragsource.animationclip = animationclip;
                                    editor.drag.refreshAcceptables();
                                });
                            }
                            dragsource.file = this.data.fileinfo.path;
                        }, []);
                    }
                }
                else {
                    editor.drag.unregister(this);
                }
            }
            ondoubleclick() {
                if (this.data.fileinfo.isDirectory) {
                    editor.assets.showFloder = this.data.fileinfo.path;
                }
            }
            onclick() {
                editor.editor3DData.selectedObject = this.data.fileinfo;
            }
            onrightclick(e) {
                e.stopPropagation();
                editor.assets.popupmenu(this.data.fileinfo);
            }
            onnameLabelclick() {
                if (this.data.selected) {
                    this.nameeditTxt.text = this.nameLabel.text;
                    this.nameLabel.visible = false;
                    this.nameeditTxt.visible = true;
                    this.nameeditTxt.textDisplay.setFocus();
                    this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                }
            }
            onnameeditend() {
                this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                this.nameeditTxt.visible = false;
                this.nameLabel.visible = true;
                if (this.nameLabel.text == this.nameeditTxt.text)
                    return;
                var newpath = this.data.fileinfo.path.replace(this.nameLabel.text, this.nameeditTxt.text);
                editor.assets.rename(this.data.fileinfo.path, newpath);
            }
        }
        editor.AssetsFileItemRenderer = AssetsFileItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class AssetsTreeItemRenderer extends editor.TreeItemRenderer {
            constructor() {
                super();
                this.skinName = "AssetsTreeItemRenderer";
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.addEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.namelabel.addEventListener(editor.MouseEvent.CLICK, this.onnameLabelclick, this);
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.removeEventListener(editor.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(editor.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.namelabel.removeEventListener(editor.MouseEvent.CLICK, this.onnameLabelclick, this);
            }
            dataChanged() {
                super.dataChanged();
                if (this.data) {
                    var accepttypes = [];
                    editor.drag.register(this, (dragsource) => {
                        dragsource.file = this.data.fileinfo.path;
                    }, ["file"], (dragdata) => {
                        var filepath = dragdata.file;
                        var dest = this.data.fileinfo.path + "/" + filepath.split("/").pop();
                        editor.assets.move(filepath, dest);
                    });
                }
                else {
                    editor.drag.unregister(this);
                }
            }
            onclick() {
                editor.assets.showFloder = this.data.fileinfo.path;
            }
            onrightclick(e) {
                editor.assets.popupmenu(this.data.fileinfo);
            }
            onnameLabelclick() {
                if (this.data == editor.assetstree.rootnode)
                    return;
                if (this.data.selected && !feng3d.input.rightmouse) {
                    this.nameeditTxt.text = this.namelabel.text;
                    this.namelabel.visible = false;
                    this.nameeditTxt.visible = true;
                    this.nameeditTxt.textDisplay.setFocus();
                    this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                }
            }
            onnameeditend() {
                this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                this.nameeditTxt.visible = false;
                this.namelabel.visible = true;
                if (this.nameeditTxt.text == this.namelabel.text)
                    return;
                var newpath = this.data.fileinfo.path.replace(this.namelabel.text, this.nameeditTxt.text);
                editor.assets.rename(this.data.fileinfo.path, newpath);
            }
        }
        editor.AssetsTreeItemRenderer = AssetsTreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class AssetsView extends eui.Component {
            constructor() {
                super();
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "AssetsView";
                editor.editorui.assetsview = this;
            }
            onComplete() {
                this.treelist.itemRenderer = editor.AssetsTreeItemRenderer;
                this.filelist.itemRenderer = editor.AssetsFileItemRenderer;
                this.listData = this.treelist.dataProvider = new eui.ArrayCollection();
                this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
            }
            $onAddToStage(stage, nestLevel) {
                super.$onAddToStage(stage, nestLevel);
                this.filelist.addEventListener(editor.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
                this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.floderpathTxt.touchEnabled = true;
                this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
                feng3d.watcher.watch(editor.assets, "showFloder", this.updateShowFloder, this);
                feng3d.watcher.watch(editor.editor3DData, "selectedObject", this.selectedfilechanged, this);
                editor.assetstree.on("changed", this.updateAssetsView, this);
                editor.assetstree.on("openChanged", this.updateAssetsTree, this);
                this.excludeTxt.text = "(\\.d\\.ts|\\.js\\.map|\\.js)\\b";
                //
                editor.drag.register(this.filelistgroup, (dragsource) => { }, ["gameobject", "animationclip"], (dragSource) => {
                    if (dragSource.gameobject) {
                        var gameObject = dragSource.gameobject;
                        editor.assets.saveGameObject(gameObject);
                    }
                    if (dragSource.animationclip) {
                        var animationclip = dragSource.animationclip;
                        var obj = feng3d.serialization.serialize(animationclip);
                        editor.assets.saveObject(obj, animationclip.name + ".anim");
                    }
                });
                this.initlist();
            }
            $onRemoveFromStage() {
                super.$onRemoveFromStage();
                this.filelist.removeEventListener(editor.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
                this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
                feng3d.watcher.unwatch(editor.assets, "showFloder", this.updateShowFloder, this);
                feng3d.watcher.unwatch(editor.editor3DData, "selectedObject", this.selectedfilechanged, this);
                editor.assetstree.off("changed", this.updateAssetsView, this);
                editor.assetstree.off("openChanged", this.updateAssetsTree, this);
                //
                editor.drag.unregister(this.filelistgroup);
            }
            initlist() {
                editor.assets.initproject(editor.assets.projectPath, () => {
                    this.updateAssetsView();
                });
            }
            updateAssetsView() {
                this.updateAssetsTree();
                this.updateShowFloder();
            }
            updateAssetsTree() {
                var nodes = editor.assetstree.getShowNodes();
                this.listData.replaceAll(nodes);
            }
            updateShowFloder(host, property, oldvalue) {
                if (oldvalue) {
                    var oldnode = editor.assetstree.getAssetsTreeNode(oldvalue);
                    if (oldnode) {
                        oldnode.selected = false;
                    }
                }
                if (editor.assets.showFloder) {
                    var newnode = editor.assetstree.getAssetsTreeNode(editor.assets.showFloder);
                    if (newnode) {
                        newnode.selected = true;
                    }
                }
                var floders = editor.assets.showFloder.split("/");
                var textFlow = new Array();
                do {
                    var path = floders.join("/");
                    if (textFlow.length > 0)
                        textFlow.unshift({ text: " > " });
                    textFlow.unshift({ text: floders.pop(), style: { "href": `event:${path}` } });
                    if (path == editor.assets.assetsPath)
                        break;
                } while (floders.length > 0);
                this.floderpathTxt.textFlow = textFlow;
                var fileinfo = editor.assets.getFileInfo(editor.assets.showFloder);
                if (fileinfo) {
                    try {
                        var excludeReg = new RegExp(this.excludeTxt.text);
                    }
                    catch (error) {
                        excludeReg = new RegExp("");
                    }
                    try {
                        var includeReg = new RegExp(this.includeTxt.text);
                    }
                    catch (error) {
                        includeReg = new RegExp("");
                    }
                    var fileinfos = fileinfo.children.filter((value) => {
                        if (this.includeTxt.text) {
                            if (!includeReg.test(value.path))
                                return false;
                        }
                        if (this.excludeTxt.text) {
                            if (excludeReg.test(value.path))
                                return false;
                        }
                        return true;
                    });
                    var nodes = fileinfos.map((value) => { return new editor.AssetsFileNode(value); });
                    this.filelistData.replaceAll(nodes);
                }
                this.selectedfilechanged();
            }
            onfilter() {
                this.updateShowFloder();
            }
            selectedfilechanged() {
                this.filelistData.source.forEach(element => {
                    element.selected = element.fileinfo == editor.editor3DData.selectedObject;
                });
            }
            onfilelistrightclick() {
                var fileinfo = editor.assets.getFileInfo(editor.assets.showFloder);
                if (fileinfo) {
                    editor.assets.popupmenu(fileinfo);
                }
            }
            onfloderpathTxtLink(evt) {
                editor.assets.showFloder = evt.text;
            }
        }
        editor.AssetsView = AssetsView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class MainView extends eui.Component {
            constructor() {
                super();
                this.watchers = [];
                this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
                this.skinName = "MainViewSkin";
            }
            onComplete() {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            }
            onAddedToStage() {
                this.moveButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.addEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.addEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.watchers.push(eui.Watcher.watch(editor.editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this));
            }
            onRemovedFromStage() {
                this.moveButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.removeEventListener(editor.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.removeEventListener(editor.MouseEvent.CLICK, this.onHelpButtonClick, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
            }
            onMainMenu(item) {
                editor.$editorEventDispatcher.dispatch(item.command);
            }
            onHelpButtonClick() {
                window.open("index.md");
            }
            onButtonClick(event) {
                switch (event.currentTarget) {
                    case this.moveButton:
                        editor.editor3DData.object3DOperationID = 0;
                        break;
                    case this.rotateButton:
                        editor.editor3DData.object3DOperationID = 1;
                        break;
                    case this.scaleButton:
                        editor.editor3DData.object3DOperationID = 2;
                        break;
                }
            }
            onObject3DOperationIDChange() {
                this.moveButton.selected = editor.editor3DData.object3DOperationID == 0;
                this.rotateButton.selected = editor.editor3DData.object3DOperationID == 1;
                this.scaleButton.selected = editor.editor3DData.object3DOperationID == 2;
            }
        }
        editor.MainView = MainView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class AssetAdapter {
            /**
             * @language zh_CN
             * 解析素材
             * @param source 待解析的新素材标识符
             * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
             * @param thisObject callBack的 this 引用
             */
            getAsset(source, compFunc, thisObject) {
                function onGetRes(data) {
                    compFunc.call(thisObject, data, source);
                }
                if (RES.hasRes(source)) {
                    let data = RES.getRes(source);
                    if (data) {
                        onGetRes(data);
                    }
                    else {
                        RES.getResAsync(source, onGetRes, this);
                    }
                }
                else {
                    RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
                }
            }
        }
        editor.AssetAdapter = AssetAdapter;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class LoadingUI extends egret.Sprite {
            constructor() {
                super();
                this.createView();
            }
            createView() {
                this.textField = new egret.TextField();
                this.addChild(this.textField);
                this.textField.y = 300;
                this.textField.width = 480;
                this.textField.height = 100;
                this.textField.textAlign = "center";
            }
            setProgress(current, total) {
                this.textField.text = `Loading...${current}/${total}`;
            }
        }
        editor.LoadingUI = LoadingUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class MainUI extends eui.UILayer {
            constructor() {
                super(...arguments);
                this.isThemeLoadEnd = false;
                this.isResourceLoadEnd = false;
            }
            createChildren() {
                super.createChildren();
                //inject the custom material parser
                //注入自定义的素材解析器
                let assetAdapter = new editor.AssetAdapter();
                egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
                egret.registerImplementation("eui.IThemeAdapter", new editor.ThemeAdapter());
                //Config loading process interface
                //设置加载进度界面
                this.loadingView = new editor.LoadingUI();
                this.stage.addChild(this.loadingView);
                // initialize the Resource loading library
                //初始化Resource资源加载库
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                RES.loadConfig("resource/default.res.json", "resource/");
            }
            /**
             * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
             * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
             */
            onConfigComplete(event) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                let theme = new eui.Theme("resource/default.thm.json", this.stage);
                theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                RES.loadGroup("preload");
            }
            /**
             * 主题文件加载完成,开始预加载
             * Loading of theme configuration file is complete, start to pre-load the
             */
            onThemeLoadComplete() {
                this.isThemeLoadEnd = true;
                this.createScene();
            }
            /**
             * preload资源组加载完成
             * preload resource group is loaded
             */
            onResourceLoadComplete(event) {
                if (event.groupName == "preload") {
                    this.stage.removeChild(this.loadingView);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                    this.isResourceLoadEnd = true;
                    this.createScene();
                }
            }
            createScene() {
                if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
                    editor.editorui.stage = this.stage;
                    //
                    this.mainView = new editor.MainView();
                    this.stage.addChild(this.mainView);
                    this.onresize();
                    window.onresize = this.onresize.bind(this);
                    editor.editorui.mainview = this.mainView;
                    //
                    var maskLayer = new eui.UILayer();
                    maskLayer.touchEnabled = false;
                    this.stage.addChild(maskLayer);
                    editor.editorui.maskLayer = maskLayer;
                    //
                    var popupLayer = new eui.UILayer();
                    popupLayer.touchEnabled = false;
                    this.stage.addChild(popupLayer);
                    editor.editorui.popupLayer = popupLayer;
                }
            }
            onresize() {
                this.stage.setContentSize(window.innerWidth, window.innerHeight);
                this.mainView.width = this.stage.stageWidth;
                this.mainView.height = this.stage.stageHeight;
            }
            /**
             * 资源组加载出错
             *  The resource group loading failed
             */
            onItemLoadError(event) {
                console.warn("Url:" + event.resItem.url + " has failed to load");
            }
            /**
             * 资源组加载出错
             * Resource group loading failed
             */
            onResourceLoadError(event) {
                //TODO
                console.warn("Group:" + event.groupName + " has failed to load");
                //忽略加载失败的项目
                //ignore loading failed projects
                this.onResourceLoadComplete(event);
            }
            /**
             * preload资源组加载进度
             * loading process of preload resource
             */
            onResourceProgress(event) {
                if (event.groupName == "preload") {
                    this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                }
            }
        }
        editor.MainUI = MainUI;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class ThemeAdapter {
            /**
             * 解析主题
             * @param url 待解析的主题url
             * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
             * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
             * @param thisObject 回调的this引用
             */
            getTheme(url, compFunc, errorFunc, thisObject) {
                function onGetRes(e) {
                    compFunc.call(thisObject, e);
                }
                function onError(e) {
                    if (e.resItem.url == url) {
                        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                        errorFunc.call(thisObject);
                    }
                }
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
            }
        }
        editor.ThemeAdapter = ThemeAdapter;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.editorui = {};
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Editor3DData {
            constructor() {
                this.object3DOperationID = 0;
                this.inspectorViewData = new editor.InspectorViewData(this);
            }
        }
        editor.Editor3DData = Editor3DData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Editor3DEvent extends feng3d.Event {
        }
        editor.Editor3DEvent = Editor3DEvent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DControllerTarget {
            constructor() {
                this._startScaleVec = [];
                this._isWoldCoordinate = false;
                this._isBaryCenter = false;
                this._controllerToolTransfrom = feng3d.GameObject.create("controllerToolTransfrom").transform;
            }
            static get instance() {
                return this._instance || (this._instance = new Object3DControllerTarget());
            }
            //
            get showObject3D() {
                return this._showObject3D;
            }
            set showObject3D(value) {
                if (this._showObject3D)
                    this._showObject3D.gameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
                this._showObject3D = value;
                if (this._showObject3D)
                    this._showObject3D.gameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
            }
            get controllerTool() {
                return this._controllerTool;
            }
            set controllerTool(value) {
                this._controllerTool = value;
                if (this._controllerTool) {
                    this._controllerTool.position = this._controllerToolTransfrom.position;
                    this._controllerTool.rotation = this._controllerToolTransfrom.rotation;
                }
            }
            set controllerTargets(value) {
                if (this._controllerTargets && this._controllerTargets.length > 0) {
                    this.showObject3D = null;
                }
                this._controllerTargets = value;
                if (this._controllerTargets && this._controllerTargets.length > 0) {
                    this.showObject3D = this._controllerTargets[0];
                    this.updateControllerImage();
                }
            }
            onShowObjectTransformChanged(event) {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    if (this._controllerTargets[i] != this._showObject3D) {
                        this._controllerTargets[i].position = this._showObject3D.position;
                        this._controllerTargets[i].rotation = this._showObject3D.rotation;
                        this._controllerTargets[i].scale = this._showObject3D.scale;
                    }
                }
                this.updateControllerImage();
            }
            updateControllerImage() {
                var object3D = this._controllerTargets[0];
                var position = new feng3d.Vector3D();
                if (this._isBaryCenter) {
                    position.copyFrom(object3D.scenePosition);
                }
                else {
                    for (var i = 0; i < this._controllerTargets.length; i++) {
                        position.incrementBy(this._controllerTargets[i].scenePosition);
                    }
                    position.scaleBy(1 / this._controllerTargets.length);
                }
                var rotation = new feng3d.Vector3D();
                if (this._isWoldCoordinate) {
                    rotation = this._showObject3D.rotation;
                }
                this._controllerToolTransfrom.position = position;
                this._controllerToolTransfrom.rotation = rotation;
                if (this._controllerTool) {
                    this._controllerTool.position = position;
                    this._controllerTool.rotation = rotation;
                }
            }
            /**
             * 开始移动
             */
            startTranslation() {
                this._startTransformDic = new feng3d.Map();
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    this._startTransformDic.push(object3d, { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale });
                }
            }
            translation(addPos) {
                if (!this._controllerTargets)
                    return;
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    var transform = this._startTransformDic.get(object3d);
                    var localMove = addPos.clone();
                    if (object3d.parent)
                        localMove = object3d.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                    object3d.position = transform.position.add(localMove);
                }
            }
            stopTranslation() {
                this._startTransformDic = null;
            }
            startRotate() {
                this._startTransformDic = new feng3d.Map();
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var object3d = objects[i];
                    this._startTransformDic.push(object3d, { position: object3d.position, rotation: object3d.rotation, scale: object3d.scale });
                }
            }
            /**
             * 绕指定轴旋转
             * @param angle 旋转角度
             * @param normal 旋转轴
             */
            rotate1(angle, normal) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var localnormal;
                var object3d = objects[0];
                if (!this._isWoldCoordinate && this._isBaryCenter) {
                    if (object3d.parent)
                        localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal);
                }
                for (var i = 0; i < objects.length; i++) {
                    object3d = objects[i];
                    var tempTransform = this._startTransformDic.get(object3d);
                    if (!this._isWoldCoordinate && this._isBaryCenter) {
                        object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        localnormal = normal.clone();
                        if (object3d.parent)
                            localnormal = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                        if (this._isBaryCenter) {
                            object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (object3d.parent)
                                localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            object3d.position = feng3d.Matrix3D.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                            object3d.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                        }
                    }
                }
            }
            /**
             * 按指定角旋转
             * @param angle1 第一方向旋转角度
             * @param normal1 第一方向旋转轴
             * @param angle2 第二方向旋转角度
             * @param normal2 第二方向旋转轴
             */
            rotate2(angle1, normal1, angle2, normal2) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var object3d = objects[0];
                if (!this._isWoldCoordinate && this._isBaryCenter) {
                    if (object3d.parent) {
                        normal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                        normal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                    }
                }
                for (var i = 0; i < objects.length; i++) {
                    object3d = objects[i];
                    var tempsceneTransform = this._startTransformDic.get(object3d);
                    var tempPosition = tempsceneTransform.position.clone();
                    var tempRotation = tempsceneTransform.rotation.clone();
                    if (!this._isWoldCoordinate && this._isBaryCenter) {
                        tempRotation = rotateRotation(tempRotation, normal2, angle2);
                        object3d.rotation = rotateRotation(tempRotation, normal1, angle1);
                    }
                    else {
                        var localnormal1 = normal1.clone();
                        var localnormal2 = normal2.clone();
                        if (object3d.parent) {
                            localnormal1 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                            localnormal2 = object3d.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                        }
                        if (this._isBaryCenter) {
                            tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                            object3d.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (object3d.parent)
                                localPivotPoint = object3d.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            //
                            tempPosition = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            object3d.position = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                            object3d.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                        }
                    }
                }
            }
            stopRote() {
                this._startTransformDic = null;
            }
            startScale() {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this._startScaleVec[i] = this._controllerTargets[i].scale;
                }
            }
            doScale(scale) {
                feng3d.debuger && console.assert(!!scale.length);
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    var result = this._startScaleVec[i].multiply(scale);
                    this._controllerTargets[i].sx = result.x;
                    this._controllerTargets[i].sy = result.y;
                    this._controllerTargets[i].sz = result.z;
                }
            }
            stopScale() {
                this._startScaleVec.length = 0;
            }
        }
        editor.Object3DControllerTarget = Object3DControllerTarget;
        function rotateRotation(rotation, axis, angle) {
            var rotationmatrix3d = new feng3d.Matrix3D();
            rotationmatrix3d.appendRotation(feng3d.Vector3D.X_AXIS, rotation.x);
            rotationmatrix3d.appendRotation(feng3d.Vector3D.Y_AXIS, rotation.y);
            rotationmatrix3d.appendRotation(feng3d.Vector3D.Z_AXIS, rotation.z);
            rotationmatrix3d.appendRotation(axis, angle);
            var newrotation = rotationmatrix3d.decompose()[1];
            newrotation.scaleBy(180 / Math.PI);
            var v = Math.round((newrotation.x - rotation.x) / 180);
            if (v % 2 != 0) {
                newrotation.x += 180;
                newrotation.y = 180 - newrotation.y;
                newrotation.z += 180;
            }
            function toround(a, b, c = 360) {
                return Math.round((b - a) / c) * c + a;
            }
            newrotation.x = toround(newrotation.x, rotation.x);
            newrotation.y = toround(newrotation.y, rotation.y);
            newrotation.z = toround(newrotation.z, rotation.z);
            return newrotation;
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DMoveModel extends feng3d.Component {
            init(gameObject) {
                super.init(gameObject);
                this.gameObject.name = "Object3DMoveModel";
                this.initModels();
            }
            initModels() {
                this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateAxis);
                this.xAxis.color.setTo(1, 0, 0);
                this.xAxis.transform.rz = -90;
                this.gameObject.addChild(this.xAxis.gameObject);
                this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.gameObject.addChild(this.yAxis.gameObject);
                this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateAxis);
                this.zAxis.color.setTo(0, 0, 1);
                this.zAxis.transform.rx = 90;
                this.gameObject.addChild(this.zAxis.gameObject);
                this.yzPlane = feng3d.GameObject.create("yzPlane").addComponent(CoordinatePlane);
                this.yzPlane.color.setTo(1, 0, 0, 0.2);
                this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
                this.yzPlane.borderColor.setTo(1, 0, 0);
                this.yzPlane.transform.rz = 90;
                this.gameObject.addChild(this.yzPlane.gameObject);
                this.xzPlane = feng3d.GameObject.create("xzPlane").addComponent(CoordinatePlane);
                this.xzPlane.color.setTo(0, 1, 0, 0.2);
                this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
                this.xzPlane.borderColor.setTo(0, 1, 0);
                this.gameObject.addChild(this.xzPlane.gameObject);
                this.xyPlane = feng3d.GameObject.create("xyPlane").addComponent(CoordinatePlane);
                this.xyPlane.color.setTo(0, 0, 1, 0.2);
                this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
                this.xyPlane.borderColor.setTo(0, 0, 1);
                this.xyPlane.transform.rx = -90;
                this.gameObject.addChild(this.xyPlane.gameObject);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
                this.gameObject.addChild(this.oCube.gameObject);
            }
        }
        editor.Object3DMoveModel = Object3DMoveModel;
        class CoordinateAxis extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.color = new feng3d.Color(1, 0, 0, 0.99);
                this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                this.length = 100;
                this._selected = false;
            }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                var xLine = feng3d.GameObject.create();
                var meshRenderer = xLine.addComponent(feng3d.MeshRenderer);
                var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, this.length, 0));
                segmentGeometry.addSegment(segment);
                this.segmentMaterial = meshRenderer.material = new feng3d.SegmentMaterial();
                this.gameObject.addChild(xLine);
                //
                this.xArrow = feng3d.GameObject.create();
                meshRenderer = this.xArrow.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.ConeGeometry(5, 18);
                this.material = meshRenderer.material = new feng3d.ColorMaterial();
                this.xArrow.transform.y = this.length;
                this.xArrow.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(this.xArrow);
                this.update();
                var mouseHit = feng3d.GameObject.create("hitCoordinateAxis");
                meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.CylinderGeometry(5, 5, this.length);
                //meshRenderer.material = new ColorMaterial();
                mouseHit.transform.y = 20 + (this.length - 20) / 2;
                mouseHit.visible = false;
                mouseHit.mouseEnabled = true;
                mouseHit.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(mouseHit);
            }
            update() {
                this.segmentMaterial.color = this.selected ? this.selectedColor : this.color;
                //
                this.material.color = this.selected ? this.selectedColor : this.color;
            }
        }
        editor.CoordinateAxis = CoordinateAxis;
        class CoordinateCube extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.color = new feng3d.Color(1, 1, 1, 0.99);
                this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                this._selected = false;
            }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                //
                this.oCube = feng3d.GameObject.create();
                var meshRenderer = this.oCube.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.CubeGeometry(8, 8, 8);
                this.colorMaterial = meshRenderer.material = new feng3d.ColorMaterial();
                this.oCube.mouseEnabled = true;
                this.oCube.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(this.oCube);
                this.update();
            }
            update() {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
            }
        }
        editor.CoordinateCube = CoordinateCube;
        class CoordinatePlane extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.color = new feng3d.Color(1, 0, 0, 0.2);
                this.borderColor = new feng3d.Color(1, 0, 0, 0.99);
                this.selectedColor = new feng3d.Color(1, 0, 0, 0.5);
                this.selectedborderColor = new feng3d.Color(1, 1, 0, 0.99);
                this._width = 20;
                this._selected = false;
            }
            //
            get width() { return this._width; }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                var plane = feng3d.GameObject.create("plane");
                var meshRenderer = plane.addComponent(feng3d.MeshRenderer);
                plane.transform.x = plane.transform.z = this._width / 2;
                meshRenderer.geometry = new feng3d.PlaneGeometry(this._width, this._width);
                this.colorMaterial = meshRenderer.material = new feng3d.ColorMaterial();
                plane.mouselayer = feng3d.mouselayer.editor;
                plane.mouseEnabled = true;
                this.gameObject.addChild(plane);
                var border = feng3d.GameObject.create("border");
                meshRenderer = border.addComponent(feng3d.MeshRenderer);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.gameObject.addChild(border);
                this.update();
            }
            update() {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, 0), new feng3d.Vector3D(this._width, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, 0), new feng3d.Vector3D(this._width, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(this._width, 0, this._width), new feng3d.Vector3D(0, 0, this._width));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(0, 0, this._width), new feng3d.Vector3D(0, 0, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedborderColor : this.borderColor;
                this.segmentGeometry.addSegment(segment);
            }
        }
        editor.CoordinatePlane = CoordinatePlane;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DRotationModel extends feng3d.Component {
            init(gameObject) {
                super.init(gameObject);
                this.gameObject.name = "Object3DRotationModel";
                this.initModels();
            }
            initModels() {
                this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateRotationAxis);
                this.xAxis.color.setTo(1, 0, 0);
                this.xAxis.update();
                this.xAxis.transform.ry = 90;
                this.gameObject.addChild(this.xAxis.gameObject);
                this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateRotationAxis);
                this.yAxis.color.setTo(0, 1, 0);
                this.yAxis.update();
                this.yAxis.transform.rx = 90;
                this.gameObject.addChild(this.yAxis.gameObject);
                this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateRotationAxis);
                this.zAxis.color.setTo(0, 0, 1);
                this.zAxis.update();
                this.gameObject.addChild(this.zAxis.gameObject);
                this.cameraAxis = feng3d.GameObject.create("cameraAxis").addComponent(CoordinateRotationAxis);
                this.cameraAxis.radius = 88;
                this.cameraAxis.color.setTo(1, 1, 1);
                this.cameraAxis.update();
                this.gameObject.addChild(this.cameraAxis.gameObject);
                this.freeAxis = feng3d.GameObject.create("freeAxis").addComponent(CoordinateRotationFreeAxis);
                this.freeAxis.color.setTo(1, 1, 1);
                this.freeAxis.update();
                this.gameObject.addChild(this.freeAxis.gameObject);
            }
        }
        editor.Object3DRotationModel = Object3DRotationModel;
        class CoordinateRotationAxis extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.radius = 80;
                this.color = new feng3d.Color(1, 0, 0, 0.99);
                this.backColor = new feng3d.Color(0.6, 0.6, 0.6, 0.99);
                this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                this._selected = false;
            }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            /**
             * 过滤法线显示某一面线条
             */
            get filterNormal() { return this._filterNormal; }
            set filterNormal(value) { this._filterNormal = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                this.initModels();
            }
            initModels() {
                var border = feng3d.GameObject.create();
                var meshRenderer = border.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                var mouseHit = feng3d.GameObject.create("hit");
                meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
                this.torusGeometry = meshRenderer.geometry = new feng3d.TorusGeometry(this.radius, 2);
                meshRenderer.material = new feng3d.StandardMaterial();
                mouseHit.transform.rx = 90;
                mouseHit.visible = false;
                mouseHit.mouselayer = feng3d.mouselayer.editor;
                mouseHit.mouseEnabled = true;
                this.gameObject.addChild(mouseHit);
                this.update();
            }
            update() {
                this.sector.radius = this.radius;
                this.torusGeometry.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                if (this._filterNormal) {
                    var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this._filterNormal);
                }
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var show = true;
                        if (localNormal) {
                            show = points[i - 1].dotProduct(localNormal) > 0 && points[i].dotProduct(localNormal) > 0;
                        }
                        if (show) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = color;
                            this.segmentGeometry.addSegment(segment);
                        }
                        else if (this.selected) {
                            var segment = new feng3d.Segment(points[i - 1], points[i]);
                            segment.startColor = segment.endColor = this.backColor;
                            this.segmentGeometry.addSegment(segment);
                        }
                    }
                }
            }
            showSector(startPos, endPos) {
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
                var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
                var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                //
                var min = Math.min(startAngle, endAngle);
                var max = Math.max(startAngle, endAngle);
                if (max - min > 180) {
                    min += 360;
                }
                this.sector.update(min, max);
                this.gameObject.addChild(this.sector.gameObject);
            }
            hideSector() {
                if (this.sector.gameObject.parent)
                    this.sector.gameObject.parent.removeChild(this.sector.gameObject);
            }
        }
        editor.CoordinateRotationAxis = CoordinateRotationAxis;
        /**
         * 扇形对象
         */
        class SectorObject3D extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.borderColor = new feng3d.Color(0, 1, 1, 0.6);
                this.radius = 80;
                this._start = 0;
                this._end = 0;
            }
            /**
             * 构建3D对象
             */
            init(gameObject) {
                super.init(gameObject);
                this.gameObject.name = "sector";
                var meshRenderer = this.gameObject.addComponent(feng3d.MeshRenderer);
                this.geometry = meshRenderer.geometry = new feng3d.CustomGeometry();
                meshRenderer.material = new feng3d.ColorMaterial(new feng3d.Color(0.5, 0.5, 0.5, 0.2));
                var border = feng3d.GameObject.create("border");
                meshRenderer = border.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.update(0, 0);
            }
            update(start = 0, end = 0) {
                this._start = Math.min(start, end);
                this._end = Math.max(start, end);
                var length = Math.floor(this._end - this._start);
                if (length == 0)
                    length = 1;
                var vertexPositionData = [];
                var indices = [];
                vertexPositionData[0] = 0;
                vertexPositionData[1] = 0;
                vertexPositionData[2] = 0;
                for (var i = 0; i < length; i++) {
                    vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.MathConsts.DEGREES_TO_RADIANS);
                    vertexPositionData[i * 3 + 5] = 0;
                    if (i > 0) {
                        indices[(i - 1) * 3] = 0;
                        indices[(i - 1) * 3 + 1] = i;
                        indices[(i - 1) * 3 + 2] = i + 1;
                    }
                }
                this.geometry.setVAData("a_position", vertexPositionData, 3);
                this.geometry.indices = indices;
                //绘制边界
                var startPoint = new feng3d.Vector3D(this.radius * Math.cos((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._start - 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                var endPoint = new feng3d.Vector3D(this.radius * Math.cos((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), this.radius * Math.sin((this._end + 0.1) * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                //
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), startPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
                var segment = new feng3d.Segment(new feng3d.Vector3D(), endPoint);
                segment.startColor = segment.endColor = this.borderColor;
                this.segmentGeometry.addSegment(segment);
            }
        }
        editor.SectorObject3D = SectorObject3D;
        class CoordinateRotationFreeAxis extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.radius = 80;
                this.color = new feng3d.Color(1, 0, 0, 0.99);
                this.backColor = new feng3d.Color(0.6, 0.6, 0.6, 0.99);
                this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                this._selected = false;
            }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                this.initModels();
            }
            initModels() {
                var border = feng3d.GameObject.create("border");
                var meshRenderer = border.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorObject3D);
                this.sector.update(0, 360);
                this.sector.gameObject.visible = false;
                this.sector.gameObject.mouseEnabled = true;
                this.sector.gameObject.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(this.sector.gameObject);
                this.update();
            }
            update() {
                this.sector.radius = this.radius;
                var color = this._selected ? this.selectedColor : this.color;
                var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
                this.segmentGeometry.removeAllSegments();
                var points = [];
                for (var i = 0; i <= 360; i++) {
                    points[i] = new feng3d.Vector3D(Math.sin(i * feng3d.MathConsts.DEGREES_TO_RADIANS), Math.cos(i * feng3d.MathConsts.DEGREES_TO_RADIANS), 0);
                    points[i].scaleBy(this.radius);
                    if (i > 0) {
                        var segment = new feng3d.Segment(points[i - 1], points[i]);
                        segment.startColor = segment.endColor = color;
                        this.segmentGeometry.addSegment(segment);
                    }
                }
            }
        }
        editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DScaleModel extends feng3d.Component {
            init(gameObject) {
                super.init(gameObject);
                this.gameObject.name = "Object3DScaleModel";
                this.initModels();
            }
            initModels() {
                this.xCube = feng3d.GameObject.create("xCube").addComponent(CoordinateScaleCube);
                this.xCube.color.setTo(1, 0, 0);
                this.xCube.update();
                this.xCube.transform.rz = -90;
                this.gameObject.addChild(this.xCube.gameObject);
                this.yCube = feng3d.GameObject.create("yCube").addComponent(CoordinateScaleCube);
                this.yCube.color.setTo(0, 1, 0);
                this.yCube.update();
                this.gameObject.addChild(this.yCube.gameObject);
                this.zCube = feng3d.GameObject.create("zCube").addComponent(CoordinateScaleCube);
                this.zCube.color.setTo(0, 0, 1);
                this.zCube.update();
                this.zCube.transform.rx = 90;
                this.gameObject.addChild(this.zCube.gameObject);
                this.oCube = feng3d.GameObject.create("oCube").addComponent(editor.CoordinateCube);
                this.gameObject.addChild(this.oCube.gameObject);
            }
        }
        editor.Object3DScaleModel = Object3DScaleModel;
        class CoordinateScaleCube extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.color = new feng3d.Color(1, 0, 0, 0.99);
                this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                this.length = 100;
                this._selected = false;
                this._scale = 1;
            }
            //
            get selected() { return this._selected; }
            set selected(value) { if (this._selected == value)
                return; this._selected = value; this.update(); }
            //
            get scaleValue() { return this._scale; }
            set scaleValue(value) { if (this._scale == value)
                return; this._scale = value; this.update(); }
            init(gameObject) {
                super.init(gameObject);
                var xLine = feng3d.GameObject.create();
                var meshRenderer = xLine.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(xLine);
                this.coordinateCube = feng3d.GameObject.create("coordinateCube").addComponent(editor.CoordinateCube);
                this.gameObject.addChild(this.coordinateCube.gameObject);
                var mouseHit = feng3d.GameObject.create("hit");
                meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.CylinderGeometry(5, 5, this.length - 4);
                mouseHit.transform.y = 4 + (this.length - 4) / 2;
                mouseHit.visible = false;
                mouseHit.mouseEnabled = true;
                mouseHit.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(mouseHit);
                this.update();
            }
            update() {
                this.coordinateCube.color = this.color;
                this.coordinateCube.selectedColor = this.selectedColor;
                this.coordinateCube.update();
                this.segmentGeometry.removeAllSegments();
                var segment = new feng3d.Segment(new feng3d.Vector3D(), new feng3d.Vector3D(0, this._scale * this.length, 0));
                segment.startColor = segment.endColor = this.selected ? this.selectedColor : this.color;
                this.segmentGeometry.addSegment(segment);
                //
                this.coordinateCube.transform.y = this.length * this._scale;
                this.coordinateCube.selected = this.selected;
            }
        }
        editor.CoordinateScaleCube = CoordinateScaleCube;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DControllerToolBase extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.ismouseDown = false;
            }
            init(gameObject) {
                super.init(gameObject);
                var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
                holdSizeComponent.holdSize = 1;
                holdSizeComponent.camera = editor.engine.camera;
                //
                this.gameObject.on("addedToScene", this.onAddedToScene, this);
                this.gameObject.on("removedFromScene", this.onRemovedFromScene, this);
            }
            onAddedToScene() {
                this.updateToolModel();
                this._object3DControllerTarget.controllerTool = this.transform;
                //
                feng3d.input.on("mousedown", this.onMouseDown, this);
                feng3d.input.on("mouseup", this.onMouseUp, this);
                this.gameObject.on("scenetransformChanged", this.onScenetransformChanged, this);
                editor.engine.camera.gameObject.on("scenetransformChanged", this.onCameraScenetransformChanged, this);
            }
            onRemovedFromScene() {
                this._object3DControllerTarget.controllerTool = null;
                //
                feng3d.input.off("mousedown", this.onMouseDown, this);
                feng3d.input.off("mouseup", this.onMouseUp, this);
                this.gameObject.off("scenetransformChanged", this.onScenetransformChanged, this);
                editor.engine.camera.gameObject.off("scenetransformChanged", this.onCameraScenetransformChanged, this);
            }
            get toolModel() {
                return this._toolModel;
            }
            set toolModel(value) {
                if (this._toolModel)
                    this.gameObject.removeChild(this._toolModel.gameObject);
                this._toolModel = value;
                ;
                if (this._toolModel) {
                    this.gameObject.addChild(this._toolModel.gameObject);
                }
            }
            get selectedItem() {
                return this._selectedItem;
            }
            set selectedItem(value) {
                if (this._selectedItem == value)
                    return;
                if (this._selectedItem)
                    this._selectedItem.selected = false;
                this._selectedItem = value;
                if (this._selectedItem)
                    this._selectedItem.selected = true;
            }
            get object3DControllerTarget() {
                return this._object3DControllerTarget;
            }
            set object3DControllerTarget(value) {
                this._object3DControllerTarget = value;
            }
            updateToolModel() {
            }
            onMouseDown() {
                this.selectedItem = null;
                this.ismouseDown = true;
            }
            onMouseUp() {
                this.ismouseDown = false;
                this.movePlane3D = null;
                this.startSceneTransform = null;
            }
            onScenetransformChanged() {
                this.updateToolModel();
            }
            onCameraScenetransformChanged() {
                this.updateToolModel();
            }
            /**
             * 获取鼠标射线与移动平面的交点（模型空间）
             */
            getLocalMousePlaneCross() {
                //射线与平面交点
                var crossPos = this.getMousePlaneCross();
                //把交点从世界转换为模型空间
                var inverseGlobalMatrix3D = this.startSceneTransform.clone();
                inverseGlobalMatrix3D.invert();
                crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
                return crossPos;
            }
            getMousePlaneCross() {
                var line3D = editor.engine.camera.getMouseRay3D();
                //射线与平面交点
                var crossPos = this.movePlane3D.lineCross(line3D);
                return crossPos;
            }
        }
        editor.Object3DControllerToolBase = Object3DControllerToolBase;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DMoveTool extends editor.Object3DControllerToolBase {
            constructor() {
                super(...arguments);
                /**
                 * 用于判断是否改变了XYZ
                 */
                this.changeXYZ = new feng3d.Vector3D();
            }
            init(gameObject) {
                super.init(gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DMoveModel);
            }
            onAddedToScene() {
                super.onAddedToScene();
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            }
            onRemovedFromScene() {
                super.onRemovedFromScene();
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            }
            onItemMouseDown(event) {
                if (!editor.engine.mouseinview)
                    return;
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var po = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 0));
                var px = globalMatrix3D.transformVector(new feng3d.Vector3D(1, 0, 0));
                var py = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 1, 0));
                var pz = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 1));
                //
                var ox = px.subtract(po);
                var oy = py.subtract(po);
                var oz = pz.subtract(po);
                //摄像机前方方向
                var cameraSceneTransform = editor.engine.camera.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedGameObject = event.currentTarget;
                //
                switch (selectedGameObject) {
                    case this.toolModel.xAxis.gameObject:
                        this.selectedItem = this.toolModel.xAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yAxis.gameObject:
                        this.selectedItem = this.toolModel.yAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zAxis.gameObject:
                        this.selectedItem = this.toolModel.zAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.yzPlane.gameObject:
                        this.selectedItem = this.toolModel.yzPlane;
                        this.movePlane3D.fromPoints(po, py, pz);
                        this.changeXYZ.setTo(0, 1, 1);
                        break;
                    case this.toolModel.xzPlane.gameObject:
                        this.selectedItem = this.toolModel.xzPlane;
                        this.movePlane3D.fromPoints(po, px, pz);
                        this.changeXYZ.setTo(1, 0, 1);
                        break;
                    case this.toolModel.xyPlane.gameObject:
                        this.selectedItem = this.toolModel.xyPlane;
                        this.movePlane3D.fromPoints(po, px, py);
                        this.changeXYZ.setTo(1, 1, 0);
                        break;
                    case this.toolModel.oCube.gameObject:
                        this.selectedItem = this.toolModel.oCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                //
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.startPos = this.toolModel.transform.position;
                this.object3DControllerTarget.startTranslation();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            }
            onMouseMove() {
                var crossPos = this.getLocalMousePlaneCross();
                var addPos = crossPos.subtract(this.startPlanePos);
                addPos.x *= this.changeXYZ.x;
                addPos.y *= this.changeXYZ.y;
                addPos.z *= this.changeXYZ.z;
                var sceneTransform = this.startSceneTransform.clone();
                sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
                var sceneAddpos = sceneTransform.position.subtract(this.startSceneTransform.position);
                this.object3DControllerTarget.translation(sceneAddpos);
            }
            onMouseUp() {
                super.onMouseUp();
                feng3d.input.off("mousemove", this.onMouseMove, this);
                this.object3DControllerTarget.stopTranslation();
                this.startPos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
                this.updateToolModel();
            }
            updateToolModel() {
                //鼠标按下时不更新
                if (this.ismouseDown)
                    return;
                var cameraPos = editor.engine.camera.transform.scenePosition;
                var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
                this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
                this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
            }
        }
        editor.Object3DMoveTool = Object3DMoveTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DRotationTool extends editor.Object3DControllerToolBase {
            init(gameObject) {
                super.init(gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DRotationModel);
            }
            onAddedToScene() {
                super.onAddedToScene();
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            }
            onRemovedFromScene() {
                super.onRemovedFromScene();
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            }
            onItemMouseDown(event) {
                if (!editor.engine.mouseinview)
                    return;
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var pos = globalMatrix3D.position;
                var xDir = globalMatrix3D.right;
                var yDir = globalMatrix3D.up;
                var zDir = globalMatrix3D.forward;
                //摄像机前方方向
                var cameraSceneTransform = editor.engine.camera.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                var cameraPos = cameraSceneTransform.position;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedGameObject = event.currentTarget;
                switch (selectedGameObject) {
                    case this.toolModel.xAxis.gameObject:
                        this.selectedItem = this.toolModel.xAxis;
                        this.movePlane3D.fromNormalAndPoint(xDir, pos);
                        break;
                    case this.toolModel.yAxis.gameObject:
                        this.selectedItem = this.toolModel.yAxis;
                        this.movePlane3D.fromNormalAndPoint(yDir, pos);
                        break;
                    case this.toolModel.zAxis.gameObject:
                        this.selectedItem = this.toolModel.zAxis;
                        this.selectedItem = this.toolModel.zAxis;
                        this.movePlane3D.fromNormalAndPoint(zDir, pos);
                        break;
                    case this.toolModel.freeAxis.gameObject:
                        this.selectedItem = this.toolModel.freeAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                    case this.toolModel.cameraAxis.gameObject:
                        this.selectedItem = this.toolModel.cameraAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                }
                this.startPlanePos = this.getMousePlaneCross();
                this.stepPlaneCross = this.startPlanePos.clone();
                //
                this.startMousePos = editor.engine.mousePos.clone();
                this.startSceneTransform = globalMatrix3D.clone();
                this.object3DControllerTarget.startRotate();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            }
            onMouseMove() {
                switch (this.selectedItem) {
                    case this.toolModel.xAxis:
                    case this.toolModel.yAxis:
                    case this.toolModel.zAxis:
                    case this.toolModel.cameraAxis:
                        var origin = this.startSceneTransform.position;
                        var planeCross = this.getMousePlaneCross();
                        var startDir = this.stepPlaneCross.subtract(origin);
                        startDir.normalize();
                        var endDir = planeCross.subtract(origin);
                        endDir.normalize();
                        //计算夹角
                        var cosValue = startDir.dotProduct(endDir);
                        var angle = Math.acos(cosValue) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                        //计算是否顺时针
                        var sign = this.movePlane3D.normal.crossProduct(startDir).dotProduct(endDir);
                        sign = sign > 0 ? 1 : -1;
                        angle = angle * sign;
                        //
                        this.object3DControllerTarget.rotate1(angle, this.movePlane3D.normal);
                        this.stepPlaneCross.copyFrom(planeCross);
                        this.object3DControllerTarget.startRotate();
                        //绘制扇形区域
                        if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                            this.selectedItem.showSector(this.startPlanePos, planeCross);
                        }
                        break;
                    case this.toolModel.freeAxis:
                        var endPoint = editor.engine.mousePos.clone();
                        var offset = endPoint.subtract(this.startMousePos);
                        var cameraSceneTransform = editor.engine.camera.transform.localToWorldMatrix;
                        var right = cameraSceneTransform.right;
                        var up = cameraSceneTransform.up;
                        this.object3DControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                        //
                        this.startMousePos = endPoint;
                        this.object3DControllerTarget.startRotate();
                        break;
                }
            }
            onMouseUp() {
                super.onMouseUp();
                feng3d.input.off("mousemove", this.onMouseMove, this);
                if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                    this.selectedItem.hideSector();
                }
                this.object3DControllerTarget.stopRote();
                this.startMousePos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
            }
            updateToolModel() {
                var cameraSceneTransform = editor.engine.camera.transform.localToWorldMatrix.clone();
                var cameraDir = cameraSceneTransform.forward;
                cameraDir.negate();
                //
                var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
                for (var i = 0; i < xyzAxis.length; i++) {
                    var axis = xyzAxis[i];
                    axis.filterNormal = cameraDir;
                }
                //朝向摄像机
                var temp = cameraSceneTransform.clone();
                temp.append(this.toolModel.transform.worldToLocalMatrix);
                var rotation = temp.decompose()[1];
                rotation.scaleBy(feng3d.MathConsts.RADIANS_TO_DEGREES);
                this.toolModel.freeAxis.transform.rotation = rotation;
                this.toolModel.cameraAxis.transform.rotation = rotation;
            }
        }
        editor.Object3DRotationTool = Object3DRotationTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DScaleTool extends editor.Object3DControllerToolBase {
            constructor() {
                super(...arguments);
                /**
                 * 用于判断是否改变了XYZ
                 */
                this.changeXYZ = new feng3d.Vector3D();
            }
            init(gameObject) {
                super.init(gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DScaleModel);
            }
            onAddedToScene() {
                super.onAddedToScene();
                this.toolModel.xCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            }
            onRemovedFromScene() {
                super.onRemovedFromScene();
                this.toolModel.xCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            }
            onItemMouseDown(event) {
                if (!editor.engine.mouseinview)
                    return;
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var po = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 0));
                var px = globalMatrix3D.transformVector(new feng3d.Vector3D(1, 0, 0));
                var py = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 1, 0));
                var pz = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 1));
                //
                var ox = px.subtract(po);
                var oy = py.subtract(po);
                var oz = pz.subtract(po);
                //摄像机前方方向
                var cameraSceneTransform = editor.engine.camera.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedGameObject = event.currentTarget;
                switch (selectedGameObject) {
                    case this.toolModel.xCube.gameObject:
                        this.selectedItem = this.toolModel.xCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yCube.gameObject:
                        this.selectedItem = this.toolModel.yCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zCube.gameObject:
                        this.selectedItem = this.toolModel.zCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.oCube.gameObject:
                        this.selectedItem = this.toolModel.oCube;
                        this.startMousePos = editor.engine.mousePos.clone();
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.object3DControllerTarget.startScale();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            }
            onMouseMove() {
                var addPos = new feng3d.Vector3D();
                var addScale = new feng3d.Vector3D();
                if (this.selectedItem == this.toolModel.oCube) {
                    var currentMouse = editor.engine.mousePos;
                    var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                    addPos.setTo(distance, distance, distance);
                    var scale = 1 + (addPos.x + addPos.y) / (editor.engine.viewRect.height);
                    addScale.setTo(scale, scale, scale);
                }
                else {
                    var crossPos = this.getLocalMousePlaneCross();
                    var offset = crossPos.subtract(this.startPlanePos);
                    if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                        addScale.x = offset.x / this.startPlanePos.x;
                    }
                    if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                        addScale.y = offset.y / this.startPlanePos.y;
                    }
                    if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                        addScale.z = offset.z / this.startPlanePos.z;
                    }
                    addScale.x += 1;
                    addScale.y += 1;
                    addScale.z += 1;
                }
                this.object3DControllerTarget.doScale(addScale);
                //
                this.toolModel.xCube.scaleValue = addScale.x;
                this.toolModel.yCube.scaleValue = addScale.y;
                this.toolModel.zCube.scaleValue = addScale.z;
            }
            onMouseUp() {
                super.onMouseUp();
                feng3d.input.off("mousemove", this.onMouseMove, this);
                this.startPlanePos = null;
                this.startSceneTransform = null;
                //
                this.toolModel.xCube.scaleValue = 1;
                this.toolModel.yCube.scaleValue = 1;
                this.toolModel.zCube.scaleValue = 1;
            }
        }
        editor.Object3DScaleTool = Object3DScaleTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Object3DControllerTool extends feng3d.Component {
            init(gameObject) {
                super.init(gameObject);
                gameObject.serializable = false;
                gameObject.showinHierarchy = false;
                this.object3DControllerTarget = editor.Object3DControllerTarget.instance;
                this.object3DMoveTool = feng3d.GameObject.create("object3DMoveTool").addComponent(editor.Object3DMoveTool);
                this.object3DRotationTool = feng3d.GameObject.create("object3DRotationTool").addComponent(editor.Object3DRotationTool);
                this.object3DScaleTool = feng3d.GameObject.create("object3DScaleTool").addComponent(editor.Object3DScaleTool);
                this.object3DMoveTool.object3DControllerTarget = this.object3DControllerTarget;
                this.object3DRotationTool.object3DControllerTarget = this.object3DControllerTarget;
                this.object3DScaleTool.object3DControllerTarget = this.object3DControllerTarget;
                //
                this.currentTool = this.object3DMoveTool;
                eui.Watcher.watch(editor.editor3DData, ["object3DOperationID"], this.onObject3DOperationIDChange, this);
                feng3d.shortcut.on("object3DMoveTool", this.onObject3DMoveTool, this);
                feng3d.shortcut.on("object3DRotationTool", this.onObject3DRotationTool, this);
                feng3d.shortcut.on("object3DScaleTool", this.onObject3DScaleTool, this);
                eui.Watcher.watch(editor.editor3DData, ["selectedObject"], this.onSelectedObject3DChange, this);
            }
            onSelectedObject3DChange() {
                if (editor.editor3DData.selectedObject
                    //选中的是GameObject
                    && editor.editor3DData.selectedObject instanceof feng3d.GameObject
                    //选中的不是场景
                    && !editor.editor3DData.selectedObject.getComponent(feng3d.Scene3D)
                    && !editor.editor3DData.selectedObject.getComponent(feng3d.Trident)
                    && !editor.editor3DData.selectedObject.getComponent(editor.GroundGrid)
                    && !editor.editor3DData.selectedObject.getComponent(feng3d.SkinnedMeshRenderer)) {
                    this.object3DControllerTarget.controllerTargets = [editor.editor3DData.selectedObject.transform];
                    editor.engine.root.addChild(this.gameObject);
                }
                else {
                    this.object3DControllerTarget.controllerTargets = null;
                    this.gameObject.remove();
                }
            }
            onObject3DOperationIDChange() {
                switch (editor.editor3DData.object3DOperationID) {
                    case 0:
                        this.currentTool = this.object3DMoveTool;
                        break;
                    case 1:
                        this.currentTool = this.object3DRotationTool;
                        break;
                    case 2:
                        this.currentTool = this.object3DScaleTool;
                        break;
                }
            }
            onObject3DMoveTool() {
                editor.editor3DData.object3DOperationID = 0;
            }
            onObject3DRotationTool() {
                editor.editor3DData.object3DOperationID = 1;
            }
            onObject3DScaleTool() {
                editor.editor3DData.object3DOperationID = 2;
            }
            set currentTool(value) {
                if (this._currentTool == value)
                    return;
                if (this._currentTool) {
                    this.gameObject.removeChild(this._currentTool.gameObject);
                }
                this._currentTool = value;
                if (this._currentTool) {
                    this.gameObject.addChild(this._currentTool.gameObject);
                }
            }
        }
        editor.Object3DControllerTool = Object3DControllerTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var nodeMap = new feng3d.Map();
        class HierarchyTree extends editor.Tree {
            init(gameobject) {
                var hierarchyNode = { isOpen: true, gameobject: gameobject, label: gameobject.name, children: [] };
                nodeMap.push(gameobject, hierarchyNode);
                this.rootnode = hierarchyNode;
            }
            delete(gameobject) {
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.destroy(node);
                    nodeMap.delete(gameobject);
                }
            }
            add(gameobject) {
                if (!gameobject.showinHierarchy)
                    return;
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.removeNode(node);
                }
                var parentnode = nodeMap.get(gameobject.parent);
                if (parentnode) {
                    if (!node) {
                        node = { isOpen: true, gameobject: gameobject, label: gameobject.name, children: [] };
                        nodeMap.push(gameobject, node);
                    }
                    this.addNode(node, parentnode);
                }
                gameobject.children.forEach(element => {
                    this.add(element);
                });
            }
            remove(gameobject) {
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.removeNode(node);
                }
                gameobject.children.forEach(element => {
                    this.remove(element);
                });
            }
            /**
             * 获取节点
             */
            getNode(gameObject) {
                var node = nodeMap.get(gameObject);
                return node;
            }
        }
        editor.HierarchyTree = HierarchyTree;
        editor.hierarchyTree = new HierarchyTree();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class Hierarchy {
            constructor(rootObject3D) {
                editor.hierarchyTree.init(rootObject3D);
                //
                editor.$editorEventDispatcher.on("saveScene", this.onSaveScene, this);
                editor.$editorEventDispatcher.on("import", this.onImport, this);
                rootObject3D.on("added", this.ongameobjectadded, this);
                rootObject3D.on("removed", this.ongameobjectremoved, this);
            }
            ongameobjectadded(event) {
                editor.hierarchyTree.add(event.data);
            }
            ongameobjectremoved(event) {
                editor.hierarchyTree.remove(event.data);
            }
            resetScene(scene) {
                scene.children.forEach(element => {
                    // this.addObject3D(element, null, true);
                });
            }
            onImport() {
                editor.electron.call("selected-file", {
                    callback: (paths) => {
                        feng3d.loadjs.load({
                            paths: paths, onitemload: (url, content) => {
                                var json = JSON.parse(content);
                                var scene = feng3d.serialization.deserialize(json);
                                editor.hierarchy.resetScene(scene);
                            }
                        });
                    }, param: { name: 'JSON', extensions: ['json'] }
                });
            }
            addGameoObjectFromAsset(path, parent) {
                editor.file.readFile(path, (err, content) => {
                    var json = JSON.parse(content);
                    var gameobject = feng3d.serialization.deserialize(json);
                    gameobject.name = path.split("/").pop().split(".").shift();
                    if (parent)
                        parent.addChild(gameobject);
                    else
                        editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
                    editor.editor3DData.selectedObject = gameobject;
                });
            }
            onSaveScene() {
                editor.assets.saveGameObject(editor.hierarchyTree.rootnode.gameobject);
            }
        }
        editor.Hierarchy = Hierarchy;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class SceneControl {
            constructor() {
                this.fpsController = editor.engine.camera.gameObject.addComponent(feng3d.FPSController);
                this.fpsController.auto = false;
                //
                feng3d.shortcut.on("lookToSelectedObject3D", this.onLookToSelectedObject3D, this);
                feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
                feng3d.shortcut.on("dragScene", this.onDragScene, this);
                feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
                feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
                feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
                feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
                feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
                //
            }
            onDragSceneStart() {
                this.dragSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.dragSceneCameraGlobalMatrix3D = editor.engine.camera.transform.localToWorldMatrix.clone();
            }
            onDragScene() {
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
                var scale = editor.engine.camera.getScaleByDepth(300);
                var up = this.dragSceneCameraGlobalMatrix3D.up;
                var right = this.dragSceneCameraGlobalMatrix3D.right;
                up.scaleBy(addPoint.y * scale);
                right.scaleBy(-addPoint.x * scale);
                var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
                globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
                editor.engine.camera.transform.localToWorldMatrix = globalMatrix3D;
            }
            onFpsViewStart() {
                this.fpsController.onMousedown();
            }
            onFpsViewStop() {
                this.fpsController.onMouseup();
            }
            onMouseRotateSceneStart() {
                this.rotateSceneMousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                this.rotateSceneCameraGlobalMatrix3D = editor.engine.camera.transform.localToWorldMatrix.clone();
                this.rotateSceneCenter = null;
                if (editor.editor3DData.selectedObject && editor.editor3DData.selectedObject instanceof feng3d.GameObject) {
                    this.rotateSceneCenter = editor.editor3DData.selectedObject.transform.scenePosition;
                }
                else {
                    this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                    this.rotateSceneCenter.scaleBy(config.lookDistance);
                    this.rotateSceneCenter = this.rotateSceneCenter.add(this.rotateSceneCameraGlobalMatrix3D.position);
                }
            }
            onMouseRotateScene() {
                var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
                var mousePoint = new feng3d.Point(feng3d.input.clientX, feng3d.input.clientY);
                var view3DRect = editor.engine.viewRect;
                var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
                var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
                globalMatrix3D.appendRotation(feng3d.Vector3D.Y_AXIS, rotateY, this.rotateSceneCenter);
                var rotateAxisX = globalMatrix3D.right;
                globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
                editor.engine.camera.transform.localToWorldMatrix = globalMatrix3D;
            }
            onLookToSelectedObject3D() {
                var selectedObject3D = editor.editor3DData.selectedObject;
                if (selectedObject3D && selectedObject3D instanceof feng3d.GameObject) {
                    var cameraObject3D = editor.engine.camera;
                    config.lookDistance = config.defaultLookDistance;
                    var lookPos = cameraObject3D.transform.localToWorldMatrix.forward;
                    lookPos.scaleBy(-config.lookDistance);
                    lookPos.incrementBy(selectedObject3D.transform.scenePosition);
                    var localLookPos = lookPos.clone();
                    if (cameraObject3D.transform.parent) {
                        cameraObject3D.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                    }
                    egret.Tween.get(editor.engine.camera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
                }
            }
            onMouseWheelMoveSceneCamera(event) {
                var inputEvent = event.data;
                var distance = inputEvent.wheelDelta * config.mouseWheelMoveStep;
                editor.engine.camera.transform.localToWorldMatrix = editor.engine.camera.transform.localToWorldMatrix.moveForward(distance);
                config.lookDistance -= distance;
            }
        }
        editor.SceneControl = SceneControl;
        class SceneControlConfig {
            constructor() {
                this.mouseWheelMoveStep = 0.4;
                this.defaultLookDistance = 300;
                //dynamic
                this.lookDistance = 300;
            }
        }
        editor.SceneControlConfig = SceneControlConfig;
        var config = new SceneControlConfig();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 地面网格
         * @author feng 2016-10-29
         */
        class GroundGrid extends feng3d.Component {
            constructor() {
                super(...arguments);
                this.num = 100;
                // private onCameraScenetransformChanged()
                // {
                //     this.update();
                // }
            }
            init(gameObject) {
                super.init(gameObject);
                this.gameObject.mouseEnabled = false;
                // engine.cameraObject3D.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
                var meshRenderer = this.gameObject.addComponent(feng3d.MeshRenderer);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.enableBlend = true;
                this.update();
            }
            update() {
                var cameraGlobalPosition = editor.engine.camera.transform.scenePosition;
                this.level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                this.step = Math.pow(10, this.level - 1);
                var startX = Math.round(cameraGlobalPosition.x / (10 * this.step)) * 10 * this.step;
                var startZ = Math.round(cameraGlobalPosition.z / (10 * this.step)) * 10 * this.step;
                //设置在原点
                startX = startZ = 0;
                this.step = 100;
                var halfNum = this.num / 2;
                this.segmentGeometry.removeAllSegments();
                for (var i = -halfNum; i <= halfNum; i++) {
                    var color = new feng3d.Color().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                    color.a = ((i % 10) == 0) ? 0.5 : 0.1;
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(-halfNum * this.step + startX, 0, i * this.step + startZ), new feng3d.Vector3D(halfNum * this.step + startX, 0, i * this.step + startZ), color, color));
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(i * this.step + startX, 0, -halfNum * this.step + startZ), new feng3d.Vector3D(i * this.step + startX, 0, halfNum * this.step + startZ), color, color));
                }
            }
        }
        editor.GroundGrid = GroundGrid;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
        * 编辑器3D入口
        * @author feng 2016-10-29
        */
        class Main3D {
            constructor() {
                this.init();
            }
            init() {
                var canvas = document.getElementById("glcanvas");
                editor.engine = new feng3d.Engine(canvas);
                editor.engine.scene.background = new feng3d.Color(0.4, 0.4, 0.4, 1.0);
                editor.engine.root.addComponent(editor.EditorComponent);
                editor.hierarchy = new editor.Hierarchy(editor.engine.root);
                //
                var camera = editor.engine.camera;
                camera.transform.z = 500;
                camera.transform.y = 300;
                camera.transform.lookAt(new feng3d.Vector3D());
                var trident = feng3d.GameObject.create("Trident");
                trident.addComponent(feng3d.Trident);
                trident.mouseEnabled = false;
                editor.engine.root.addChild(trident);
                //初始化模块
                var groundGrid = feng3d.GameObject.create("GroundGrid").addComponent(editor.GroundGrid);
                editor.engine.root.addChild(groundGrid.gameObject);
                var cubeTexture = new feng3d.TextureCube([
                    'resource/3d/skybox/px.jpg',
                    'resource/3d/skybox/py.jpg',
                    'resource/3d/skybox/pz.jpg',
                    'resource/3d/skybox/nx.jpg',
                    'resource/3d/skybox/ny.jpg',
                    'resource/3d/skybox/nz.jpg',
                ]);
                var skybox = feng3d.GameObject.create("skybox");
                skybox.mouseEnabled = false;
                var skyBoxComponent = skybox.addComponent(feng3d.SkyBox);
                skyBoxComponent.texture = cubeTexture;
                editor.engine.root.addChild(skybox);
                var directionalLight = feng3d.GameObject.create("DirectionalLight");
                directionalLight.addComponent(feng3d.DirectionalLight);
                directionalLight.transform.rx = 120;
                editor.engine.root.addChild(directionalLight);
                var object3DControllerTool = feng3d.GameObject.create("object3DControllerTool").addComponent(editor.Object3DControllerTool);
                //
                var sceneControl = new editor.SceneControl();
                this.test();
            }
            test() {
                editor.engine.root.on("mousedown", (event) => {
                    var gameobject = event.target;
                    var names = [gameobject.name];
                    while (gameobject.parent) {
                        gameobject = gameobject.parent;
                        names.push(gameobject.name);
                    }
                    // console.log(event.type, names.reverse().join("->"));
                }, this);
            }
        }
        editor.Main3D = Main3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class EditorComponent extends feng3d.Component {
            init(gameobject) {
                super.init(gameobject);
                this.scene3D = this.getComponent(feng3d.Scene3D);
                this.scene3D.on("addComponentToScene", this.onAddComponentToScene, this);
                this.scene3D.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
            }
            onAddComponentToScene(event) {
                if (event.data instanceof feng3d.DirectionalLight) {
                    event.data.gameObject.addComponent(editor.DirectionLightIcon);
                }
                else if (event.data instanceof feng3d.PointLight) {
                    event.data.gameObject.addComponent(editor.PointLightIcon);
                }
            }
            onRemoveComponentFromScene(event) {
                if (event.data instanceof feng3d.DirectionalLight) {
                    event.data.gameObject.removeComponentsByType(editor.DirectionLightIcon);
                }
                else if (event.data instanceof feng3d.PointLight) {
                    event.data.gameObject.removeComponentsByType(editor.PointLightIcon);
                }
            }
        }
        editor.EditorComponent = EditorComponent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class EditorEnvironment {
            constructor() {
                this.init();
            }
            init() {
                document.body.oncontextmenu = function () { return false; };
                //给反射添加查找的空间
                feng3d.ClassUtils.addClassNameSpace("feng3d.editor");
                feng3d.ClassUtils.addClassNameSpace("egret");
                //调整默认字体大小
                egret.TextField.default_size = 12;
                //解决TextInput.text绑定Number是不显示0的bug
                var p = eui.TextInput.prototype;
                var old = p["textDisplayAdded"];
                p["textDisplayAdded"] = function () {
                    old.call(this);
                    var values = this.$TextInput;
                    this.textDisplay.text = String(values[6 /* text */]);
                };
                var oldfocusHandler = egret.InputController.prototype["focusHandler"];
                egret.InputController.prototype["focusHandler"] = function (event) {
                    oldfocusHandler.call(this, event);
                    feng3d.shortcut.enable = !this._isFocus;
                };
                var oldblurHandler = egret.InputController.prototype["blurHandler"];
                egret.InputController.prototype["blurHandler"] = function (event) {
                    oldblurHandler.call(this, event);
                    feng3d.shortcut.enable = !this._isFocus;
                };
            }
        }
        editor.EditorEnvironment = EditorEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.MouseEvent = egret.TouchEvent;
        //映射事件名称
        editor.MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
        editor.MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
        editor.MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
        editor.MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
        editor.MouseEvent.MOUSE_OUT = "mouseout";
        editor.MouseEvent.RIGHT_CLICK = "rightclick";
        editor.MouseEvent.DOUBLE_CLICK = "dblclick";
        //
        //解决TextInput.text绑定Number是不显示0的bug
        var p = egret.DisplayObject.prototype;
        var old = p.dispatchEvent;
        p.dispatchEvent = function (event) {
            if (event.type == editor.MouseEvent.MOUSE_OVER) {
                //鼠标已经在对象上时停止over冒泡
                if (this.isMouseOver) {
                    event.stopPropagation();
                    return true;
                }
                this.isMouseOver = true;
            }
            if (event.type == editor.MouseEvent.MOUSE_OUT) {
                //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
                var overDisplayObject = editor.mouseEventEnvironment.overDisplayObject;
                while (overDisplayObject) {
                    if (this == overDisplayObject) {
                        event.stopPropagation();
                        return true;
                    }
                    overDisplayObject = overDisplayObject.parent;
                }
                this.isMouseOver = false;
            }
            return old.call(this, event);
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class MouseEventEnvironment {
            constructor() {
                this.webTouchHandler = this.getWebTouchHandler();
                this.canvas = this.webTouchHandler.canvas;
                this.touch = this.webTouchHandler.touch;
                this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
                feng3d.input.on("rightmousedown", (e) => {
                    var location = this.webTouchHandler.getLocation(e.data.event);
                    var x = location.x;
                    var y = location.y;
                    this.rightmousedownObject = this.touch["findTarget"](x, y);
                });
                feng3d.input.on("rightmouseup", (e) => {
                    var location = this.webTouchHandler.getLocation(e.data.event);
                    var x = location.x;
                    var y = location.y;
                    var target = this.touch["findTarget"](x, y);
                    if (target == this.rightmousedownObject) {
                        egret.TouchEvent.dispatchTouchEvent(target, editor.MouseEvent.RIGHT_CLICK, true, true, x, y);
                        this.rightmousedownObject = null;
                    }
                });
                feng3d.input.on("dblclick", (e) => {
                    var location = this.webTouchHandler.getLocation(e.data.event);
                    var x = location.x;
                    var y = location.y;
                    var target = this.touch["findTarget"](x, y);
                    egret.TouchEvent.dispatchTouchEvent(target, editor.MouseEvent.DOUBLE_CLICK, true, true, x, y);
                });
            }
            onMouseMove(event) {
                var location = this.webTouchHandler.getLocation(event);
                var x = location.x;
                var y = location.y;
                var target = this.touch["findTarget"](x, y);
                if (target == this.overDisplayObject)
                    return;
                var preOverDisplayObject = this.overDisplayObject;
                this.overDisplayObject = target;
                if (preOverDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, editor.MouseEvent.MOUSE_OUT, true, true, x, y);
                }
                if (this.overDisplayObject) {
                    egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, editor.MouseEvent.MOUSE_OVER, true, true, x, y);
                }
            }
            getWebTouchHandler() {
                var list = document.querySelectorAll(".egret-player");
                var length = list.length;
                var player = null;
                for (var i = 0; i < length; i++) {
                    var container = list[i];
                    player = container["egret-player"];
                    if (player)
                        break;
                }
                return player.webTouchHandler;
            }
        }
        editor.MouseEventEnvironment = MouseEventEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class MouseRayTestScript extends feng3d.Script {
            init(gameObject) {
                super.init(gameObject);
                feng3d.input.on("click", this.onclick, this);
            }
            onclick() {
                var gameobject = feng3d.GameObject.create("test");
                var meshRenderer = gameobject.addComponent(feng3d.MeshRenderer);
                meshRenderer.material = new feng3d.StandardMaterial();
                meshRenderer.geometry = new feng3d.SphereGeometry(10);
                gameobject.mouseEnabled = false;
                var mouseRay3D = editor.engine.camera.getMouseRay3D();
                this.gameObject.addChild(gameobject);
                var position = mouseRay3D.position.clone();
                var direction = mouseRay3D.direction.clone();
                position = gameobject.transform.inverseTransformPoint(position);
                direction = gameobject.transform.inverseTransformDirection(direction);
                gameobject.transform.position = position;
                var num = 1000;
                var translate = () => {
                    gameobject.transform.translate(direction, 15);
                    if (num > 0) {
                        setTimeout(function () {
                            translate();
                        }, 1000 / 60);
                    }
                    else {
                        gameobject.remove();
                    }
                    num--;
                };
                translate();
            }
            update() {
            }
            /**
             * 销毁
             */
            dispose() {
                feng3d.input.off("click", this.onclick, this);
            }
        }
        editor.MouseRayTestScript = MouseRayTestScript;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class DirectionLightIcon extends feng3d.Script {
            init(gameObject) {
                super.init(gameObject);
                this.initicon();
            }
            initicon() {
                var size = 100;
                var linesize = 10;
                this.directionalLight = this.getComponent(feng3d.DirectionalLight);
                var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
                lightIcon.serializable = false;
                lightIcon.showinHierarchy = false;
                var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
                billboardComponent.camera = editor.engine.camera;
                var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.PlaneGeometry(size, size, 1, 1, false);
                var textureMaterial = this.textureMaterial = meshRenderer.material = new feng3d.TextureMaterial();
                textureMaterial.texture = new feng3d.Texture2D("resource/assets/3d/icons/sun.png");
                textureMaterial.texture.format = feng3d.GL.RGBA;
                textureMaterial.texture.premulAlpha = true;
                textureMaterial.enableBlend = true;
                this.gameObject.addChild(lightIcon);
                this.lightIcon.on("click", () => {
                    editor.editor3DData.selectedObject = this.gameObject;
                });
                //
                var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
                lightLines.mouseEnabled = false;
                lightLines.serializable = false;
                lightLines.showinHierarchy = false;
                var holdSizeComponent = lightLines.addComponent(feng3d.HoldSizeComponent);
                holdSizeComponent.camera = editor.engine.camera;
                holdSizeComponent.holdSize = 1;
                var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(163 / 255, 162 / 255, 107 / 255);
                var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var num = 10;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle) * linesize;
                    var y = Math.cos(angle) * linesize;
                    segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(x, y, 0), new feng3d.Vector3D(x, y, linesize * 5)));
                }
                num = 36;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle) * linesize;
                    var y = Math.cos(angle) * linesize;
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1) * linesize;
                    var y1 = Math.cos(angle1) * linesize;
                    segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(x, y, 0), new feng3d.Vector3D(x1, y1, 0)));
                }
                this.gameObject.addChild(lightLines);
                this.enabled = true;
            }
            update() {
                this.textureMaterial.color = this.directionalLight.color;
                if (editor.editor3DData.selectedObject == this.gameObject) {
                    this.lightLines.visible = true;
                }
                else {
                    this.lightLines.visible = false;
                }
            }
            dispose() {
                this.enabled = false;
                this.textureMaterial = null;
                this.directionalLight = null;
                //
                this.lightIcon.dispose();
                this.lightLines.dispose();
                this.lightIcon = null;
                this.lightLines = null;
                super.dispose();
            }
        }
        editor.DirectionLightIcon = DirectionLightIcon;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        class PointLightIcon extends feng3d.Script {
            init(gameObject) {
                super.init(gameObject);
                this.initicon();
            }
            initicon() {
                var size = 100;
                this.pointLight = this.getComponent(feng3d.PointLight);
                var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
                lightIcon.serializable = false;
                lightIcon.showinHierarchy = false;
                var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
                billboardComponent.camera = editor.engine.camera;
                var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.PlaneGeometry(size, size, 1, 1, false);
                var textureMaterial = this.textureMaterial = meshRenderer.material = new feng3d.TextureMaterial();
                textureMaterial.texture = new feng3d.Texture2D("resource/assets/3d/icons/light.png");
                textureMaterial.texture.format = feng3d.GL.RGBA;
                textureMaterial.texture.premulAlpha = true;
                textureMaterial.enableBlend = true;
                this.gameObject.addChild(lightIcon);
                this.lightIcon.on("click", () => {
                    editor.editor3DData.selectedObject = this.gameObject;
                });
                //
                var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
                lightLines.mouseEnabled = false;
                lightLines.serializable = false;
                lightLines.showinHierarchy = false;
                var lightLines1 = this.lightLines1 = feng3d.GameObject.create("Lines1");
                lightLines1.addComponent(feng3d.BillboardComponent).camera = editor.engine.camera;
                lightLines1.mouseEnabled = false;
                lightLines1.serializable = false;
                lightLines1.showinHierarchy = false;
                var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
                var meshRenderer1 = lightLines1.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(163 / 255, 162 / 255, 107 / 255);
                material.enableBlend = true;
                var material = meshRenderer1.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(163 / 255, 162 / 255, 107 / 255);
                material.enableBlend = true;
                var segmentGeometry = this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var segmentGeometry1 = meshRenderer1.geometry = new feng3d.SegmentGeometry();
                var num = 36;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(0, x, y), new feng3d.Vector3D(0, x1, y1)));
                    segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(x, 0, y), new feng3d.Vector3D(x1, 0, y1)));
                    segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(x, y, 0), new feng3d.Vector3D(x1, y1, 0)));
                    segmentGeometry1.addSegment(new feng3d.Segment(new feng3d.Vector3D(x, y, 0), new feng3d.Vector3D(x1, y1, 0)));
                }
                this.gameObject.addChild(lightLines);
                this.gameObject.addChild(lightLines1);
                //
                var lightpoints = this.lightpoints = feng3d.GameObject.create("points");
                lightpoints.mouseEnabled = false;
                lightpoints.serializable = false;
                lightpoints.showinHierarchy = false;
                var meshRenderer = lightpoints.addComponent(feng3d.MeshRenderer);
                var pointGeometry = this.pointGeometry = meshRenderer.geometry = new feng3d.PointGeometry();
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(1, 0, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(-1, 0, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 1, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, -1, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 0, 1)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 0, -1)));
                var pointMaterial = meshRenderer.material = new feng3d.PointMaterial();
                pointMaterial.enableBlend = true;
                pointMaterial.pointSize = 5;
                pointMaterial.color = new feng3d.Color(163 / 255 * 1.2, 162 / 255 * 1.2, 107 / 255 * 1.2);
                this.gameObject.addChild(lightpoints);
                this.enabled = true;
            }
            update() {
                this.textureMaterial.color = this.pointLight.color;
                this.lightLines.transform.scale =
                    this.lightLines1.transform.scale =
                        this.lightpoints.transform.scale =
                            new feng3d.Vector3D(this.pointLight.range, this.pointLight.range, this.pointLight.range);
                if (editor.editor3DData.selectedObject == this.gameObject) {
                    //
                    var camerapos = this.gameObject.transform.inverseTransformPoint(editor.engine.camera.gameObject.transform.scenePosition);
                    //
                    this.segmentGeometry.removeAllSegments();
                    var alpha = 1;
                    var backalpha = 0.1;
                    var num = 36;
                    var point0;
                    var point1;
                    for (var i = 0; i < num; i++) {
                        var angle = i * Math.PI * 2 / num;
                        var x = Math.sin(angle);
                        var y = Math.cos(angle);
                        var angle1 = (i + 1) * Math.PI * 2 / num;
                        var x1 = Math.sin(angle1);
                        var y1 = Math.cos(angle1);
                        //
                        point0 = new feng3d.Vector3D(0, x, y);
                        point1 = new feng3d.Vector3D(0, x1, y1);
                        if (point0.dotProduct(camerapos) < 0 || point1.dotProduct(camerapos) < 0)
                            alpha = backalpha;
                        else
                            alpha = 1.0;
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(1, 1, 1, alpha), new feng3d.Color(1, 1, 1, alpha)));
                        point0 = new feng3d.Vector3D(x, 0, y);
                        point1 = new feng3d.Vector3D(x1, 0, y1);
                        if (point0.dotProduct(camerapos) < 0 || point1.dotProduct(camerapos) < 0)
                            alpha = backalpha;
                        else
                            alpha = 1.0;
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(1, 1, 1, alpha), new feng3d.Color(1, 1, 1, alpha)));
                        point0 = new feng3d.Vector3D(x, y, 0);
                        point1 = new feng3d.Vector3D(x1, y1, 0);
                        if (point0.dotProduct(camerapos) < 0 || point1.dotProduct(camerapos) < 0)
                            alpha = backalpha;
                        else
                            alpha = 1.0;
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(1, 1, 1, alpha), new feng3d.Color(1, 1, 1, alpha)));
                    }
                    this.pointGeometry.removeAllPoints();
                    var point = new feng3d.Vector3D(1, 0, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    point = new feng3d.Vector3D(-1, 0, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    point = new feng3d.Vector3D(0, 1, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    point = new feng3d.Vector3D(0, -1, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    point = new feng3d.Vector3D(0, 0, 1);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    point = new feng3d.Vector3D(0, 0, -1);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 1, 1, alpha)));
                    //
                    this.lightLines.visible = true;
                    this.lightLines1.visible = true;
                    this.lightpoints.visible = true;
                }
                else {
                    this.lightLines.visible = false;
                    this.lightLines1.visible = false;
                    this.lightpoints.visible = false;
                }
            }
            dispose() {
                this.enabled = false;
                this.textureMaterial = null;
                this.pointLight = null;
                //
                this.lightIcon.dispose();
                this.lightLines.dispose();
                this.lightLines1.dispose();
                this.lightpoints.dispose();
                this.lightIcon = null;
                this.lightLines = null;
                this.lightLines1 = null;
                this.lightpoints = null;
                this.segmentGeometry = null;
                super.dispose();
            }
        }
        editor.PointLightIcon = PointLightIcon;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        feng3d.loadjs.load({
            paths: [
                "threejs/three.js",
                // <!-- FBX -->
                "threejs/loaders/AMFLoader.js",
                "threejs/loaders/AWDLoader.js",
                "threejs/loaders/BabylonLoader.js",
                "threejs/loaders/ColladaLoader.js",
                "threejs/loaders/FBXLoader.js",
                "threejs/loaders/GLTFLoader.js",
                "threejs/loaders/KMZLoader.js",
                "threejs/loaders/MD2Loader.js",
                "threejs/loaders/OBJLoader.js",
                "threejs/loaders/MTLLoader.js",
                "threejs/loaders/PlayCanvasLoader.js",
                "threejs/loaders/PLYLoader.js",
                "threejs/loaders/STLLoader.js",
                "threejs/loaders/TGALoader.js",
                "threejs/loaders/TDSLoader.js",
                "threejs/loaders/UTF8Loader.js",
                "threejs/loaders/VRMLLoader.js",
                "threejs/loaders/VTKLoader.js",
                "threejs/loaders/ctm/lzma.js",
                "threejs/loaders/ctm/ctm.js",
                "threejs/loaders/ctm/CTMLoader.js",
            ],
            bundleId: "threejs",
            success: () => {
                Number.prototype["format"] = function () {
                    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                };
                // console.log("提供解析的 three.js 初始化完成，")
            }
        });
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.threejsLoader = { load: load };
        var usenumberfixed = true;
        function load(url, onParseComplete) {
            var skeletonComponent;
            //
            var loader = new window["THREE"].FBXLoader();
            loader.load(url, onLoad, onProgress, onError);
            function onLoad(scene) {
                var gameobject = parse(scene);
                gameobject.transform.sx = -1;
                onParseComplete && onParseComplete(gameobject);
                console.log("onLoad");
            }
            function onProgress(event) {
                console.log(event);
            }
            function onError(err) {
                console.error(err);
            }
            function parse(object3d, parent) {
                if (object3d.type == "Bone")
                    return null;
                var gameobject = feng3d.GameObject.create(object3d.name);
                gameobject.transform.position = new feng3d.Vector3D(object3d.position.x, object3d.position.y, object3d.position.z);
                gameobject.transform.orientation = new feng3d.Quaternion(object3d.quaternion.x, object3d.quaternion.y, object3d.quaternion.z, object3d.quaternion.w);
                gameobject.transform.scale = new feng3d.Vector3D(object3d.scale.x, object3d.scale.y, object3d.scale.z);
                if (parent)
                    parent.addChild(gameobject);
                switch (object3d.type) {
                    case "PerspectiveCamera":
                        gameobject.addComponent(feng3d.Camera).lens = parsePerspectiveCamera(object3d);
                        break;
                    case "SkinnedMesh":
                        var skinnedMeshRenderer = gameobject.addComponent(feng3d.SkinnedMeshRenderer);
                        skinnedMeshRenderer.geometry = parseGeometry(object3d.geometry);
                        skinnedMeshRenderer.material = parseMaterial(object3d.material);
                        console.assert(object3d.bindMode == "attached");
                        skinnedMeshRenderer.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                        if (parent)
                            skinnedMeshRenderer.initMatrix3d = gameobject.transform.localToWorldMatrix.clone();
                        break;
                    case "Mesh":
                        var meshRenderer = gameobject.addComponent(feng3d.MeshRenderer);
                        meshRenderer.geometry = parseGeometry(object3d.geometry);
                        meshRenderer.material = parseMaterial(object3d.material);
                        break;
                    case "Group":
                        if (object3d.skeleton) {
                            skeletonComponent = gameobject.addComponent(feng3d.SkeletonComponent);
                            skeletonComponent.joints = parseSkeleton(object3d.skeleton);
                        }
                        break;
                    case "Bone":
                        //Bone 由SkeletonComponent自动生成，不用解析
                        break;
                    default:
                        console.warn(`没有提供 ${object3d.type} 类型对象的解析`);
                        break;
                }
                if (object3d.animations && object3d.animations.length > 0) {
                    var animation = gameobject.addComponent(feng3d.Animation);
                    for (var i = 0; i < object3d.animations.length; i++) {
                        var animationClip = parseAnimations(object3d.animations[i]);
                        animation.animations.push(animationClip);
                        animation.animation = animation.animations[0];
                    }
                }
                object3d.children.forEach(element => {
                    parse(element, gameobject);
                });
                return gameobject;
            }
        }
        function parseAnimations(animationClipData) {
            var matrixTemp = new window["THREE"].Matrix4();
            var quaternionTemp = new window["THREE"].Quaternion();
            var fmatrix3d = new feng3d.Matrix3D();
            //
            var animationClip = new feng3d.AnimationClip();
            animationClip.name = animationClipData.name;
            animationClip.length = animationClipData.duration * 1000;
            animationClip.propertyClips = [];
            var tracks = animationClipData.tracks;
            var len = tracks.length;
            for (var i = 0; i < len; i++) {
                var propertyClip = parsePropertyClip(tracks[i]);
                animationClip.propertyClips.push(propertyClip);
            }
            return animationClip;
            function parsePropertyClip(keyframeTrack) {
                var propertyClip = new feng3d.PropertyClip();
                var trackName = keyframeTrack.name;
                var result = /\.bones\[(\w+)\]\.(\w+)/.exec(trackName);
                propertyClip.path = [
                    [feng3d.PropertyClipPathItemType.GameObject, result[1]],
                    [feng3d.PropertyClipPathItemType.Component, , "feng3d.Transform"],
                ];
                switch (result[2]) {
                    case "position":
                        propertyClip.propertyName = "position";
                        break;
                    case "scale":
                        propertyClip.propertyName = "scale";
                        break;
                    case "quaternion":
                        propertyClip.propertyName = "orientation";
                        break;
                    default:
                        console.warn(`没有处理 propertyName ${result[2]}`);
                        break;
                }
                propertyClip.propertyValues = [];
                var propertyValues = propertyClip.propertyValues;
                var times = keyframeTrack.times;
                var values = usenumberfixed ? feng3d.numberutils.fixed(keyframeTrack.values, 6, []) : keyframeTrack.values;
                var len = times.length;
                switch (keyframeTrack.ValueTypeName) {
                    case "vector":
                        propertyClip.type = "Vector3D";
                        for (var i = 0; i < len; i++) {
                            propertyValues.push([times[i] * 1000, [values[i * 3], values[i * 3 + 1], values[i * 3 + 2]]]);
                        }
                        break;
                    case "quaternion":
                        propertyClip.type = "Quaternion";
                        for (var i = 0; i < len; i++) {
                            propertyValues.push([times[i] * 1000, [values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3]]]);
                        }
                        break;
                    default:
                        console.warn(`没有提供解析 ${keyframeTrack.ValueTypeName} 类型Track数据`);
                        break;
                }
                return propertyClip;
            }
        }
        function parseSkeleton(skeleton) {
            var joints = [];
            var skeNameDic = {};
            var len = skeleton.bones.length;
            for (var i = 0; i < len; i++) {
                skeNameDic[skeleton.bones[i].name] = i;
            }
            for (var i = 0; i < len; i++) {
                var bone = skeleton.bones[i];
                var skeletonJoint = joints[i] = new feng3d.SkeletonJoint();
                //
                skeletonJoint.name = bone.name;
                skeletonJoint.matrix3D = new feng3d.Matrix3D(bone.matrixWorld.elements);
                var parentId = skeNameDic[bone.parent.name];
                if (parentId === undefined)
                    parentId = -1;
                skeletonJoint.parentIndex = parentId;
            }
            return joints;
        }
        function parseSkinnedSkeleton(skeleton, skinSkeletonData) {
            var skinSkeleton = new feng3d.SkinSkeletonTemp();
            var joints = skeleton.joints;
            var jointsMap = {};
            for (var i = 0; i < joints.length; i++) {
                jointsMap[joints[i].name] = [i, joints[i].name];
            }
            var bones = skinSkeletonData.bones;
            var len = bones.length;
            skinSkeleton.numJoint = len;
            for (var i = 0; i < len; i++) {
                var jointsMapitem = jointsMap[bones[i].name];
                if (jointsMapitem == null && bones[i].parent) {
                    jointsMapitem = jointsMap[bones[i].parent.name];
                }
                if (jointsMapitem) {
                    skinSkeleton.joints[i] = jointsMapitem;
                    joints[jointsMapitem[0]].matrix3D = new feng3d.Matrix3D(skinSkeletonData.boneInverses[i].elements).invert();
                }
                else {
                    console.warn(`没有在骨架中找到 骨骼 ${bones[i].name}`);
                }
            }
            return skinSkeleton;
        }
        function parseGeometry(geometry) {
            var attributes = geometry.attributes;
            var geo = new feng3d.CustomGeometry();
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    var element = attributes[key];
                    var array = usenumberfixed ? feng3d.numberutils.fixed(element.array, 6, []) : element.array;
                    switch (key) {
                        case "position":
                            geo.positions = array;
                            break;
                        case "normal":
                            geo.normals = array;
                            break;
                        case "uv":
                            geo.uvs = array;
                            break;
                        case "skinIndex":
                            geo.setVAData("a_jointindex0", array, 4);
                            break;
                        case "skinWeight":
                            geo.setVAData("a_jointweight0", array, 4);
                            break;
                        default:
                            console.warn("没有解析顶点数据", key);
                            break;
                    }
                }
            }
            if (geometry.index) {
                geo.indices = geometry.index;
            }
            return geo;
        }
        function parseMaterial(geometry) {
            var material = new feng3d.StandardMaterial();
            material.cullFace = feng3d.GL.NONE;
            return material;
        }
        function parsePerspectiveCamera(perspectiveCamera) {
            var perspectiveLen = new feng3d.PerspectiveLens();
            perspectiveLen.near = perspectiveCamera.near;
            perspectiveLen.far = perspectiveCamera.far;
            perspectiveLen.aspectRatio = perspectiveCamera.aspect;
            perspectiveLen.fieldOfView = perspectiveCamera.fov;
            return perspectiveLen;
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 层级界面创建3D对象列表数据
         */
        editor.createObjectConfig = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
            {
                label: "GameObject", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createGameObject());
                }
            },
            {
                label: "Plane", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createPlane());
                }
            },
            {
                label: "Cube", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createCube());
                }
            },
            {
                label: "Sphere", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createSphere());
                }
            },
            {
                label: "Capsule", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createCapsule());
                }
            },
            {
                label: "Cylinder", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createCylinder());
                }
            },
            {
                label: "Cone", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createCone());
                }
            },
            {
                label: "Torus", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createTorus());
                }
            },
            {
                label: "Particle", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createParticle());
                }
            },
            {
                label: "Camera", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createCamera());
                }
            },
            {
                label: "PointLight", click: () => {
                    addToHierarchy(feng3d.GameObjectFactory.createPointLight());
                }
            },
            {
                label: "DirectionalLight", click: () => {
                    var gameobject = feng3d.GameObject.create("DirectionalLight");
                    gameobject.addComponent(feng3d.DirectionalLight);
                    addToHierarchy(gameobject);
                }
            },
        ];
        function addToHierarchy(gameobject) {
            editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
            editor.editor3DData.selectedObject = gameobject;
        }
        /**
         * 层级界面创建3D对象列表数据
         */
        editor.createObject3DComponentConfig = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
            { label: "ParticleAnimator", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.ParticleAnimator); } },
            { label: "Camera", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.Camera); } },
            { label: "PointLight", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.PointLight); } },
            { label: "DirectionalLight", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.DirectionalLight); } },
            { label: "Script", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.Script); } },
            { label: "MouseRayTestScript", click: () => { editor.needcreateComponentGameObject.addComponent(editor.MouseRayTestScript); } },
            { label: "OutLineComponent", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.OutLineComponent); } },
            { label: "HoldSizeComponent", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.HoldSizeComponent); } },
            { label: "BillboardComponent", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.BillboardComponent); } },
            { label: "Animation", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.Animation); } },
            // { label: "LineComponent", click: () => { needcreateComponentGameObject.addComponent(LineComponent); } },
            { label: "CartoonComponent", click: () => { editor.needcreateComponentGameObject.addComponent(feng3d.CartoonComponent); } },
        ];
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        function objectViewConfig() {
            //
            feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
            feng3d.objectview.defaultObjectViewClass = "OVDefault";
            feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
            feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
            //
            feng3d.objectview.defaultTypeAttributeView["Boolean"] = { component: "BooleanAttrView" };
            feng3d.objectview.defaultTypeAttributeView["number"] = { component: "OAVNumber" };
            feng3d.objectview.defaultTypeAttributeView["Vector3D"] = { component: "OAVVector3D" };
            feng3d.objectview.defaultTypeAttributeView["Array"] = { component: "OAVArray" };
            function setObjectview(cls, classDefinition) {
                cls["objectview"] = classDefinition;
            }
        }
        editor.objectViewConfig = objectViewConfig;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
/**
 * 快捷键配置
 */
var shortcutConfig = [
    //	key					[必须]	快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
    //	command				[可选]	要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
    //	stateCommand		[可选]	要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
    //	when				[可选]	快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。
    { key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "mouseInView3D" },
    { key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
    { key: "f", command: "lookToSelectedObject3D", when: "" },
    { key: "w", command: "object3DMoveTool", when: "!fpsViewing" },
    { key: "e", command: "object3DRotationTool", when: "!fpsViewing" },
    { key: "r", command: "object3DScaleTool", when: "!fpsViewing" },
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "" },
    { key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
    { key: "mouseup", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
    { key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "dragScene", when: "dragSceneing" },
    { key: "middlemouseup", stateCommand: "!dragSceneing", when: "dragSceneing" },
    { key: "del", command: "deleteSeletedObject3D", when: "" },
    { key: "mousewheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
];
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.$editorEventDispatcher = new feng3d.Event();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 编辑器
         * @author feng 2016-10-29
         */
        class Editor extends eui.UILayer {
            constructor() {
                super();
                this.initeditorcache(this.init.bind(this));
            }
            init() {
                //
                editor.editor3DData = new editor.Editor3DData();
                //初始化配置
                editor.objectViewConfig();
                document.head.getElementsByTagName("title")[0].innerText = "editor -- " + editor.assets.projectPath;
                //
                new editor.EditorEnvironment();
                //初始化feng3d
                new editor.Main3D();
                feng3d.shortcut.addShortCuts(shortcutConfig);
                this.addChild(new editor.MainUI());
                editor.editorshortcut.init();
                this.once(egret.Event.ENTER_FRAME, function () {
                    //
                    editor.mouseEventEnvironment = new editor.MouseEventEnvironment();
                }, this);
                this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
            }
            initeditorcache(callback) {
                //获取项目路径
                editor.file.readFile("editorcache.json", (err, data) => {
                    if (err) {
                        createnewproject();
                    }
                    else {
                        try {
                            editor.editorcache = JSON.parse(data);
                            tryprojectpath();
                        }
                        catch (e) {
                            createnewproject();
                        }
                    }
                });
                function tryprojectpath() {
                    editor.file.stat(editor.editorcache.projectpath, (err, stats) => {
                        if (!err) {
                            editor.assets.projectPath = editor.editorcache.projectpath;
                            editor.file.writeJsonFile("editorcache.json", editor.editorcache);
                            editor.electron.call("initproject", { param: { path: editor.editorcache.projectpath } });
                            callback();
                            return;
                        }
                        editor.editorcache.historyprojectpaths = editor.editorcache.historyprojectpaths || [];
                        var index = editor.editorcache.historyprojectpaths.indexOf(editor.editorcache.projectpath);
                        if (index != -1)
                            editor.editorcache.historyprojectpaths.splice(index, 1);
                        if (editor.editorcache.historyprojectpaths.length > 0) {
                            editor.editorcache.projectpath = editor.editorcache.historyprojectpaths[0];
                            tryprojectpath();
                        }
                        else {
                            createnewproject();
                        }
                    });
                }
                function createnewproject() {
                    //选择项目路径
                    editor.electron.call("selected-directory", {
                        param: { title: "选择项目路径" },
                        callback: (path) => {
                            editor.electron.call("createproject", {
                                param: { path: path }, callback: () => {
                                    editor.electron.call("initproject", { param: { path: path } });
                                    editor.editorcache.projectpath = editor.assets.projectPath = path;
                                    editor.editorcache.historyprojectpaths = editor.editorcache.historyprojectpaths = [];
                                    if (editor.editorcache.historyprojectpaths.indexOf(path) == -1)
                                        editor.editorcache.historyprojectpaths.unshift(path);
                                    editor.file.writeJsonFile("editorcache.json", editor.editorcache);
                                    callback();
                                }
                            });
                        }
                    });
                }
            }
            _onAddToStage() {
                editor.editor3DData.stage = this.stage;
            }
        }
        editor.Editor = Editor;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=editor.js.map

(function universalModuleDefinition(root, factory)
{
    if (root && root["feng3d"])
    {
        return;
    }
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["feng3d"] = factory();
    else
    {
        root["feng3d"] = factory();
    }
})(this, function ()
{
    return feng3d;
});