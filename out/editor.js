var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * Created by 黑暗之神KDS on 2017/2/17.
         */
        /**
         * 文件对象
         * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
         * -- 其他端支持绝对路径
         * Created by kds on 2017/1/21 0021.
         */
        var FileObject = /** @class */ (function () {
            /**
             * 构造函数
             *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
             *       -- 是否存在
             *       -- 文件大小
             *       -- 创建日期
             *       -- 最近一次的修改日期
             * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
             * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
             * @param thisPtr 执行域
             * @param onError 当错误时返回 onError([object FileObject])
             * @param isGetFileInfo 初始就获取下该文件的基本信息
             */
            function FileObject(path, onComplete, thisPtr, onError, isGetFileInfo) {
                this.updateStats(path, null, onComplete, onError);
            }
            /**
             * 判断文件名是否合法
             * @param fileName 文件名
             */
            FileObject.isLegalName = function (fileName) {
                return true;
            };
            Object.defineProperty(FileObject.prototype, "exists", {
                /**
                 * 文件/文件夹是否存在 基本探索过后才可知道是否存在
                 */
                get: function () {
                    return this._exists;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "size", {
                /**
                 * 文件尺寸
                 */
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "isDirectory", {
                /**
                 * 是否是文件夹
                 */
                get: function () {
                    return this._isDirectory;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "createDate", {
                /**
                 * 创建日期
                 */
                get: function () {
                    return this._createDate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "lastModifyDate", {
                /**
                 * 上次修改日期
                 */
                get: function () {
                    return this._lastModifyDate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "path", {
                /**
                 * 路径
                 * -- WEB端是相对路径
                 * -- 其他端支持绝对路径 file:///xxx/yyy
                 */
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "fileName", {
                /**
                 * 文件或文件夹名 xxx.ks
                 */
                get: function () {
                    var fileName = this.path.split("/").pop();
                    return fileName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "fileNameWithoutExt", {
                /**
                 * 不包含格式的文件名称 如 xxx.ks就是xxx
                 */
                get: function () {
                    var fileName = this.fileName;
                    var fileNameWithoutExt = (fileName.indexOf(".") == -1) ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
                    return fileNameWithoutExt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "location", {
                /**
                 * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
                 */
                get: function () {
                    var paths = this.path.split("/");
                    paths.pop();
                    var location = paths.join("/");
                    return location;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "fullPath", {
                /**
                 * 绝对路径
                 * -- WEB端的是 http://xxxx
                 * -- 其他端的是 file:///xxxx
                 */
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileObject.prototype, "extension", {
                /**
                 * 格式
                 */
                get: function () {
                    var fileName = this.fileName;
                    if (fileName.indexOf(".") == -1)
                        return "";
                    var extension = fileName.split(".").pop();
                    return extension;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取该文件下的目录
             * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
             * @param onError 失败时回调 onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.getDirectoryListing = function (onComplete, onError, thisPtr) {
                var _this = this;
                editor.fs.readdir(this._path, function (err, files) {
                    if (err) {
                        feng3d.warn(err);
                        onError(_this);
                    }
                    else {
                        onComplete(_this, files);
                    }
                });
            };
            /**
             * 创建文件夹
             * @param onComplete 完成时回调 onComplete([object FileObject])
             * @param onError 错误时回调 onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.createDirectory = function (onComplete, onError, thisPtr) {
                var _this = this;
                editor.fs.mkdir(this._path, function (err) {
                    if (err) {
                        feng3d.warn(_this);
                        onError(_this);
                        return;
                    }
                    _this.updateStats(_this._path, function () {
                        onComplete(_this);
                    });
                });
            };
            /**
             * 创建文件
             * @param content 初次创建时的内容 一般可为""
             * @param onComplete 完成时回调 onComplete([object FileObject])
             * @param onError 错误时回调 onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.createFile = function (content, onComplete, onError, thisPtr) {
                this.saveFile(content, onComplete, onError, thisPtr);
            };
            /**
             * 储存文件（文本格式）
             * @param content 文件内容文本
             * @param onComplete 完成时回调 onComplete([object FileObject])
             * @param onError 错误时回调 onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.saveFile = function (content, onComplete, onError, thisPtr) {
                var _this = this;
                if (typeof content == "string") {
                    feng3d.dataTransform.stringToUint8Array(content, function (uint8Array) {
                        _this.saveFile(uint8Array, onComplete, onError, thisPtr);
                    });
                    return;
                }
                editor.fs.writeFile(this._path, content, function (err) {
                    if (err) {
                        onError(_this);
                    }
                    else {
                        _this.updateStats(_this._path, function () {
                            onComplete(_this);
                        });
                    }
                });
            };
            /**
             * 重命名
             * @param newName 重命名
             * @param onComplete 完成时回调 onComplete([object FileObject])
             * @param onError 错误时回调 onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.rename = function (newName, onComplete, onError, thisPtr) {
                var _this = this;
                var oldPath = this._path;
                var newPath = this.location ? (this.location + "/" + newName) : newName;
                editor.fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        feng3d.warn(err);
                        onError(_this);
                        return;
                    }
                    _this.updateStats(newPath, function () {
                        onComplete(_this);
                    });
                });
            };
            /**
             * 移动文件夹
             * @param newPath 新的路径
             * @param onComplete 完成时回调 onComplete([object FileObject])
             * @param onError 失败时回调  onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.move = function (newPath, onComplete, onError, thisPtr) {
                var _this = this;
                editor.fs.move(this._path, newPath, function (err) {
                    if (err) {
                        feng3d.warn(err);
                        onError(_this);
                        return;
                    }
                    _this.updateStats(newPath, function () {
                        onComplete(_this);
                    });
                });
            };
            /**
             * 删除文件（夹）
             * @param onComplete onComplete([object FileObject])
             * @param onError onError([object FileObject])
             * @param thisPtr 执行域
             */
            FileObject.prototype.delete = function (onComplete, onError, thisPtr) {
                var _this = this;
                editor.fs.remove(this._path, function (err) {
                    if (err) {
                        feng3d.warn(err);
                        onError(_this);
                        return;
                    }
                    _this._exists = false;
                    onComplete(_this);
                });
            };
            /**
             * 打开文件
             * @param onFin 完成时回调 onFin(txt:string)
             * @param onError 错误时回调 onError([fileObject])
             */
            FileObject.prototype.open = function (onFin, onError) {
                throw "未实现";
            };
            /**
             * 更新状态
             * @param callback 回调函数
             */
            FileObject.prototype.updateStats = function (path, callback, onComplete, onError) {
                var _this = this;
                editor.fs.stat(path, function (err, stats) {
                    if (err) {
                        _this._exists = false;
                        onError && onError(_this);
                    }
                    else {
                        _this._exists = true;
                        _this._size = stats.size;
                        _this._path = stats.path;
                        _this._isDirectory = stats.isDirectory;
                        _this._createDate = new Date(stats.birthtime);
                        _this._lastModifyDate = new Date(stats.mtime);
                        onError && onComplete(_this);
                    }
                    callback && callback();
                });
            };
            return FileObject;
        }());
        editor.FileObject = FileObject;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var zip;
        var _projectname;
        editor.zipfs = {
            hasProject: function (projectname, callback) {
                callback(false);
            },
            getProjectList: function (callback) {
                callback(null, []);
            },
            initproject: function (projectname, callback) {
                _projectname = projectname;
                // todo 启动监听 ts代码变化自动编译
                callback();
            },
            //
            stat: function (path, callback) {
                var file = zip.files[path] || zip.files[path + "/"];
                if (file) {
                    var fileInfo = {
                        path: path,
                        size: 0 /*file.size*/,
                        isDirectory: file.dir,
                        birthtime: file.date.getTime(),
                        mtime: file.date.getTime(),
                    };
                    callback(null, fileInfo);
                }
                else {
                    callback(new Error(path + " 不存在"), null);
                }
            },
            readdir: function (path, callback) {
                var allfilepaths = Object.keys(zip.files);
                var subfilemap = {};
                allfilepaths.forEach(function (element) {
                    var result = new RegExp(path + "\\/([\\w\\s\\(\\).\\u4e00-\\u9fa5]+)\\b").exec(element);
                    if (result != null) {
                        subfilemap[result[1]] = 1;
                    }
                });
                var files = Object.keys(subfilemap);
                callback(null, files);
            },
            writeFile: function (path, data, callback) {
                try {
                    zip.file(path, data);
                    callback && callback(null);
                }
                catch (error) {
                    callback && callback(error);
                }
            },
            readFile: function (path, callback) {
                try {
                    zip.file(path).async("arraybuffer").then(function (data) {
                        callback(null, data);
                    }, function (reason) {
                        callback(reason, null);
                    });
                }
                catch (error) {
                    callback(error, null);
                }
            },
            /**
            * 读取文件为字符串
            */
            readFileAsString: function (path, callback) {
                try {
                    zip.file(path).async("string").then(function (data) {
                        callback(null, data);
                    }, function (reason) {
                        callback(reason, null);
                    });
                }
                catch (error) {
                    callback(error, null);
                }
            },
            mkdir: function (path, callback) {
                zip.folder(path);
                callback(null);
            },
            rename: function (oldPath, newPath, callback) {
                try {
                    zip.file(oldPath).async("arraybuffer").then(function (value) {
                        zip.file(newPath, value);
                        zip.remove(oldPath);
                        callback && callback(null);
                    }, function (reason) {
                        callback && callback(reason);
                    });
                }
                catch (error) {
                    callback && callback(error);
                }
            },
            move: function (src, dest, callback) {
                try {
                    var srcstats = zip.file(src);
                    var destexists = zip.file(dest);
                    if (destexists && !destexists.dir) {
                        zip.remove(dest);
                    }
                    if (srcstats.dir) {
                        if (!destexists)
                            zip.folder(dest);
                        var files = Object.keys(zip.folder(src).files);
                        files.forEach(function (file, index) {
                            editor.zipfs.move(src + "/" + file, dest + "/" + file);
                        });
                        zip.remove(src);
                    }
                    else {
                        //使用重命名移动文件
                        editor.zipfs.rename(src, dest, null);
                    }
                    callback && callback(null);
                }
                catch (error) {
                    callback && callback(error);
                }
            },
            remove: function (path, callback) {
                try {
                    var file = zip.file(path);
                    if (file.dir) {
                        //返回文件和子目录的数组
                        var files = Object.keys(zip.folder(path).files);
                        files.forEach(function (file, index) {
                            editor.zipfs.remove(path + "/" + file, null);
                        });
                        //清除文件夹
                        zip.remove(path);
                    }
                    else {
                        zip.remove(path);
                    }
                    callback && callback(null);
                }
                catch (error) {
                    callback && callback(error);
                }
            },
            /**
             * 获取文件绝对路径
             */
            getAbsolutePath: function (path, callback) {
                callback(null, null);
            },
            /**
             * 获取指定文件下所有文件路径列表
             */
            getAllfilepathInFolder: function (dirpath, callback) {
                var allfilepaths = Object.keys(zip.files);
                var subfilemap = {};
                var files = [];
                allfilepaths.forEach(function (element) {
                    var result = new RegExp(dirpath + "\\/([\\w.]+)\\b").exec(element);
                    if (result != null) {
                        files.push(element);
                    }
                });
                callback(null, files);
            },
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        if (1) 
        // if (typeof require == "undefined")
        {
            // fs = zipfs;
            editor.fs = feng3d.indexedDBfs;
        }
        else {
            editor.fs = require(__dirname + "/io/file.js").file;
        }
        (function () {
            /**
             * 创建项目
             */
            editor.fs.createproject = function (projectname, callback) {
                editor.fs.initproject(projectname, function () {
                    //
                    var zip = new JSZip();
                    var request = new XMLHttpRequest();
                    request.open('Get', "./templates/template.zip", true);
                    request.responseType = "arraybuffer";
                    request.onload = function (ev) {
                        zip.loadAsync(request.response).then(function () {
                            var filepaths = Object.keys(zip.files);
                            filepaths.sort();
                            readfiles();
                            /**
                             * 读取zip中所有文件
                             */
                            function readfiles() {
                                if (filepaths.length > 0) {
                                    var filepath = filepaths.shift();
                                    var file = zip.files[filepath];
                                    if (file.dir) {
                                        editor.fs.mkdir(filepath, readfiles);
                                    }
                                    else {
                                        file.async("arraybuffer").then(function (data) {
                                            editor.fs.writeFile(filepath, data, readfiles);
                                        }, function (reason) {
                                            console.warn(reason);
                                            readfiles();
                                        });
                                    }
                                }
                                else {
                                    callback();
                                }
                            }
                        });
                    };
                    request.onerror = function (ev) {
                        feng3d.error(request.responseURL + "不存在，无法初始化项目！");
                    };
                    request.send();
                });
            };
        })();
        (function () {
            var isSelectFile = false;
            editor.fs.selectFile = function (callback) {
                selectFileCallback = callback;
                isSelectFile = true;
            };
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.style.display = "none";
            fileInput.addEventListener('change', function (event) {
                selectFileCallback && selectFileCallback(fileInput.files);
                selectFileCallback = null;
                fileInput.value = null;
            });
            // document.body.appendChild(fileInput);
            window.addEventListener("click", function () {
                if (isSelectFile)
                    fileInput.click();
                isSelectFile = false;
            });
            var selectFileCallback;
        })();
        (function () {
            if (!editor.fs.exportProject) {
                editor.fs.exportProject = readdirToZip;
                function readdirToZip(callback) {
                    var zip = new JSZip();
                    editor.fs.getAllfilepathInFolder("", function (err, filepaths) {
                        readfiles();
                        function readfiles() {
                            if (filepaths.length > 0) {
                                var filepath = filepaths.shift();
                                editor.fs.readFile(filepath, function (err, data) {
                                    zip.file(filepath, data);
                                    readfiles();
                                });
                            }
                            else {
                                zip.generateAsync({ type: "blob" }).then(function (content) {
                                    callback(null, content);
                                });
                            }
                        }
                    });
                }
            }
        })();
        (function () {
            editor.fs.importProject = function (file, callback) {
                var zip = new JSZip();
                zip.loadAsync(file).then(function (value) {
                    var filepaths = Object.keys(value.files);
                    filepaths.sort();
                    writeFiles();
                    function writeFiles() {
                        if (filepaths.length > 0) {
                            var filepath = filepaths.shift();
                            if (value.files[filepath].dir) {
                                editor.fs.mkdir(filepath, function (err) {
                                    writeFiles();
                                });
                            }
                            else {
                                zip.file(filepath).async("arraybuffer").then(function (data) {
                                    editor.fs.writeFile(filepath, data, function (err) {
                                        writeFiles();
                                    });
                                }, function (reason) {
                                });
                            }
                        }
                        else {
                            callback();
                        }
                    }
                });
            };
        })();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var EditorCache = /** @class */ (function () {
            function EditorCache() {
                var value = localStorage.getItem("feng3d-editor");
                if (!value)
                    return;
                var obj = JSON.parse(value);
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        this[key] = obj[key];
                    }
                }
            }
            EditorCache.prototype.save = function () {
                localStorage.setItem("feng3d-editor", JSON.stringify(this));
            };
            return EditorCache;
        }());
        editor.EditorCache = EditorCache;
        editor.editorcache = new EditorCache();
        window.addEventListener("beforeunload", function () {
            editor.editorcache.save();
        });
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
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
        }
        function register(displayObject, setdargSource, accepttypes, onDragDrop) {
            unregister(displayObject);
            registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });
            if (setdargSource)
                displayObject.addEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
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
            acceptableitems && acceptableitems.forEach(function (element) {
                element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
            acceptableitems = null;
            accepters && accepters.forEach(function (accepter) {
                accepter.alpha = 1.0;
                var accepteritem = getitem(accepter);
                accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
            });
            accepters = null;
            dragitem = null;
        }
        function onMouseMove(event) {
            stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
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
            acceptableitems.forEach(function (element) {
                element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
        }
        function refreshAcceptables() {
            acceptableitems && acceptableitems.forEach(function (element) {
                element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null);
            });
            acceptableitems = null;
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce(function (value, item) {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
            acceptableitems.forEach(function (element) {
                element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, onMouseOver, null);
                element.displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, onMouseOut, null);
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
        var dragSceneMousePoint;
        var dragSceneCameraGlobalMatrix3D;
        var rotateSceneCenter;
        var rotateSceneCameraGlobalMatrix3D;
        var rotateSceneMousePoint;
        function init() {
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", onDeleteSeletedGameObject);
            feng3d.shortcut.on("gameobjectMoveTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.MOVE;
            });
            feng3d.shortcut.on("gameobjectRotationTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.ROTATION;
            });
            feng3d.shortcut.on("gameobjectScaleTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.SCALE;
            });
            feng3d.shortcut.on("selectGameObject", function () {
                var gameObject = editor.engine.mouse3DManager.getSelectedGameObject();
                if (!gameObject || !gameObject.scene) {
                    editor.editorData.selectedObjects = null;
                    return;
                }
                if (editor.editorData.mrsToolObject == gameObject)
                    return;
                var node = editor.hierarchyTree.getNode(gameObject);
                while (!node && gameObject.parent) {
                    if (editor.editorData.mrsToolObject == gameObject)
                        return;
                    gameObject = gameObject.parent;
                    node = editor.hierarchyTree.getNode(gameObject);
                }
                if (gameObject != gameObject.scene.gameObject) {
                    editor.editorData.selectObject(gameObject);
                }
                else {
                    editor.editorData.selectedObjects = null;
                }
            });
            var preMousePoint;
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", function () {
                preMousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            });
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", function () {
                var currentMousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
                var moveDistance = (currentMousePoint.x + currentMousePoint.y - preMousePoint.x - preMousePoint.y) * editor.sceneControlConfig.sceneCameraForwardBackwardStep;
                editor.sceneControlConfig.lookDistance -= moveDistance;
                var forward = editor.editorCamera.transform.localToWorldMatrix.forward;
                var camerascenePosition = editor.editorCamera.transform.scenePosition;
                var newCamerascenePosition = new feng3d.Vector3D(forward.x * moveDistance + camerascenePosition.x, forward.y * moveDistance + camerascenePosition.y, forward.z * moveDistance + camerascenePosition.z);
                var newCameraPosition = editor.editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
                editor.editorCamera.transform.position = newCameraPosition;
                preMousePoint = currentMousePoint;
            });
            //
            feng3d.shortcut.on("lookToSelectedGameObject", onLookToSelectedGameObject);
            feng3d.shortcut.on("dragSceneStart", onDragSceneStart);
            feng3d.shortcut.on("dragScene", onDragScene);
            feng3d.shortcut.on("fpsViewStart", onFpsViewStart);
            feng3d.shortcut.on("fpsViewStop", onFpsViewStop);
            feng3d.shortcut.on("mouseRotateSceneStart", onMouseRotateSceneStart);
            feng3d.shortcut.on("mouseRotateScene", onMouseRotateScene);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", onMouseWheelMoveSceneCamera);
        }
        function onDeleteSeletedGameObject() {
            var selectedObject = editor.editorData.selectedObjects;
            if (!selectedObject)
                return;
            selectedObject.forEach(function (element) {
                if (element instanceof feng3d.GameObject) {
                    element.remove();
                }
                else if (element instanceof editor.AssetsFile) {
                    element.deleteFile();
                }
            });
            //
            editor.editorData.selectedObjects = null;
        }
        function onDragSceneStart() {
            dragSceneMousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            dragSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
        }
        function onDragScene() {
            var mousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var addPoint = mousePoint.subtract(dragSceneMousePoint);
            var scale = editor.editorCamera.getScaleByDepth(300);
            var up = dragSceneCameraGlobalMatrix3D.up;
            var right = dragSceneCameraGlobalMatrix3D.right;
            up.scaleBy(addPoint.y * scale);
            right.scaleBy(-addPoint.x * scale);
            var globalMatrix3D = dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        }
        function onFpsViewStart() {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMousedown();
            feng3d.ticker.onframe(updateFpsView);
        }
        function onFpsViewStop() {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMouseup();
            feng3d.ticker.offframe(updateFpsView);
        }
        function updateFpsView() {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.update();
        }
        function onMouseRotateSceneStart() {
            rotateSceneMousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            rotateSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
            rotateSceneCenter = null;
            //获取第一个 游戏对象
            var firstObject = editor.editorData.firstSelectedGameObject;
            if (firstObject) {
                rotateSceneCenter = firstObject.transform.scenePosition;
            }
            else {
                rotateSceneCenter = rotateSceneCameraGlobalMatrix3D.forward;
                rotateSceneCenter.scaleBy(editor.sceneControlConfig.lookDistance);
                rotateSceneCenter = rotateSceneCenter.add(rotateSceneCameraGlobalMatrix3D.position);
            }
        }
        function onMouseRotateScene() {
            var globalMatrix3D = rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new feng3d.Point(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var view3DRect = editor.engine.viewRect;
            var rotateX = (mousePoint.y - rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(feng3d.Vector3D.Y_AXIS, rotateY, rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateAxisX, rotateX, rotateSceneCenter);
            editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        }
        function onLookToSelectedGameObject() {
            var selectedGameObject = editor.editorData.firstSelectedGameObject;
            if (selectedGameObject) {
                var cameraGameObject = editor.editorCamera;
                editor.sceneControlConfig.lookDistance = editor.sceneControlConfig.defaultLookDistance;
                var lookPos = cameraGameObject.transform.localToWorldMatrix.forward;
                lookPos.scaleBy(-editor.sceneControlConfig.lookDistance);
                lookPos.incrementBy(selectedGameObject.transform.scenePosition);
                var localLookPos = lookPos.clone();
                if (cameraGameObject.transform.parent) {
                    cameraGameObject.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
                }
                egret.Tween.get(editor.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        }
        function onMouseWheelMoveSceneCamera() {
            var distance = feng3d.windowEventProxy.wheelDelta * editor.sceneControlConfig.mouseWheelMoveStep;
            editor.editorCamera.transform.localToWorldMatrix = editor.editorCamera.transform.localToWorldMatrix.moveForward(distance);
            editor.sceneControlConfig.lookDistance -= distance;
        }
        var SceneControlConfig = /** @class */ (function () {
            function SceneControlConfig() {
                this.mouseWheelMoveStep = 0.004;
                this.defaultLookDistance = 3;
                //dynamic
                this.lookDistance = 3;
                this.sceneCameraForwardBackwardStep = 0.01;
            }
            return SceneControlConfig;
        }());
        editor.SceneControlConfig = SceneControlConfig;
        editor.sceneControlConfig = new SceneControlConfig();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Feng3dView = /** @class */ (function (_super) {
            __extends(Feng3dView, _super);
            function Feng3dView() {
                var _this = _super.call(this) || this;
                _this.skinName = "Feng3dViewSkin";
                feng3d.Stats.init();
                return _this;
            }
            Feng3dView.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.canvas = document.getElementById("glcanvas");
                this.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.onResize();
                editor.drag.register(this, null, ["file_gameobject", "file_script"], function (dragdata) {
                    if (dragdata.file_gameobject) {
                        editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, editor.hierarchyTree.rootnode.gameobject);
                    }
                    if (dragdata.file_script) {
                        var gameobject = editor.engine.mouse3DManager.getSelectedGameObject();
                        if (!gameobject || !gameobject.scene)
                            gameobject = editor.hierarchyTree.rootnode.gameobject;
                        feng3d.GameObjectUtil.addScript(gameobject, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            };
            Feng3dView.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.canvas = null;
                this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                editor.drag.unregister(this);
            };
            Feng3dView.prototype.onResize = function () {
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
                style.cursor = "hand";
                feng3d.Stats.instance.dom.style.left = bound.x + "px";
                feng3d.Stats.instance.dom.style.top = bound.y + "px";
                var canvasRect = this.canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                    feng3d.shortcut.activityState("mouseInView3D");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInView3D");
                }
            };
            return Feng3dView;
        }(eui.Component));
        editor.Feng3dView = Feng3dView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var CameraPreview = /** @class */ (function (_super) {
            __extends(CameraPreview, _super);
            function CameraPreview() {
                var _this = _super.call(this) || this;
                _this.skinName = "CameraPreview";
                _this.visible = false;
                //
                var canvas = _this.canvas = document.getElementById("cameraPreviewCanvas");
                ;
                _this.previewEngine = new feng3d.Engine(canvas);
                _this.previewEngine.stop();
                return _this;
            }
            Object.defineProperty(CameraPreview.prototype, "camera", {
                get: function () {
                    return this._camera;
                },
                set: function (value) {
                    if (this._camera) {
                        feng3d.ticker.offframe(this.onframe, this);
                    }
                    this._camera = value;
                    this.previewEngine.camera = this._camera;
                    this.visible = !!this._camera;
                    this.canvas.style.display = this._camera ? "inline" : "none";
                    if (this._camera) {
                        feng3d.ticker.onframe(this.onframe, this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            CameraPreview.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onDataChange, this);
                this.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
                this.onResize();
                this.onDataChange();
            };
            CameraPreview.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onDataChange, this);
                this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            };
            CameraPreview.prototype.onResize = function () {
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
                style.cursor = "hand";
            };
            CameraPreview.prototype.onDataChange = function () {
                var selectedGameObjects = editor.editorData.selectedGameObjects;
                if (selectedGameObjects.length > 0) {
                    for (var i = 0; i < selectedGameObjects.length; i++) {
                        var camera = selectedGameObjects[i].getComponent(feng3d.Camera);
                        if (camera) {
                            this.camera = camera;
                            return;
                        }
                    }
                }
                this.camera = null;
            };
            CameraPreview.prototype.onframe = function () {
                if (this.previewEngine.scene != editor.engine.scene) {
                    this.previewEngine.scene = editor.engine.scene;
                }
                this.previewEngine.render();
            };
            return CameraPreview;
        }(eui.Component));
        editor.CameraPreview = CameraPreview;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var SplitGroupState;
        (function (SplitGroupState) {
            /**
             * 默认状态，鼠标呈现正常形态
             */
            SplitGroupState[SplitGroupState["default"] = 0] = "default";
            /**
             * 鼠标处在分割线上，呈现上下或者左右箭头形态
             */
            SplitGroupState[SplitGroupState["onSplit"] = 1] = "onSplit";
            /**
             * 处于拖拽分隔线状态
             */
            SplitGroupState[SplitGroupState["draging"] = 2] = "draging";
        })(SplitGroupState || (SplitGroupState = {}));
        var SplitdragData = /** @class */ (function () {
            function SplitdragData() {
                this._splitGroupState = SplitGroupState.default;
                this._layouttype = 0;
            }
            Object.defineProperty(SplitdragData.prototype, "splitGroupState", {
                get: function () {
                    return this._splitGroupState;
                },
                set: function (value) {
                    this._splitGroupState = value;
                    this.updatecursor();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SplitdragData.prototype, "layouttype", {
                get: function () {
                    return this._layouttype;
                },
                set: function (value) {
                    this._layouttype = value;
                    this.updatecursor();
                },
                enumerable: true,
                configurable: true
            });
            SplitdragData.prototype.updatecursor = function () {
                if (this._splitGroupState == SplitGroupState.default) {
                    egretDiv.style.cursor = "auto";
                }
                else {
                    if (this._layouttype == 1) {
                        egretDiv.style.cursor = "e-resize";
                    }
                    else if (this._layouttype == 2) {
                        egretDiv.style.cursor = "n-resize";
                    }
                }
            };
            return SplitdragData;
        }());
        var egretDiv = document.getElementsByClassName("egret-player")[0];
        var splitdragData = new SplitdragData();
        /**
         * 分割组，提供鼠标拖拽改变组内对象分割尺寸
         * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
         */
        var SplitGroup = /** @class */ (function (_super) {
            __extends(SplitGroup, _super);
            function SplitGroup() {
                return _super.call(this) || this;
            }
            SplitGroup.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this._onMouseMovethis = this.onMouseMove.bind(this);
                this._onMouseDownthis = this.onMouseDown.bind(this);
                this._onMouseUpthis = this.onMouseUp.bind(this);
                egretDiv.addEventListener("mousemove", this._onMouseMovethis);
                egretDiv.addEventListener("mousedown", this._onMouseDownthis);
                egretDiv.addEventListener("mouseup", this._onMouseUpthis);
            };
            SplitGroup.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                egretDiv.removeEventListener("mousemove", this._onMouseMovethis);
                egretDiv.removeEventListener("mousedown", this._onMouseDownthis);
                egretDiv.removeEventListener("mouseup", this._onMouseUpthis);
                this._onMouseMovethis = null;
                this._onMouseDownthis = null;
                this._onMouseUpthis = null;
            };
            SplitGroup.prototype.onMouseMove = function (e) {
                if (splitdragData.splitGroupState == SplitGroupState.default) {
                    this._findSplit(e.layerX, e.layerY);
                    return;
                }
                if (splitdragData.splitGroup != this)
                    return;
                if (splitdragData.splitGroupState == SplitGroupState.onSplit) {
                    this._findSplit(e.layerX, e.layerY);
                }
                else if (splitdragData.splitGroupState == SplitGroupState.draging) {
                    var preElement = splitdragData.preElement;
                    var nextElement = splitdragData.nextElement;
                    if (splitdragData.layouttype == 1) {
                        var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, e.layerX));
                        var preElementWidth = splitdragData.preElementRect.width + (layerX - splitdragData.dragingMousePoint.x);
                        var nextElementWidth = splitdragData.nextElementRect.width - (layerX - splitdragData.dragingMousePoint.x);
                        if (preElement instanceof eui.Group) {
                            preElement.setContentSize(preElementWidth, splitdragData.preElementRect.height);
                        }
                        else {
                            preElement.width = preElementWidth;
                        }
                        if (nextElement instanceof eui.Group) {
                            nextElement.setContentSize(nextElementWidth, nextElement.contentHeight);
                        }
                        else {
                            nextElement.width = nextElementWidth;
                        }
                    }
                    else {
                        var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, e.layerY));
                        var preElementHeight = splitdragData.preElementRect.height + (layerY - splitdragData.dragingMousePoint.y);
                        var nextElementHeight = splitdragData.nextElementRect.height - (layerY - splitdragData.dragingMousePoint.y);
                        if (preElement instanceof eui.Group) {
                            preElement.setContentSize(splitdragData.preElementRect.width, preElementHeight);
                        }
                        else {
                            preElement.height = preElementHeight;
                        }
                        if (nextElement instanceof eui.Group) {
                            nextElement.setContentSize(splitdragData.nextElementRect.width, nextElementHeight);
                        }
                        else {
                            nextElement.height = nextElementHeight;
                        }
                    }
                }
            };
            SplitGroup.prototype._findSplit = function (stageX, stageY) {
                splitdragData.splitGroupState = SplitGroupState.default;
                if (this.numElements < 2)
                    return;
                var layouttype = 0;
                if (this.layout instanceof eui.HorizontalLayout) {
                    layouttype = 1;
                }
                else if (this.layout instanceof eui.VerticalLayout) {
                    layouttype = 2;
                }
                if (layouttype == 0)
                    return;
                for (var i = 0; i < this.numElements - 1; i++) {
                    var element = this.getElementAt(i);
                    var elementRect = element.getTransformedBounds(this.stage);
                    var elementRectRight = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                    var elementRectBotton = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                    if (layouttype == 1 && elementRectRight.contains(stageX, stageY)) {
                        splitdragData.splitGroupState = SplitGroupState.onSplit;
                        splitdragData.layouttype = 1;
                        splitdragData.splitGroup = this;
                        splitdragData.preElement = this.getElementAt(i);
                        splitdragData.nextElement = this.getElementAt(i + 1);
                        break;
                    }
                    else if (layouttype == 2 && elementRectBotton.contains(stageX, stageY)) {
                        splitdragData.splitGroupState = SplitGroupState.onSplit;
                        splitdragData.layouttype = 2;
                        splitdragData.splitGroup = this;
                        splitdragData.preElement = this.getElementAt(i);
                        splitdragData.nextElement = this.getElementAt(i + 1);
                        break;
                    }
                }
            };
            SplitGroup.prototype.onMouseDown = function (e) {
                if (splitdragData.splitGroupState == SplitGroupState.onSplit) {
                    splitdragData.splitGroupState = SplitGroupState.draging;
                    splitdragData.dragingMousePoint = new feng3d.Point(e.layerX, e.layerY);
                    //
                    var preElement = splitdragData.preElement;
                    var nextElement = splitdragData.nextElement;
                    var preElementRect = splitdragData.preElementRect = preElement.getTransformedBounds(this.stage);
                    var nextElementRect = splitdragData.nextElementRect = nextElement.getTransformedBounds(this.stage);
                    //
                    var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
                    var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
                    var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
                    var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
                    splitdragData.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);
                }
            };
            SplitGroup.prototype.onMouseUp = function (e) {
                if (splitdragData.splitGroupState == SplitGroupState.draging) {
                    splitdragData.splitGroupState = SplitGroupState.default;
                    splitdragData.dragingMousePoint = null;
                }
            };
            return SplitGroup;
        }(eui.Group));
        editor.SplitGroup = SplitGroup;
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
                displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            function onAddedToStage() {
                maskReck.width = displayObject.stage.stageWidth;
                maskReck.height = displayObject.stage.stageHeight;
                editor.editorui.popupLayer.addChildAt(maskReck, 0);
                //
                maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
            }
            function removeDisplayObject() {
                if (displayObject.parent)
                    displayObject.parent.removeChild(displayObject);
            }
            function onRemoveFromStage() {
                maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                if (maskReck.parent) {
                    maskReck.parent.removeChild(maskReck);
                }
            }
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
                closecallback && closecallback(object);
            }
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Accordion = /** @class */ (function (_super) {
            __extends(Accordion, _super);
            function Accordion() {
                var _this = _super.call(this) || this;
                _this.components = [];
                _this.titleName = "";
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "AccordionSkin";
                return _this;
            }
            Accordion.prototype.addContent = function (component) {
                if (!this.contentGroup)
                    this.components.push(component);
                else
                    this.contentGroup.addChild(component);
            };
            Accordion.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Accordion.prototype.onAddedToStage = function () {
                this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
                if (this.components) {
                    for (var i = 0; i < this.components.length; i++) {
                        this.contentGroup.addChild(this.components[i]);
                    }
                    this.components = null;
                    delete this.components;
                }
            };
            Accordion.prototype.onRemovedFromStage = function () {
                this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            };
            Accordion.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            return Accordion;
        }(eui.Component));
        editor.Accordion = Accordion;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TreeItemRenderer = /** @class */ (function (_super) {
            __extends(TreeItemRenderer, _super);
            function TreeItemRenderer() {
                var _this = _super.call(this) || this;
                /**
                 * 子节点相对父节点的缩进值，以像素为单位。默认17。
                 */
                _this.indentation = 17;
                _this.watchers = [];
                _this.skinName = "TreeItemRendererSkin";
                return _this;
            }
            TreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                //
                this.disclosureButton.addEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
                this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
                this.updateView();
            };
            TreeItemRenderer.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
                eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
                eui.Watcher.watch(this, ["indentation"], this.updateView, this);
                while (this.watchers.length > 0) {
                    this.watchers.pop().unwatch();
                }
                //
                this.disclosureButton.removeEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            };
            TreeItemRenderer.prototype.onDisclosureButtonClick = function () {
                if (this.data)
                    this.data.isOpen = !this.data.isOpen;
            };
            TreeItemRenderer.prototype.updateView = function () {
                this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
                this.contentGroup.x = (this.data ? this.data.depth : 0) * this.indentation;
                this.disclosureButton.selected = this.data ? this.data.isOpen : false;
            };
            return TreeItemRenderer;
        }(eui.ItemRenderer));
        editor.TreeItemRenderer = TreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MenuItemRenderer = /** @class */ (function (_super) {
            __extends(MenuItemRenderer, _super);
            function MenuItemRenderer() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "MenuItemRender";
                return _this;
            }
            MenuItemRenderer.prototype.dataChanged = function () {
                _super.prototype.dataChanged.call(this);
                this.updateView();
            };
            MenuItemRenderer.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            MenuItemRenderer.prototype.onAddedToStage = function () {
                this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false, 1000);
                this.updateView();
            };
            MenuItemRenderer.prototype.onRemovedFromStage = function () {
                this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onItemMouseDown, this, false);
            };
            MenuItemRenderer.prototype.updateView = function () {
                if (!this.data)
                    return;
                if (this.data.type == 'separator') {
                    this.skin.currentState = "separator";
                }
                else {
                    this.skin.currentState = "normal";
                }
            };
            MenuItemRenderer.prototype.onItemMouseDown = function (event) {
                this.data.click && this.data.click();
            };
            return MenuItemRenderer;
        }(eui.ItemRenderer));
        editor.MenuItemRenderer = MenuItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TreeNode = /** @class */ (function () {
            function TreeNode(obj) {
                obj && feng3d.ObjectUtils.copy(this, obj);
            }
            /**
             * 销毁
             */
            TreeNode.prototype.destroy = function () {
                this.parent = null;
                this.children = null;
            };
            return TreeNode;
        }());
        editor.TreeNode = TreeNode;
        var Tree = /** @class */ (function (_super) {
            __extends(Tree, _super);
            function Tree() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Tree.prototype, "rootnode", {
                get: function () {
                    return this._rootnode;
                },
                set: function (value) {
                    if (this._rootnode == value)
                        return;
                    if (this._rootnode) {
                        feng3d.watcher.unwatch(this._rootnode, "isOpen", this.isopenchanged, this);
                    }
                    this._rootnode = value;
                    if (this._rootnode) {
                        feng3d.watcher.watch(this._rootnode, "isOpen", this.isopenchanged, this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 判断是否包含节点
             */
            Tree.prototype.contain = function (node, rootnode) {
                rootnode = rootnode || this.rootnode;
                var result = false;
                treeMap(rootnode, function (item) {
                    if (item == node)
                        result = true;
                });
                return result;
            };
            Tree.prototype.addNode = function (node, parentnode) {
                parentnode = parentnode || this.rootnode;
                feng3d.debuger && feng3d.assert(!this.contain(parentnode, node), "无法添加到自身节点中!");
                node.parent = parentnode;
                parentnode.children.push(node);
                this.updateChildrenDepth(node);
                feng3d.watcher.watch(node, "isOpen", this.isopenchanged, this);
                this.dispatch("added", node);
                this.dispatch("changed", node);
            };
            Tree.prototype.removeNode = function (node) {
                var parentnode = node.parent;
                if (!parentnode)
                    return;
                var index = parentnode.children.indexOf(node);
                feng3d.debuger && feng3d.assert(index != -1);
                parentnode.children.splice(index, 1);
                node.parent = null;
                feng3d.watcher.unwatch(node, "isOpen", this.isopenchanged, this);
                this.dispatch("removed", node);
                this.dispatch("changed", node);
            };
            Tree.prototype.destroy = function (node) {
                this.removeNode(node);
                if (node.children) {
                    for (var i = node.children.length - 1; i >= 0; i--) {
                        this.destroy(node.children[i]);
                    }
                    node.children.length = 0;
                }
            };
            Tree.prototype.updateChildrenDepth = function (node) {
                node.depth = ~~node.parent.depth + 1;
                treeMap(node, function (node) {
                    node.depth = ~~node.parent.depth + 1;
                });
            };
            Tree.prototype.getShowNodes = function (node) {
                var _this = this;
                node = node || this.rootnode;
                if (!node)
                    return [];
                var nodes = [node];
                if (node.isOpen) {
                    node.children.forEach(function (element) {
                        nodes = nodes.concat(_this.getShowNodes(element));
                    });
                }
                return nodes;
            };
            Tree.prototype.isopenchanged = function (host, property, oldvalue) {
                this.dispatch("openChanged", host);
            };
            return Tree;
        }(feng3d.EventDispatcher));
        editor.Tree = Tree;
        function treeMap(treeNode, callback) {
            if (treeNode.children) {
                treeNode.children.forEach(function (element) {
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
        var Vector3DView = /** @class */ (function (_super) {
            __extends(Vector3DView, _super);
            function Vector3DView() {
                var _this = _super.call(this) || this;
                _this.vm = new feng3d.Vector3D(1, 2, 3);
                _this._showw = false;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "Vector3DViewSkin";
                return _this;
            }
            Object.defineProperty(Vector3DView.prototype, "showw", {
                set: function (value) {
                    if (this._showw == value)
                        return;
                    this._showw = value;
                    this.skin.currentState = this._showw ? "showw" : "default";
                },
                enumerable: true,
                configurable: true
            });
            Vector3DView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            Vector3DView.prototype.onAddedToStage = function () {
                this.skin.currentState = this._showw ? "showw" : "default";
                this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.wTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onRemovedFromStage = function () {
                this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.wTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            Vector3DView.prototype.onTextChange = function (event) {
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
            };
            return Vector3DView;
        }(eui.Component));
        editor.Vector3DView = Vector3DView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var ComponentView = /** @class */ (function (_super) {
            __extends(ComponentView, _super);
            /**
             * 对象界面数据
             */
            function ComponentView(component) {
                var _this = _super.call(this) || this;
                _this.component = component;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "ComponentSkin";
                return _this;
            }
            /**
             * 更新界面
             */
            ComponentView.prototype.updateView = function () {
                if (this.componentView)
                    this.componentView.updateView();
            };
            ComponentView.prototype.onComplete = function () {
                var componentName = feng3d.ClassUtils.getQualifiedClassName(this.component).split(".").pop();
                this.accordion.titleName = componentName;
                this.componentView = feng3d.objectview.getObjectView(this.component);
                this.accordion.addContent(this.componentView);
                this.deleteButton.visible = !(this.component instanceof feng3d.Transform);
                this.deleteButton.addEventListener(egret.MouseEvent.CLICK, this.onDeleteButton, this);
            };
            ComponentView.prototype.onDeleteButton = function (event) {
                if (this.component.gameObject)
                    this.component.gameObject.removeComponent(this.component);
            };
            return ComponentView;
        }(eui.Component));
        editor.ComponentView = ComponentView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.menu = {
            popup: popup,
        };
        function popup(menu, mousex, mousey, width) {
            if (width === void 0) { width = 150; }
            var list = new eui.List();
            list.itemRenderer = editor.MenuItemRenderer;
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);
            list.x = mousex || feng3d.windowEventProxy.clientX;
            list.y = mousey || feng3d.windowEventProxy.clientY;
            if (width !== undefined)
                list.width = width;
            editor.editorui.popupLayer.addChild(list);
            list.dataProvider = dataProvider;
            setTimeout(function () {
                editor.editorui.stage.once(egret.MouseEvent.CLICK, onStageClick, null);
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
        var OVBaseDefault = /** @class */ (function (_super) {
            __extends(OVBaseDefault, _super);
            function OVBaseDefault(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OVBaseDefault";
                return _this;
            }
            OVBaseDefault.prototype.onComplete = function () {
                this.updateView();
            };
            Object.defineProperty(OVBaseDefault.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            OVBaseDefault.prototype.getAttributeView = function (attributeName) {
                return null;
            };
            OVBaseDefault.prototype.getblockView = function (blockName) {
                return null;
            };
            /**
             * 更新界面
             */
            OVBaseDefault.prototype.updateView = function () {
                this.image.visible = false;
                this.label.visible = true;
                var value = this._space;
                if (typeof value == "string" && value.indexOf("data:") != -1) {
                    this.image.visible = true;
                    this.label.visible = false;
                    this.image.source = value;
                }
                else {
                    this.label.text = String(this._space);
                }
            };
            OVBaseDefault = __decorate([
                feng3d.OVComponent()
            ], OVBaseDefault);
            return OVBaseDefault;
        }(eui.Component));
        editor.OVBaseDefault = OVBaseDefault;
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
        var OVDefault = /** @class */ (function (_super) {
            __extends(OVDefault, _super);
            /**
             * 对象界面数据
             */
            function OVDefault(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._objectViewInfo = objectViewInfo;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OVDefault";
                return _this;
            }
            OVDefault.prototype.onComplete = function () {
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
            };
            Object.defineProperty(OVDefault.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.blockViews.length; i++) {
                        this.blockViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OVDefault.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.blockViews.length; i++) {
                    this.blockViews[i].updateView();
                }
            };
            /**
             * 更新自身界面
             */
            OVDefault.prototype.$updateView = function () {
            };
            OVDefault.prototype.getblockView = function (blockName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    if (this.blockViews[i].blockName == blockName) {
                        return this.blockViews[i];
                    }
                }
                return null;
            };
            OVDefault.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    var attributeView = this.blockViews[i].getAttributeView(attributeName);
                    if (attributeView != null) {
                        return attributeView;
                    }
                }
                return null;
            };
            OVDefault = __decorate([
                feng3d.OVComponent()
            ], OVDefault);
            return OVDefault;
        }(eui.Component));
        editor.OVDefault = OVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OVTransform = /** @class */ (function (_super) {
            __extends(OVTransform, _super);
            function OVTransform(objectViewInfo) {
                var _this = _super.call(this) || this;
                _this._objectViewInfo = objectViewInfo;
                _this._space = objectViewInfo.owner;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OVTransform";
                return _this;
            }
            OVTransform.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
                this.updateView();
            };
            OVTransform.prototype.onAddedToStage = function () {
                this.xTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.rxTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.ryTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.rzTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.sxTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.syTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.szTextInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            OVTransform.prototype.onRemovedFromStage = function () {
                this.xTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.yTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.zTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.rxTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.ryTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.rzTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.sxTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.syTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                this.szTextInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            };
            OVTransform.prototype.onTextChange = function (event) {
                var transfrom = this.space;
                var value = 0;
                if (event.currentTarget.text != undefined) {
                    value = Number(event.currentTarget.text);
                    value = isNaN(value) ? 0 : value;
                }
                switch (event.currentTarget) {
                    case this.xTextInput:
                        transfrom.x = value;
                        break;
                    case this.yTextInput:
                        transfrom.y = value;
                        break;
                    case this.zTextInput:
                        transfrom.z = value;
                        break;
                    case this.rxTextInput:
                        transfrom.rx = value;
                        break;
                    case this.ryTextInput:
                        transfrom.ry = value;
                        break;
                    case this.rzTextInput:
                        transfrom.rz = value;
                        break;
                    case this.sxTextInput:
                        transfrom.sx = value ? value : 1;
                        break;
                    case this.syTextInput:
                        transfrom.sy = value ? value : 1;
                        break;
                    case this.szTextInput:
                        transfrom.sz = value ? value : 1;
                        break;
                }
            };
            Object.defineProperty(OVTransform.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    if (this._space)
                        this._space.off("transformChanged", this.updateView, this);
                    this._space = value;
                    if (this._space)
                        this._space.on("transformChanged", this.updateView, this);
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            OVTransform.prototype.getAttributeView = function (attributeName) {
                return null;
            };
            OVTransform.prototype.getblockView = function (blockName) {
                return null;
            };
            /**
             * 更新界面
             */
            OVTransform.prototype.updateView = function () {
                var transfrom = this.space;
                if (!transfrom)
                    return;
                this.xTextInput.text = "" + transfrom.x;
                this.yTextInput.text = "" + transfrom.y;
                this.zTextInput.text = "" + transfrom.z;
                this.rxTextInput.text = "" + transfrom.rx;
                this.ryTextInput.text = "" + transfrom.ry;
                this.rzTextInput.text = "" + transfrom.rz;
                this.sxTextInput.text = "" + transfrom.sx;
                this.syTextInput.text = "" + transfrom.sy;
                this.szTextInput.text = "" + transfrom.sz;
            };
            OVTransform = __decorate([
                feng3d.OVComponent()
            ], OVTransform);
            return OVTransform;
        }(eui.Component));
        editor.OVTransform = OVTransform;
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
        var OBVDefault = /** @class */ (function (_super) {
            __extends(OBVDefault, _super);
            /**
             * @inheritDoc
             */
            function OBVDefault(blockViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = blockViewInfo.owner;
                _this._blockName = blockViewInfo.name;
                _this.itemList = blockViewInfo.itemList;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OBVDefault";
                return _this;
            }
            OBVDefault.prototype.onComplete = function () {
                this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.$updateView();
            };
            OBVDefault.prototype.initView = function () {
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
            };
            Object.defineProperty(OBVDefault.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    for (var i = 0; i < this.attributeViews.length; i++) {
                        this.attributeViews[i].space = this._space;
                    }
                    this.$updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OBVDefault.prototype, "blockName", {
                get: function () {
                    return this._blockName;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新自身界面
             */
            OBVDefault.prototype.$updateView = function () {
                if (!this.isInitView) {
                    this.initView();
                }
            };
            OBVDefault.prototype.updateView = function () {
                this.$updateView();
                for (var i = 0; i < this.attributeViews.length; i++) {
                    this.attributeViews[i].updateView();
                }
            };
            OBVDefault.prototype.getAttributeView = function (attributeName) {
                for (var i = 0; i < this.attributeViews.length; i++) {
                    if (this.attributeViews[i].attributeName == attributeName) {
                        return this.attributeViews[i];
                    }
                }
                return null;
            };
            OBVDefault.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            OBVDefault = __decorate([
                feng3d.OBVComponent()
            ], OBVDefault);
            return OBVDefault;
        }(eui.Component));
        editor.OBVDefault = OBVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var ObjectViewEvent = /** @class */ (function (_super) {
        __extends(ObjectViewEvent, _super);
        function ObjectViewEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        ObjectViewEvent.prototype.toString = function () {
            return "[{0} type=\"{1}\" space=\"{2}\"  attributeName=\"{3}\" attributeValue={4}]".replace("{0}", egret.getQualifiedClassName(this).split("::").pop()).replace("{1}", this.type).replace("{2}", egret.getQualifiedClassName(this).split("::").pop()).replace("{3}", this.attributeName).replace("{4}", JSON.stringify(this.attributeValue));
        };
        return ObjectViewEvent;
    }(egret.Event));
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 默认对象属性界面
         * @author feng 2016-3-10
         */
        var OAVDefault = /** @class */ (function (_super) {
            __extends(OAVDefault, _super);
            function OAVDefault(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVDefault";
                return _this;
            }
            Object.defineProperty(OAVDefault.prototype, "dragparam", {
                set: function (param) {
                    var _this = this;
                    if (param) {
                        //
                        editor.drag.register(this, function (dragsource) {
                            if (param.datatype)
                                dragsource[param.datatype] = _this.attributeValue;
                        }, [param.accepttype], function (dragSource) {
                            _this.attributeValue = dragSource[param.accepttype];
                        });
                    }
                },
                enumerable: true,
                configurable: true
            });
            OAVDefault.prototype.onComplete = function () {
                this.text.percentWidth = 100;
                this.label.text = this._attributeName;
                this.updateView();
            };
            OAVDefault.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
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
            };
            OAVDefault.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
                editor.drag.unregister(this);
            };
            OAVDefault.prototype.ontxtfocusin = function () {
                this._textfocusintxt = true;
            };
            OAVDefault.prototype.ontxtfocusout = function () {
                this._textfocusintxt = false;
            };
            OAVDefault.prototype.onEnterFrame = function () {
                if (this._textfocusintxt)
                    return;
                this.updateView();
            };
            Object.defineProperty(OAVDefault.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVDefault.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVDefault.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OAVDefault.prototype.updateView = function () {
                this.text.enabled = this.attributeViewInfo.writable;
                var value = this.attributeValue;
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
                    this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
                }
            };
            OAVDefault.prototype.onDoubleClick = function () {
                editor.editorui.inspectorView.showData(this.attributeValue);
            };
            OAVDefault.prototype.onTextChange = function () {
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
                        throw "\u65E0\u6CD5\u5904\u7406\u7C7B\u578B" + this._attributeType + "!";
                }
            };
            OAVDefault = __decorate([
                feng3d.OAVComponent()
            ], OAVDefault);
            return OAVDefault;
        }(eui.Component));
        editor.OAVDefault = OAVDefault;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var BooleanAttrView = /** @class */ (function (_super) {
            __extends(BooleanAttrView, _super);
            function BooleanAttrView(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "BooleanAttrViewSkin";
                return _this;
            }
            BooleanAttrView.prototype.onComplete = function () {
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.label.text = this._attributeName;
                this.updateView();
            };
            Object.defineProperty(BooleanAttrView.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            BooleanAttrView.prototype.updateView = function () {
                this.checkBox["selected"] = this.attributeValue;
            };
            BooleanAttrView.prototype.onChange = function (event) {
                this.attributeValue = this.checkBox["selected"];
            };
            Object.defineProperty(BooleanAttrView.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BooleanAttrView.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                        var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                        objectViewEvent.space = this._space;
                        objectViewEvent.attributeName = this._attributeName;
                        objectViewEvent.attributeValue = this.attributeValue;
                        this.dispatchEvent(objectViewEvent);
                    }
                },
                enumerable: true,
                configurable: true
            });
            BooleanAttrView = __decorate([
                feng3d.OAVComponent()
            ], BooleanAttrView);
            return BooleanAttrView;
        }(eui.Component));
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
        var OAVNumber = /** @class */ (function (_super) {
            __extends(OAVNumber, _super);
            function OAVNumber() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.fractionDigits = 3;
                return _this;
            }
            /**
             * 更新界面
             */
            OAVNumber.prototype.updateView = function () {
                var pow = Math.pow(10, 3);
                var value = Math.round(this.attributeValue * pow) / pow;
                this.text.text = String(value);
            };
            OAVNumber = __decorate([
                feng3d.OAVComponent()
            ], OAVNumber);
            return OAVNumber;
        }(editor.OAVDefault));
        editor.OAVNumber = OAVNumber;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVVector3D = /** @class */ (function (_super) {
            __extends(OAVVector3D, _super);
            function OAVVector3D(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVVector3DSkin";
                return _this;
            }
            OAVVector3D.prototype.onComplete = function () {
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
            };
            Object.defineProperty(OAVVector3D.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVVector3D.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新界面
             */
            OAVVector3D.prototype.updateView = function () {
            };
            OAVVector3D = __decorate([
                feng3d.OAVComponent()
            ], OAVVector3D);
            return OAVVector3D;
        }(eui.Component));
        editor.OAVVector3D = OAVVector3D;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVArray = /** @class */ (function (_super) {
            __extends(OAVArray, _super);
            function OAVArray(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVArray";
                return _this;
            }
            OAVArray.prototype.onComplete = function () {
                this.$updateView();
            };
            Object.defineProperty(OAVArray.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVArray.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVArray.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 更新自身界面
             */
            OAVArray.prototype.$updateView = function () {
                if (!this.isInitView) {
                    this.initView();
                }
            };
            OAVArray.prototype.initView = function () {
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
            };
            OAVArray.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            };
            OAVArray.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
                this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            };
            /**
             * 更新界面
             */
            OAVArray.prototype.updateView = function () {
                this.$updateView();
            };
            OAVArray.prototype.onTitleButtonClick = function () {
                this.currentState = this.currentState == "hide" ? "show" : "hide";
            };
            OAVArray.prototype.onsizeTxtfocusout = function () {
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
                        if (attributeValue[i] == null && this.attributeViewInfo.componentParam)
                            attributeValue[i] = feng3d.lazy.getvalue(this.attributeViewInfo.componentParam.defaultItem);
                        if (attributeViews[i] == null) {
                            var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
                            attributeViews[i] = displayObject;
                            displayObject.percentWidth = 100;
                        }
                        this.contentGroup.addChild(attributeViews[i]);
                    }
                }
            };
            OAVArray = __decorate([
                feng3d.OAVComponent()
            ], OAVArray);
            return OAVArray;
        }(eui.Component));
        editor.OAVArray = OAVArray;
        var OAVArrayItem = /** @class */ (function (_super) {
            __extends(OAVArrayItem, _super);
            function OAVArrayItem(arr, index, componentParam) {
                var _this = this;
                var attributeViewInfo = {
                    name: index,
                    writable: true,
                    componentParam: componentParam,
                    owner: arr,
                };
                _this = _super.call(this, attributeViewInfo) || this;
                return _this;
            }
            OAVArrayItem.prototype.onComplete = function () {
                _super.prototype.onComplete.call(this);
                this.label.width = 60;
            };
            return OAVArrayItem;
        }(editor.OAVDefault));
        editor.OAVArrayItem = OAVArrayItem;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var OAVComponentList = /** @class */ (function (_super) {
            __extends(OAVComponentList, _super);
            function OAVComponentList(attributeViewInfo) {
                var _this = _super.call(this) || this;
                _this.accordions = [];
                _this._space = attributeViewInfo.owner;
                _this._attributeName = attributeViewInfo.name;
                _this._attributeType = attributeViewInfo.type;
                _this.attributeViewInfo = attributeViewInfo;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "OAVComponentListSkin";
                return _this;
            }
            OAVComponentList.prototype.onComplete = function () {
                this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
                this.initView();
            };
            OAVComponentList.prototype.onAddComponentButtonClick = function () {
                var globalPoint = this.addComponentButton.localToGlobal(0, 0);
                editor.needcreateComponentGameObject = this.space;
                editor.menu.popup(editor.createComponentConfig, globalPoint.x, globalPoint.y, 180);
            };
            Object.defineProperty(OAVComponentList.prototype, "space", {
                get: function () {
                    return this._space;
                },
                set: function (value) {
                    this._space = value;
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVComponentList.prototype, "attributeName", {
                get: function () {
                    return this._attributeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAVComponentList.prototype, "attributeValue", {
                get: function () {
                    return this._space[this._attributeName];
                },
                set: function (value) {
                    if (this._space[this._attributeName] != value) {
                        this._space[this._attributeName] = value;
                    }
                    this.updateView();
                },
                enumerable: true,
                configurable: true
            });
            OAVComponentList.prototype.initView = function () {
                var _this = this;
                this.accordions.length = 0;
                this.group.layout.gap = -1;
                var components = this.attributeValue;
                for (var i = 0; i < components.length; i++) {
                    this.addComponentView(components[i]);
                }
                this.space.on("addedComponent", this.onaddedcompont, this);
                this.space.on("removedComponent", this.onremovedComponent, this);
                editor.drag.register(this.addComponentButton, null, ["file_script"], function (dragdata) {
                    if (dragdata.file_script) {
                        feng3d.GameObjectUtil.addScript(_this.space, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            };
            OAVComponentList.prototype.addComponentView = function (component) {
                var o;
                if (!component.showInInspector)
                    return;
                var displayObject = new editor.ComponentView(component);
                displayObject.percentWidth = 100;
                this.group.addChild(displayObject);
            };
            /**
             * 更新界面
             */
            OAVComponentList.prototype.updateView = function () {
                for (var i = 0, n = this.group.numChildren; i < n; i++) {
                    var child = this.group.getChildAt(i);
                    if (child instanceof editor.ComponentView)
                        child.updateView();
                }
            };
            OAVComponentList.prototype.removedComponentView = function (component) {
                for (var i = this.group.numChildren - 1; i >= 0; i--) {
                    var displayObject = this.group.getChildAt(i);
                    if (displayObject instanceof editor.ComponentView && displayObject.component == component) {
                        this.group.removeChild(displayObject);
                    }
                }
            };
            OAVComponentList.prototype.onaddedcompont = function (event) {
                this.addComponentView(event.data);
            };
            OAVComponentList.prototype.onremovedComponent = function (event) {
                this.removedComponentView(event.data);
            };
            OAVComponentList = __decorate([
                feng3d.OAVComponent()
            ], OAVComponentList);
            return OAVComponentList;
        }(eui.Component));
        editor.OAVComponentList = OAVComponentList;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 属性面板（检查器）
         * @author feng     2017-03-20
         */
        var InspectorView = /** @class */ (function (_super) {
            __extends(InspectorView, _super);
            function InspectorView() {
                var _this = _super.call(this) || this;
                _this.viewDataList = [];
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "InspectorViewSkin";
                return _this;
            }
            InspectorView.prototype.onComplete = function () {
                this.group.percentWidth = 100;
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                editor.editorui.inspectorView = this;
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            InspectorView.prototype.onAddedToStage = function () {
                this.backButton.visible = this.viewDataList.length > 0;
                this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
                feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onDataChange, this);
            };
            InspectorView.prototype.onRemovedFromStage = function () {
                this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
                feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onDataChange, this);
            };
            InspectorView.prototype.onDataChange = function () {
                var selectedObject = editor.editorData.selectedObjects;
                if (selectedObject && selectedObject.length > 0)
                    this.showData(selectedObject[0], true);
                else
                    this.showData(null, true);
            };
            InspectorView.prototype.updateView = function () {
                var _this = this;
                this.backButton.visible = this.viewDataList.length > 0;
                if (this.view && this.view.parent) {
                    this.view.parent.removeChild(this.view);
                }
                if (this.viewData) {
                    if (this.viewData instanceof editor.AssetsFile) {
                        this.viewData.showInspectorData(function (showdata) {
                            _this.view = feng3d.objectview.getObjectView(showdata);
                            _this.view.percentWidth = 100;
                            _this.group.addChild(_this.view);
                        });
                    }
                    else {
                        this.view = feng3d.objectview.getObjectView(this.viewData);
                        this.view.percentWidth = 100;
                        this.group.addChild(this.view);
                    }
                }
            };
            InspectorView.prototype.showData = function (data, removeBack) {
                if (removeBack === void 0) { removeBack = false; }
                if (this.viewData) {
                    this.viewDataList.push(this.viewData);
                }
                if (removeBack) {
                    this.viewDataList.length = 0;
                }
                //
                this.viewData = data;
                this.updateView();
            };
            InspectorView.prototype.onBackButton = function () {
                this.viewData = this.viewDataList.pop();
                this.updateView();
            };
            return InspectorView;
        }(eui.Component));
        editor.InspectorView = InspectorView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var HierarchyTreeItemRenderer = /** @class */ (function (_super) {
            __extends(HierarchyTreeItemRenderer, _super);
            function HierarchyTreeItemRenderer() {
                return _super.call(this) || this;
            }
            HierarchyTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
                var _this = this;
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                editor.drag.register(this, this.setdargSource.bind(this), ["gameobject", "file_gameobject", "file_script"], function (dragdata) {
                    if (dragdata.gameobject) {
                        if (!dragdata.gameobject.contains(_this.data.gameobject)) {
                            var localToWorldMatrix = dragdata.gameobject.transform.localToWorldMatrix;
                            _this.data.gameobject.addChild(dragdata.gameobject);
                            dragdata.gameobject.transform.localToWorldMatrix = localToWorldMatrix;
                        }
                    }
                    if (dragdata.file_gameobject) {
                        editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, _this.data.gameobject);
                    }
                    if (dragdata.file_script) {
                        feng3d.GameObjectUtil.addScript(_this.data.gameobject, dragdata.file_script.replace(/\.ts\b/, ".js"));
                    }
                });
            };
            HierarchyTreeItemRenderer.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                editor.drag.unregister(this);
            };
            HierarchyTreeItemRenderer.prototype.setdargSource = function (dragSource) {
                dragSource.gameobject = this.data.gameobject;
            };
            HierarchyTreeItemRenderer.prototype.onclick = function () {
                HierarchyTreeItemRenderer.preSelectedItem = this;
                editor.editorData.selectObject(this.data.gameobject);
            };
            HierarchyTreeItemRenderer.prototype.onrightclick = function (e) {
                var _this = this;
                var menuconfig = [];
                //scene3d无法删除
                if (this.data.gameobject.scene.gameObject != this.data.gameobject) {
                    menuconfig.push({
                        label: "delete", click: function () {
                            _this.data.gameobject.parent.removeChild(_this.data.gameobject);
                        }
                    });
                }
                menuconfig = menuconfig.concat({ type: 'separator' }, editor.createObjectConfig);
                if (menuconfig.length > 0)
                    editor.menu.popup(menuconfig);
            };
            return HierarchyTreeItemRenderer;
        }(editor.TreeItemRenderer));
        editor.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var HierarchyView = /** @class */ (function (_super) {
            __extends(HierarchyView, _super);
            function HierarchyView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "HierarchyViewSkin";
                return _this;
            }
            HierarchyView.prototype.onComplete = function () {
                this.list.itemRenderer = editor.HierarchyTreeItemRenderer;
                this.listData = this.list.dataProvider = new eui.ArrayCollection();
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            HierarchyView.prototype.onAddedToStage = function () {
                this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
                this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
                editor.hierarchyTree.on("added", this.invalidHierarchy, this);
                editor.hierarchyTree.on("removed", this.invalidHierarchy, this);
                editor.hierarchyTree.on("openChanged", this.invalidHierarchy, this);
                this.updateHierarchyTree();
            };
            HierarchyView.prototype.onRemovedFromStage = function () {
                this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
                this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
                editor.hierarchyTree.off("added", this.invalidHierarchy, this);
                editor.hierarchyTree.off("removed", this.invalidHierarchy, this);
                editor.hierarchyTree.off("openChanged", this.invalidHierarchy, this);
            };
            HierarchyView.prototype.invalidHierarchy = function () {
                feng3d.ticker.onceframe(this.updateHierarchyTree, this);
            };
            HierarchyView.prototype.updateHierarchyTree = function () {
                var nodes = editor.hierarchyTree.getShowNodes();
                this.listData.replaceAll(nodes);
            };
            HierarchyView.prototype.onListbackClick = function () {
                feng3d.log("onListbackClick");
            };
            HierarchyView.prototype.onListClick = function (e) {
                if (e.target == this.list) {
                    editor.editorData.selectObject(null);
                }
            };
            HierarchyView.prototype.onListRightClick = function (e) {
                if (e.target == this.list) {
                    editor.editorData.selectObject(null);
                    editor.menu.popup(editor.createObjectConfig, feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
                }
            };
            return HierarchyView;
        }(eui.Component));
        editor.HierarchyView = HierarchyView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.assetsDispather = new feng3d.EventDispatcher();
        /**
         * 根文件
         */
        var rootfileinfo;
        editor.editorAssets = {
            //attribute
            /**
             * 项目根路径
             */
            projectPath: "",
            assetsPath: "",
            showFloder: "",
            //function
            initproject: function (path, callback) {
                var assetsPath = "Assets";
                editor.editorAssets.projectPath = path;
                editor.editorAssets.assetsPath = assetsPath;
                //
                editor.fs.stat(assetsPath, function (err, fileInfo) {
                    if (err) {
                        editor.fs.mkdir(assetsPath, function (err) {
                            if (err) {
                                alert("初始化项目失败！");
                                feng3d.error(err);
                                return;
                            }
                            editor.fs.stat(assetsPath, function (err, fileInfo) {
                                rootfileinfo = new editor.AssetsFile(fileInfo);
                                editor.editorAssets.showFloder = fileInfo.path;
                                rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                            });
                        });
                    }
                    else {
                        rootfileinfo = new editor.AssetsFile(fileInfo);
                        editor.editorAssets.showFloder = fileInfo.path;
                        rootfileinfo.initChildren(Number.MAX_VALUE, callback);
                    }
                });
            },
            /**
             * 获取文件
             * @param path 文件路径
             */
            getFile: function (path) {
                return rootfileinfo.getFile(path);
            },
            /**
             * 删除文件
             * @param path 文件路径
             */
            deletefile: function (path, callback) {
                var assetsFile = editor.editorAssets.getFile(path);
                if (assetsFile)
                    assetsFile.deleteFile(callback);
                else {
                    editor.fs.remove(path, function () {
                        callback(null);
                    });
                }
            },
            readScene: function (path, callback) {
                editor.fs.readFileAsString(path, function (err, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    var json = JSON.parse(data);
                    var sceneobject = feng3d.serialization.deserialize(json);
                    var scene = sceneobject.getComponent(feng3d.Scene3D);
                    scene.initCollectComponents();
                    callback(null, scene);
                });
            },
            /**
             * 保存场景到文件
             * @param path 场景路径
             * @param scene 保存的场景
             */
            saveScene: function (path, scene, callback) {
                if (callback === void 0) { callback = function (err) { }; }
                var obj = feng3d.serialization.serialize(scene.gameObject);
                var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                feng3d.dataTransform.stringToUint8Array(str, function (uint8Array) {
                    editor.fs.writeFile(path, uint8Array, callback);
                });
            },
            /**
            * 移动文件
            * @param path 移动的文件路径
            * @param destdirpath   目标文件夹
            * @param callback      完成回调
            */
            movefile: function (path, destdirpath, callback) {
                var assetsfile = editor.editorAssets.getFile(path);
                if (assetsfile) {
                    assetsfile.move(destdirpath, callback);
                }
                else {
                    var filename = assetsfile.name;
                    var dest = destdirpath + "/" + filename;
                    editor.fs.move(path, dest, callback);
                }
            },
            getparentdir: function (path) {
                var paths = path.split("/");
                paths.pop();
                var parentdir = paths.join("/");
                return parentdir;
            },
            /**
             * 弹出文件菜单
             */
            popupmenu: function (assetsFile) {
                var menuconfig = [];
                if (assetsFile.isDirectory) {
                    menuconfig.push({
                        label: "create folder", click: function () {
                            assetsFile.addfolder("New Folder");
                        }
                    }, {
                        label: "create script", click: function () {
                            assetsFile.addfile("NewScript.ts", editor.assetsFileTemplates.NewScript);
                        }
                    }, {
                        label: "create json", click: function () {
                            assetsFile.addfile("new json.json", "{}");
                        }
                    }, {
                        label: "create txt", click: function () {
                            assetsFile.addfile("new text.txt", "");
                        }
                    }, { type: "separator" }, {
                        label: "create material", click: function () {
                            assetsFile.addfile("new material" + ".material", new feng3d.StandardMaterial());
                        }
                    }, { type: "separator" }, {
                        label: "导入资源", click: function () {
                            editor.fs.selectFile(editor.editorAssets.inputFiles, { name: '模型文件', extensions: ["obj", 'mdl', 'fbx', "md5mesh", 'md5anim'] });
                        }
                    });
                }
                if (menuconfig.length > 0) {
                    menuconfig.push({ type: "separator" });
                }
                menuconfig.push({
                    label: "delete", click: function () {
                        assetsFile.deleteFile();
                    }
                });
                editor.menu.popup(menuconfig);
            },
            /**
             * 获取一个新路径
             */
            getnewpath: function (path, callback) {
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
                    editor.fs.stat(path, function (err, stats) {
                        if (err)
                            callback(path);
                        else {
                            searchnewpath();
                        }
                    });
                }
            },
            saveObject: function (object, filename, override, callback) {
                if (override === void 0) { override = false; }
                var showFloder = editor.editorAssets.getFile(editor.editorAssets.showFloder);
                showFloder.addfile(filename, object, override, callback);
            },
            /**
             * 过滤出文件列表
             * @param fn 过滤函数
             * @param next 是否继续遍历children
             */
            filter: function (fn, next) {
                var files = rootfileinfo.filter(fn, next);
                return files;
            },
            inputFiles: function (files) {
                for (var i = 0; i < files.length; i++) {
                    var element = files[i];
                    editor.editorAssets.inputFile(element);
                }
            },
            inputFile: function (file) {
                if (!file)
                    return;
                var extensions = file.name.split(".").pop();
                var reader = new FileReader();
                switch (extensions) {
                    case "mdl":
                        reader.addEventListener('load', function (event) {
                            feng3d.war3.MdlParser.parse(event.target["result"], function (war3Model) {
                                war3Model.root = file.name.substring(0, file.name.lastIndexOf("/") + 1);
                                var gameobject = war3Model.getMesh();
                                gameobject.name = file.name.split("/").pop().split(".").shift();
                                editor.editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                            });
                        }, false);
                        reader.readAsText(file);
                        break;
                    case "obj":
                        reader.addEventListener('load', function (event) {
                            feng3d.ObjLoader.parse(event.target["result"], function (gameobject) {
                                gameobject.name = file.name.split("/").pop().split(".").shift();
                                editor.editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                            });
                        }, false);
                        reader.readAsText(file);
                        break;
                    case "fbx":
                        // fbxLoader.load(path, (gameobject) =>
                        // {
                        //     gameobject.name = path.split("/").pop().split(".").shift();
                        //     saveGameObject(gameobject);
                        //     // engine.root.addChild(gameobject);
                        // });
                        editor.threejsLoader.load(file, function (gameobject) {
                            gameobject.name = file.name.split("/").pop().split(".").shift();
                            editor.editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                            // engine.root.addChild(gameobject);
                        });
                        break;
                    case "md5mesh":
                        reader.addEventListener('load', function (event) {
                            feng3d.MD5Loader.parseMD5Mesh(event.target["result"], function (gameobject) {
                                gameobject.name = file.name.split("/").pop().split(".").shift();
                                editor.editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                                // engine.root.addChild(gameobject);
                            });
                        }, false);
                        reader.readAsText(file);
                        break;
                    case "md5anim":
                        reader.addEventListener('load', function (event) {
                            feng3d.MD5Loader.parseMD5Anim(event.target["result"], function (animationclip) {
                                animationclip.name = file.name.split("/").pop().split(".").shift();
                                editor.editorAssets.saveObject(animationclip, animationclip.name + ".anim");
                            });
                        }, false);
                        reader.readAsText(file);
                        break;
                    default:
                        reader.addEventListener('load', function (event) {
                            var showFloder = editor.editorAssets.getFile(editor.editorAssets.showFloder);
                            var result = event.target["result"];
                            showFloder.addfile(file.name, result);
                        }, false);
                        reader.readAsArrayBuffer(file);
                        break;
                }
            }
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var AssetExtension;
        (function (AssetExtension) {
            AssetExtension["folder"] = "folder";
            AssetExtension["material"] = "material";
            AssetExtension["geometry"] = "geometry";
            AssetExtension["gameobject"] = "gameobject";
            AssetExtension["anim"] = "anim";
            AssetExtension["png"] = "png";
            AssetExtension["jpg"] = "jpg";
            AssetExtension["ts"] = "ts";
            AssetExtension["scene"] = "scene";
        })(AssetExtension = editor.AssetExtension || (editor.AssetExtension = {}));
        var AssetsFile = /** @class */ (function (_super) {
            __extends(AssetsFile, _super);
            function AssetsFile(fileinfo, data) {
                var _this = _super.call(this) || this;
                /**
                 * 目录深度
                 */
                _this.depth = 0;
                _this._isOpen = true;
                /**
                 * 是否选中
                 */
                _this.selected = false;
                /**
                 * 当前打开文件夹
                 */
                _this.currentOpenDirectory = false;
                _this._path = fileinfo.path;
                _this._birthtime = fileinfo.birthtime;
                _this._mtime = fileinfo.mtime;
                _this._isDirectory = fileinfo.isDirectory;
                _this._size = fileinfo.size;
                _this._children = [];
                _this._data = data;
                if (fileinfo.isDirectory) {
                    _this.image = "folder_png";
                }
                else {
                    var filename = fileinfo.path.split("/").pop();
                    var extension = filename.split(".").pop();
                    if (RES.getRes(extension + "_png")) {
                        _this.image = extension + "_png";
                    }
                    else {
                        _this.image = "file_png";
                    }
                }
                if (/(.jpg|.png)\b/.test(fileinfo.path)) {
                    _this.getData(function (data) {
                        _this.image = data;
                    });
                }
                return _this;
            }
            Object.defineProperty(AssetsFile.prototype, "path", {
                /**
                 * 路径
                 */
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "birthtime", {
                /**
                 * 创建时间
                 */
                get: function () {
                    return this._birthtime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "mtime", {
                /**
                 * 修改时间
                 */
                get: function () {
                    return this._mtime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "isDirectory", {
                /**
                 * 是否文件夹
                 */
                get: function () {
                    return this._isDirectory;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "size", {
                /**
                 * 文件尺寸
                 */
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "parent", {
                /**
                 * 父节点
                 */
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "children", {
                /**
                 * 子节点列表
                 */
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "isOpen", {
                /**
                 * 文件夹是否打开
                 */
                get: function () {
                    return this._isOpen;
                },
                set: function (value) {
                    this._isOpen = value;
                    editor.assetsDispather.dispatch("openChanged");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "name", {
                /**
                 * 文件夹名称
                 */
                get: function () {
                    return this._path.split("/").pop();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "label", {
                /**
                 * 显示标签
                 */
                get: function () {
                    var label = this.name;
                    label = label.split(".").shift();
                    return label;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "extension", {
                get: function () {
                    if (this._isDirectory)
                        return AssetExtension.folder;
                    return this._path.split(".").pop();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AssetsFile.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取属性显示数据
             * @param callback 获取属性面板显示数据回调
             */
            AssetsFile.prototype.showInspectorData = function (callback) {
                if (this._data) {
                    callback(this._data);
                    return;
                }
                this.getData(function (data) {
                    callback(data);
                });
            };
            /**
             * 获取文件数据
             * @param callback 获取文件数据回调
             */
            AssetsFile.prototype.getData = function (callback) {
                var _this = this;
                if (this._data) {
                    callback(this._data);
                    return;
                }
                if (this.extension == AssetExtension.material
                    || this.extension == AssetExtension.gameobject
                    || this.extension == AssetExtension.anim
                    || this.extension == AssetExtension.scene
                    || this.extension == AssetExtension.geometry) {
                    editor.fs.readFileAsString(this._path, function (err, content) {
                        var json = JSON.parse(content);
                        _this._data = feng3d.serialization.deserialize(json);
                        callback(_this._data);
                    });
                    return;
                }
                if (this.extension == AssetExtension.png || this.extension == AssetExtension.jpg) {
                    editor.fs.readFile(this._path, function (err, data) {
                        feng3d.dataTransform.arrayBufferToDataURL(data, function (dataurl) {
                            _this._data = dataurl;
                            callback(_this._data);
                        });
                    });
                    return;
                }
                editor.fs.readFileAsString(this._path, function (err, content) {
                    _this._data = content;
                    callback(_this._data);
                });
            };
            /**
             * 设置拖拽数据
             * @param dragsource 拖拽数据
             */
            AssetsFile.prototype.setDragSource = function (dragsource) {
                switch (this.extension) {
                    case AssetExtension.gameobject:
                        dragsource.file_gameobject = this.path;
                        break;
                    case AssetExtension.material:
                        this.getData(function (data) {
                            dragsource.material = data;
                        });
                        break;
                }
                dragsource.file = this.path;
            };
            /**
             * 初始化子文件
             */
            AssetsFile.prototype.initChildren = function (depth, callback) {
                var _this = this;
                if (depth === void 0) { depth = 0; }
                if (!this._isDirectory || depth < 0) {
                    callback();
                    return;
                }
                editor.fs.readdir(this._path, function (err, files) {
                    var initfiles = function () {
                        if (files.length == 0) {
                            callback();
                            return;
                        }
                        var file = files.shift();
                        editor.fs.stat(_this._path + "/" + file, function (err, stats) {
                            feng3d.assert(!err);
                            var child = new AssetsFile(stats);
                            child._parent = _this;
                            _this.children.push(child);
                            child.initChildren(depth - 1, initfiles);
                        });
                    };
                    initfiles();
                });
            };
            /**
             * 根据相对路径获取子文件
             * @param path 相对路径
             */
            AssetsFile.prototype.getFile = function (path) {
                if (typeof path == "string") {
                    path = path.replace(this._path + "/", "");
                    path = path.replace(this._path, "");
                    path = path.split("/");
                }
                if (path.join("/") == "")
                    return this;
                var childname = path.shift();
                if (this.children) {
                    for (var i = 0; i < this.children.length; i++) {
                        if (this.children[i].name == childname) {
                            var result = this.children[i].getFile(path);
                            if (result)
                                return result;
                        }
                    }
                }
                return null;
            };
            AssetsFile.prototype.removeChild = function (file) {
                file.remove();
            };
            /**
             * 从父节点移除
             */
            AssetsFile.prototype.remove = function () {
                if (this.parent) {
                    var index = this.parent.children.indexOf(this);
                    feng3d.assert(index != -1);
                    this.parent.children.splice(index, 1);
                    this._parent = null;
                    editor.editorui.assetsview.updateShowFloder();
                    editor.assetsDispather.dispatch("changed");
                }
            };
            /**
             * 移除所有子节点
             */
            AssetsFile.prototype.removeChildren = function () {
                var children = this.children.concat();
                children.forEach(function (element) {
                    element.remove();
                });
            };
            /**
             * 销毁
             */
            AssetsFile.prototype.destroy = function () {
                this.remove();
                this.removeChildren();
                this._children = null;
            };
            /**
             * 添加到父节点
             * @param parent 父节点
             */
            AssetsFile.prototype.addto = function (parent) {
                this.remove();
                feng3d.assert(!!parent);
                parent.children.push(this);
                this._parent = parent;
                editor.editorui.assetsview.updateShowFloder();
                editor.assetsDispather.dispatch("changed");
            };
            /**
             * 删除文件（夹）
             */
            AssetsFile.prototype.deleteFile = function (callback) {
                var _this = this;
                if (this._path == editor.editorAssets.assetsPath) {
                    alert("无法删除根目录");
                    return;
                }
                var deletefile = function () {
                    editor.fs.remove(_this._path, function (err) {
                        feng3d.assert(!err);
                        _this.destroy();
                        //
                        _this._parent = null;
                        callback && callback(_this);
                    });
                    if (/\.ts\b/.test(_this._path)) {
                        editor.editorAssets.deletefile(_this._path.replace(/\.ts\b/, ".js"), function () { });
                        editor.editorAssets.deletefile(_this._path.replace(/\.ts\b/, ".js.map"), function () { });
                    }
                };
                var checkDirDelete = function () {
                    if (_this.children.length == 0)
                        deletefile();
                };
                if (this._isDirectory) {
                    this.children.forEach(function (element) {
                        element.deleteFile(function () {
                            checkDirDelete();
                        });
                    });
                    checkDirDelete();
                }
                else {
                    deletefile();
                }
            };
            /**
             * 重命名
             * @param newname 新文件名称
             * @param callback 重命名完成回调
             */
            AssetsFile.prototype.rename = function (newname, callback) {
                var _this = this;
                var oldPath = this._path;
                var newPath = this.parent.path + "/" + newname;
                editor.fs.rename(oldPath, this.parent.path + "/" + newname, function (err) {
                    feng3d.assert(!err);
                    _this._path = newPath;
                    if (_this.isDirectory)
                        editor.editorui.assetsview.updateAssetsTree();
                    if (editor.editorAssets.showFloder == oldPath) {
                        editor.editorAssets.showFloder = newPath;
                    }
                    callback && callback(_this);
                });
            };
            /**
             * 移动文件（夹）到指定文件夹
             * @param destdirpath 目标文件夹路径
             * @param callback 移动文件完成回调
             */
            AssetsFile.prototype.move = function (destdirpath, callback) {
                var _this = this;
                var oldpath = this._path;
                var newpath = destdirpath + "/" + this.name;
                var destDir = editor.editorAssets.getFile(destdirpath);
                //禁止向子文件夹移动
                if (oldpath == editor.editorAssets.getparentdir(destdirpath))
                    return;
                if (/\.ts\b/.test(this._path)) {
                    var jspath = this._path.replace(/\.ts\b/, ".js");
                    var jsmappath = this._path.replace(/\.ts\b/, ".js.map");
                    editor.editorAssets.movefile(jspath, destdirpath);
                    editor.editorAssets.movefile(jsmappath, destdirpath);
                }
                editor.fs.move(oldpath, newpath, function (err) {
                    feng3d.assert(!err);
                    _this._path = newpath;
                    _this.addto(destDir);
                    if (_this.isDirectory)
                        editor.editorui.assetsview.updateAssetsTree();
                    if (editor.editorAssets.showFloder == oldpath) {
                        editor.editorAssets.showFloder = newpath;
                    }
                    callback && callback(_this);
                });
            };
            /**
             * 新增子文件夹
             * @param newfoldername 新增文件夹名称
             * @param callback      完成回调
             */
            AssetsFile.prototype.addfolder = function (newfoldername, callback) {
                var _this = this;
                newfoldername = this.getnewchildname(newfoldername);
                var folderpath = this._path + "/" + newfoldername;
                editor.fs.mkdir(folderpath, function (e) {
                    feng3d.assert(!e);
                    editor.fs.stat(folderpath, function (err, stats) {
                        var assetsFile = new AssetsFile(stats);
                        assetsFile.addto(_this);
                    });
                });
            };
            /**
             * 新增文件
             * @param filename 新增文件名称
             * @param content 文件内容
             * @param callback 完成回调
             */
            AssetsFile.prototype.addfile = function (filename, content, override, callback) {
                var _this = this;
                if (override === void 0) { override = false; }
                if (!override) {
                    filename = this.getnewchildname(filename);
                }
                var filepath = this._path + "/" + filename;
                getcontent(function (savedata, data) {
                    editor.fs.writeFile(filepath, savedata, function (e) {
                        editor.fs.stat(filepath, function (err, stats) {
                            var assetsFile = new AssetsFile(stats, data);
                            assetsFile.addto(_this);
                            callback && callback(_this);
                        });
                    });
                });
                function getcontent(callback) {
                    var saveContent = content;
                    if (content instanceof feng3d.StandardMaterial
                        || content instanceof feng3d.GameObject
                        || content instanceof feng3d.AnimationClip) {
                        var obj = feng3d.serialization.serialize(content);
                        var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                        feng3d.dataTransform.stringToUint8Array(str, function (uint8Array) {
                            callback(uint8Array, saveContent);
                        });
                    }
                    else if (/(\.jpg\b|\.png\b)/.test(filename)) {
                        feng3d.dataTransform.arrayBufferToDataURL(content, function (datarul) {
                            callback(content, datarul);
                        });
                    }
                    else {
                        callback(content, content);
                    }
                }
            };
            /**
             * 过滤出文件列表
             * @param fn 过滤函数
             * @param next 是否继续遍历children
             */
            AssetsFile.prototype.filter = function (fn, next) {
                var result = [];
                next = next || (function () { return true; });
                if (fn(this))
                    result.push(this);
                if (next(this)) {
                    this.children.forEach(function (element) {
                        var childResult = element.filter(fn, next);
                        result = result.concat(childResult);
                    });
                }
                return result;
            };
            /**
             * 获取一个新的不重名子文件名称
             */
            AssetsFile.prototype.getnewchildname = function (childname) {
                var childrennames = this.children.reduce(function (arr, item) { arr.push(item.name); return arr; }, []);
                if (childrennames.indexOf(childname) == -1)
                    return childname;
                var basepath = "";
                var ext = "";
                if (childname.indexOf(".") == -1) {
                    basepath = childname;
                    ext = "";
                }
                else {
                    basepath = childname.substring(0, childname.indexOf("."));
                    ext = childname.substring(childname.indexOf("."));
                }
                var index = 1;
                do {
                    var path = basepath + " " + index + ext;
                    index++;
                } while (childrennames.indexOf(path) != -1);
                return path;
            };
            return AssetsFile;
        }(editor.TreeNode));
        editor.AssetsFile = AssetsFile;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var AssetsFileItemRenderer = /** @class */ (function (_super) {
            __extends(AssetsFileItemRenderer, _super);
            function AssetsFileItemRenderer() {
                var _this = _super.call(this) || this;
                _this.skinName = "AssetsFileItemRenderer";
                return _this;
            }
            AssetsFileItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
                this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.nameLabel.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
                this.nameeditTxt.textDisplay.textAlign = egret.HorizontalAlign.CENTER;
            };
            AssetsFileItemRenderer.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
                this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.nameLabel.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            };
            AssetsFileItemRenderer.prototype.dataChanged = function () {
                var _this = this;
                _super.prototype.dataChanged.call(this);
                if (this.data) {
                    var accepttypes = [];
                    if (this.data.isDirectory) {
                        editor.drag.register(this, function (dragsource) {
                            _this.data.setDragSource(dragsource);
                        }, ["file"], function (dragdata) {
                            var movefile = editor.editorAssets.getFile(dragdata.file);
                            movefile.move(_this.data.path);
                        });
                    }
                    else {
                        editor.drag.register(this, function (dragsource) {
                            var extension = _this.data.extension;
                            switch (extension) {
                                case editor.AssetExtension.gameobject:
                                    dragsource.file_gameobject = _this.data.path;
                                    break;
                                case editor.AssetExtension.ts:
                                    dragsource.file_script = _this.data.path;
                                    break;
                                case editor.AssetExtension.anim:
                                    var path = _this.data.path;
                                    _this.data.getData(function (data) {
                                        dragsource.animationclip = data;
                                        editor.drag.refreshAcceptables();
                                    });
                                    break;
                                case editor.AssetExtension.material:
                                    var path = _this.data.path;
                                    _this.data.getData(function (data) {
                                        dragsource.material = data;
                                        editor.drag.refreshAcceptables();
                                    });
                                    break;
                                case editor.AssetExtension.geometry:
                                    var path = _this.data.path;
                                    _this.data.getData(function (data) {
                                        dragsource.geometry = data;
                                        editor.drag.refreshAcceptables();
                                    });
                                    break;
                            }
                            dragsource.file = _this.data.path;
                        }, []);
                    }
                }
                else {
                    editor.drag.unregister(this);
                }
            };
            AssetsFileItemRenderer.prototype.ondoubleclick = function () {
                if (this.data.isDirectory) {
                    editor.editorAssets.showFloder = this.data.path;
                }
                else if (this.data.extension == editor.AssetExtension.scene) {
                    this.data.getData(function (data) {
                        var scene = data.getComponent(feng3d.Scene3D);
                        scene.initCollectComponents();
                        editor.engine.scene = scene;
                    });
                }
            };
            AssetsFileItemRenderer.prototype.onclick = function () {
                editor.editorData.selectObject(this.data);
            };
            AssetsFileItemRenderer.prototype.onrightclick = function (e) {
                e.stopPropagation();
                editor.editorAssets.popupmenu(this.data);
            };
            AssetsFileItemRenderer.prototype.onnameLabelclick = function () {
                if (this.data.selected) {
                    this.nameeditTxt.text = this.nameLabel.text;
                    this.nameLabel.visible = false;
                    this.nameeditTxt.visible = true;
                    this.nameeditTxt.textDisplay.setFocus();
                    this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                }
            };
            AssetsFileItemRenderer.prototype.onnameeditend = function () {
                this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                this.nameeditTxt.visible = false;
                this.nameLabel.visible = true;
                if (this.nameLabel.text == this.nameeditTxt.text)
                    return;
                var newName = this.data.name.replace(this.nameLabel.text, this.nameeditTxt.text);
                this.data.rename(newName);
            };
            return AssetsFileItemRenderer;
        }(eui.ItemRenderer));
        editor.AssetsFileItemRenderer = AssetsFileItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var AssetsTreeItemRenderer = /** @class */ (function (_super) {
            __extends(AssetsTreeItemRenderer, _super);
            function AssetsTreeItemRenderer() {
                var _this = _super.call(this) || this;
                _this.skinName = "AssetsTreeItemRenderer";
                return _this;
            }
            AssetsTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.namelabel.addEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            };
            AssetsTreeItemRenderer.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
                this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
                this.namelabel.removeEventListener(egret.MouseEvent.CLICK, this.onnameLabelclick, this);
            };
            AssetsTreeItemRenderer.prototype.dataChanged = function () {
                var _this = this;
                _super.prototype.dataChanged.call(this);
                if (this.data) {
                    var accepttypes = [];
                    editor.drag.register(this, function (dragsource) {
                        dragsource.file = _this.data.path;
                    }, ["file"], function (dragdata) {
                        var movefile = editor.editorAssets.getFile(dragdata.file);
                        movefile.move(_this.data.path);
                    });
                }
                else {
                    editor.drag.unregister(this);
                }
            };
            AssetsTreeItemRenderer.prototype.onclick = function () {
                editor.editorAssets.showFloder = this.data.path;
            };
            AssetsTreeItemRenderer.prototype.onrightclick = function (e) {
                editor.editorAssets.popupmenu(this.data);
            };
            AssetsTreeItemRenderer.prototype.onnameLabelclick = function () {
                if (this.data.parent == null)
                    return;
                if (this.data.selected && !feng3d.windowEventProxy.rightmouse) {
                    this.nameeditTxt.text = this.namelabel.text;
                    this.namelabel.visible = false;
                    this.nameeditTxt.visible = true;
                    this.nameeditTxt.textDisplay.setFocus();
                    this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                }
            };
            AssetsTreeItemRenderer.prototype.onnameeditend = function () {
                this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onnameeditend, this);
                this.nameeditTxt.visible = false;
                this.namelabel.visible = true;
                if (this.nameeditTxt.text == this.namelabel.text)
                    return;
                var newName = this.data.name.replace(this.namelabel.text, this.nameeditTxt.text);
                this.data.rename(newName);
            };
            return AssetsTreeItemRenderer;
        }(editor.TreeItemRenderer));
        editor.AssetsTreeItemRenderer = AssetsTreeItemRenderer;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var AssetsView = /** @class */ (function (_super) {
            __extends(AssetsView, _super);
            function AssetsView() {
                var _this = _super.call(this) || this;
                //
                _this.viewdata = { selectfilename: "" };
                //
                _this._assetstreeInvalid = true;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "AssetsView";
                editor.editorui.assetsview = _this;
                _this.fileDrag = new FileDrag(_this);
                return _this;
            }
            AssetsView.prototype.onComplete = function () {
                this.treelist.itemRenderer = editor.AssetsTreeItemRenderer;
                this.filelist.itemRenderer = editor.AssetsFileItemRenderer;
                this.listData = this.treelist.dataProvider = new eui.ArrayCollection();
                this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
            };
            AssetsView.prototype.$onAddToStage = function (stage, nestLevel) {
                _super.prototype.$onAddToStage.call(this, stage, nestLevel);
                this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
                this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
                this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.floderpathTxt.touchEnabled = true;
                this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
                feng3d.watcher.watch(editor.editorAssets, "showFloder", this.updateShowFloder, this);
                feng3d.watcher.watch(editor.editorData, "selectedObjects", this.selectedfilechanged, this);
                editor.assetsDispather.on("changed", this.invalidateAssetstree, this);
                editor.assetsDispather.on("openChanged", this.invalidateAssetstree, this);
                this.excludeTxt.text = "(\\.d\\.ts|\\.js\\.map|\\.js)\\b";
                //
                editor.drag.register(this.filelistgroup, function (dragsource) { }, ["gameobject", "animationclip", "material", "geometry"], function (dragSource) {
                    if (dragSource.gameobject) {
                        var gameobject = dragSource.gameobject;
                        editor.editorAssets.saveObject(gameobject, gameobject.name + ".gameobject");
                    }
                    if (dragSource.animationclip) {
                        var animationclip = dragSource.animationclip;
                        editor.editorAssets.saveObject(animationclip, animationclip.name + ".anim");
                    }
                    if (dragSource.material) {
                        var material = dragSource.material;
                        editor.editorAssets.saveObject(material, material.shaderName + ".material");
                    }
                    if (dragSource.geometry) {
                        var geometry = dragSource.geometry;
                        editor.editorAssets.saveObject(geometry, geometry.name + ".geometry");
                    }
                });
                this.fileDrag.addEventListener();
                this.initlist();
            };
            AssetsView.prototype.$onRemoveFromStage = function () {
                _super.prototype.$onRemoveFromStage.call(this);
                this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
                this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
                this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
                this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
                feng3d.watcher.unwatch(editor.editorAssets, "showFloder", this.updateShowFloder, this);
                feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.selectedfilechanged, this);
                editor.assetsDispather.off("changed", this.invalidateAssetstree, this);
                editor.assetsDispather.off("openChanged", this.invalidateAssetstree, this);
                //
                editor.drag.unregister(this.filelistgroup);
                this.fileDrag.removeEventListener();
            };
            AssetsView.prototype.initlist = function () {
                var _this = this;
                editor.editorAssets.initproject(editor.editorAssets.projectPath, function () {
                    _this.invalidateAssetstree();
                });
            };
            AssetsView.prototype.update = function () {
                if (this._assetstreeInvalid) {
                    this.updateAssetsTree();
                    this.updateShowFloder();
                    this._assetstreeInvalid = false;
                }
            };
            AssetsView.prototype.invalidateAssetstree = function () {
                this._assetstreeInvalid = true;
                this.once(egret.Event.ENTER_FRAME, this.update, this);
            };
            AssetsView.prototype.updateAssetsTree = function () {
                var nodes = editor.editorAssets.filter(function (file) {
                    if (file.isDirectory) {
                        file.depth = file.parent ? file.parent.depth + 1 : 0;
                        return true;
                    }
                }, function (assetsFile) {
                    if (assetsFile.isOpen)
                        return true;
                });
                this.listData.replaceAll(nodes);
            };
            AssetsView.prototype.updateShowFloder = function (host, property, oldvalue) {
                var _this = this;
                if (oldvalue) {
                    var oldnode = editor.editorAssets.getFile(oldvalue);
                    if (oldnode) {
                        oldnode.currentOpenDirectory = false;
                    }
                }
                if (editor.editorAssets.showFloder) {
                    var newnode = editor.editorAssets.getFile(editor.editorAssets.showFloder);
                    if (newnode) {
                        newnode.currentOpenDirectory = true;
                    }
                }
                var floders = editor.editorAssets.showFloder.split("/");
                var textFlow = new Array();
                do {
                    var path = floders.join("/");
                    if (textFlow.length > 0)
                        textFlow.unshift({ text: " > " });
                    textFlow.unshift({ text: floders.pop(), style: { "href": "event:" + path } });
                    if (path == editor.editorAssets.assetsPath)
                        break;
                } while (floders.length > 0);
                this.floderpathTxt.textFlow = textFlow;
                var fileinfo = editor.editorAssets.getFile(editor.editorAssets.showFloder);
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
                    var fileinfos = fileinfo.children.filter(function (value) {
                        if (_this.includeTxt.text) {
                            if (!includeReg.test(value.path))
                                return false;
                        }
                        if (_this.excludeTxt.text) {
                            if (excludeReg.test(value.path))
                                return false;
                        }
                        return true;
                    });
                    var nodes = fileinfos.map(function (value) { return value; });
                    nodes = nodes.sort(function (a, b) {
                        if (a.isDirectory > b.isDirectory)
                            return -1;
                        if (a.isDirectory < b.isDirectory)
                            return 1;
                        if (a.path < b.path)
                            return -1;
                        return 1;
                    });
                    this.filelistData.replaceAll(nodes);
                }
                this.selectedfilechanged();
            };
            AssetsView.prototype.onfilter = function () {
                this.updateShowFloder();
            };
            AssetsView.prototype.selectedfilechanged = function () {
                var _this = this;
                var selectedAssetsFile = editor.editorData.selectedAssetsFile;
                this.viewdata.selectfilename = "";
                var assetsFiles = this.filelistData.source;
                assetsFiles.forEach(function (element) {
                    element.selected = selectedAssetsFile.indexOf(element) != -1;
                    if (element.selected)
                        _this.viewdata.selectfilename = element.name;
                });
            };
            AssetsView.prototype.onfilelistclick = function (e) {
                if (e.target == this.filelist) {
                    editor.editorData.selectObject(null);
                }
            };
            AssetsView.prototype.onfilelistrightclick = function (e) {
                var assetsFile = editor.editorAssets.getFile(editor.editorAssets.showFloder);
                if (assetsFile) {
                    editor.editorAssets.popupmenu(assetsFile);
                }
            };
            AssetsView.prototype.onfloderpathTxtLink = function (evt) {
                editor.editorAssets.showFloder = evt.text;
            };
            return AssetsView;
        }(eui.Component));
        editor.AssetsView = AssetsView;
        var FileDrag = /** @class */ (function () {
            function FileDrag(displayobject) {
                this.addEventListener = function () {
                    document.addEventListener("dragenter", dragenter, false);
                    document.addEventListener("dragover", dragover, false);
                    document.addEventListener("drop", drop, false);
                };
                this.removeEventListener = function () {
                    document.removeEventListener("dragenter", dragenter, false);
                    document.removeEventListener("dragover", dragover, false);
                    document.removeEventListener("drop", drop, false);
                };
                function dragenter(e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                function dragover(e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                function drop(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dt = e.dataTransfer;
                    var files = dt.files;
                    if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY)) {
                        editor.editorAssets.inputFiles(files);
                    }
                }
            }
            return FileDrag;
        }());
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.assetsFileTemplates = {
            NewScript: "\nnamespace feng3d\n{\n    export class NewScript extends Script\n    {\n        /**\n         * \u521D\u59CB\u5316\u65F6\u8C03\u7528\n         */\n        start()\n        {\n\n        }\n\n        /**\n         * \u66F4\u65B0\n         */\n        update()\n        {\n            log(this.gameObject.transform.position);\n        }\n\n        /**\n         * \u9500\u6BC1\u65F6\u8C03\u7528\n         */\n        end()\n        {\n\n        }\n    }\n}\n"
        };
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var TopView = /** @class */ (function (_super) {
            __extends(TopView, _super);
            function TopView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "TopView";
                return _this;
            }
            TopView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            TopView.prototype.onAddedToStage = function () {
                this.mainButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
                feng3d.watcher.watch(editor.mrsTool, "toolType", this.updateview, this);
                this.updateview();
            };
            TopView.prototype.onRemovedFromStage = function () {
                this.mainButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
                this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
                this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
                feng3d.watcher.unwatch(editor.mrsTool, "toolType", this.updateview, this);
            };
            TopView.prototype.onMainMenu = function (item) {
                editor.editorDispatcher.dispatch(item.command);
            };
            TopView.prototype.onHelpButtonClick = function () {
                window.open("index.md");
            };
            TopView.prototype.onButtonClick = function (event) {
                switch (event.currentTarget) {
                    case this.mainButton:
                        editor.menu.popup(editor.mainMenu);
                        break;
                    case this.moveButton:
                        editor.mrsTool.toolType = editor.MRSToolType.MOVE;
                        break;
                    case this.rotateButton:
                        editor.mrsTool.toolType = editor.MRSToolType.ROTATION;
                        break;
                    case this.scaleButton:
                        editor.mrsTool.toolType = editor.MRSToolType.SCALE;
                        break;
                    case this.worldButton:
                        editor.mrsTool.isWoldCoordinate = !editor.mrsTool.isWoldCoordinate;
                        break;
                    case this.centerButton:
                        editor.mrsTool.isBaryCenter = !editor.mrsTool.isBaryCenter;
                        break;
                    case this.playBtn:
                        editor.editorAssets.saveScene("default.scene", editor.engine.scene, function (err) {
                            if (err) {
                                feng3d.warn(err);
                                return;
                            }
                            if (editor.fs == feng3d.indexedDBfs) {
                                window.open("run.html?project=" + editor.editorcache.projectname);
                                return;
                            }
                            editor.fs.getAbsolutePath("index.html", function (err, path) {
                                if (err) {
                                    feng3d.warn(err);
                                    return;
                                }
                                window.open(path);
                            });
                        });
                        break;
                }
            };
            TopView.prototype.updateview = function () {
                this.moveButton.selected = editor.mrsTool.toolType == editor.MRSToolType.MOVE;
                this.rotateButton.selected = editor.mrsTool.toolType == editor.MRSToolType.ROTATION;
                this.scaleButton.selected = editor.mrsTool.toolType == editor.MRSToolType.SCALE;
                this.worldButton.selected = editor.mrsTool.isWoldCoordinate;
                this.centerButton.selected = editor.mrsTool.isBaryCenter;
            };
            return TopView;
        }(eui.Component));
        editor.TopView = TopView;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MainView = /** @class */ (function (_super) {
            __extends(MainView, _super);
            function MainView() {
                var _this = _super.call(this) || this;
                _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
                _this.skinName = "MainViewSkin";
                return _this;
            }
            MainView.prototype.onComplete = function () {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                if (this.stage) {
                    this.onAddedToStage();
                }
            };
            MainView.prototype.onAddedToStage = function () {
            };
            MainView.prototype.onRemovedFromStage = function () {
            };
            return MainView;
        }(eui.Component));
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
        var AssetAdapter = /** @class */ (function () {
            function AssetAdapter() {
            }
            /**
             * @language zh_CN
             * 解析素材
             * @param source 待解析的新素材标识符
             * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
             * @param thisObject callBack的 this 引用
             */
            AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
                function onGetRes(data) {
                    compFunc.call(thisObject, data, source);
                }
                if (RES.hasRes(source)) {
                    var data = RES.getRes(source);
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
            };
            return AssetAdapter;
        }());
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
        var LoadingUI = /** @class */ (function (_super) {
            __extends(LoadingUI, _super);
            function LoadingUI() {
                var _this = _super.call(this) || this;
                _this.createView();
                return _this;
            }
            LoadingUI.prototype.createView = function () {
                this.textField = new egret.TextField();
                this.addChild(this.textField);
                this.textField.y = 300;
                this.textField.width = 480;
                this.textField.height = 100;
                this.textField.textAlign = "center";
            };
            LoadingUI.prototype.setProgress = function (current, total) {
                this.textField.text = "Loading..." + current + "/" + total;
            };
            return LoadingUI;
        }(egret.Sprite));
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
        var MainUI = /** @class */ (function (_super) {
            __extends(MainUI, _super);
            function MainUI(onComplete) {
                if (onComplete === void 0) { onComplete = null; }
                var _this = _super.call(this) || this;
                _this.isThemeLoadEnd = false;
                _this.isResourceLoadEnd = false;
                _this.onComplete = onComplete;
                return _this;
            }
            MainUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                //inject the custom material parser
                //注入自定义的素材解析器
                var assetAdapter = new editor.AssetAdapter();
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
            };
            /**
             * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
             * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
             */
            MainUI.prototype.onConfigComplete = function (event) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                var theme = new eui.Theme("resource/default.thm.json", this.stage);
                theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                RES.loadGroup("preload");
            };
            /**
             * 主题文件加载完成,开始预加载
             * Loading of theme configuration file is complete, start to pre-load the
             */
            MainUI.prototype.onThemeLoadComplete = function () {
                this.isThemeLoadEnd = true;
                this.createScene();
            };
            /**
             * preload资源组加载完成
             * preload resource group is loaded
             */
            MainUI.prototype.onResourceLoadComplete = function (event) {
                if (event.groupName == "preload") {
                    this.stage.removeChild(this.loadingView);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                    this.isResourceLoadEnd = true;
                    this.createScene();
                }
            };
            MainUI.prototype.createScene = function () {
                if (this.isThemeLoadEnd && this.isResourceLoadEnd && this.onComplete) {
                    this.onComplete();
                }
            };
            /**
             * 资源组加载出错
             *  The resource group loading failed
             */
            MainUI.prototype.onItemLoadError = function (event) {
                feng3d.warn("Url:" + event.resItem.url + " has failed to load");
            };
            /**
             * 资源组加载出错
             * Resource group loading failed
             */
            MainUI.prototype.onResourceLoadError = function (event) {
                //TODO
                feng3d.warn("Group:" + event.groupName + " has failed to load");
                //忽略加载失败的项目
                //ignore loading failed projects
                this.onResourceLoadComplete(event);
            };
            /**
             * preload资源组加载进度
             * loading process of preload resource
             */
            MainUI.prototype.onResourceProgress = function (event) {
                if (event.groupName == "preload") {
                    this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                }
            };
            return MainUI;
        }(eui.UILayer));
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
        var ThemeAdapter = /** @class */ (function () {
            function ThemeAdapter() {
            }
            /**
             * 解析主题
             * @param url 待解析的主题url
             * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
             * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
             * @param thisObject 回调的this引用
             */
            ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
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
            };
            return ThemeAdapter;
        }());
        editor.ThemeAdapter = ThemeAdapter;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 是否本地应用
         */
        editor.isNative = isSuportNative();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
/**
 * 判断是否支持本地操作
 */
function isSuportNative() {
    return typeof require != "undefined" && require("fs") != null;
}
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
        /**
         * 编辑器数据
         */
        var EditorData = /** @class */ (function () {
            function EditorData() {
            }
            /**
             * 选择对象
             * 该方法会处理 按ctrl键附加选中对象操作
             * @param objs 选中的对象
             */
            EditorData.prototype.selectObject = function () {
                var objs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    objs[_i] = arguments[_i];
                }
                if (feng3d.shortcut.keyState.getKeyState("ctrl") && this.selectedObjects) {
                    var oldobjs = this.selectedObjects.concat();
                    if (objs) {
                        objs.forEach(function (obj) {
                            if (oldobjs.indexOf(obj) != -1)
                                oldobjs.splice(oldobjs.indexOf(obj), 1);
                            else
                                oldobjs.push(obj);
                        });
                    }
                    objs = oldobjs;
                }
                this.selectedObjects = objs;
            };
            Object.defineProperty(EditorData.prototype, "selectedGameObjects", {
                /**
                 * 选中游戏对象列表
                 */
                get: function () {
                    var result = [];
                    if (this.selectedObjects) {
                        this.selectedObjects.forEach(function (element) {
                            if (element instanceof feng3d.GameObject)
                                result.push(element);
                        });
                    }
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorData.prototype, "firstSelectedGameObject", {
                /**
                 * 第一个选中游戏对象
                 */
                get: function () {
                    return this.selectedGameObjects[0];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorData.prototype, "mrsTransforms", {
                /**
                 * 获取 受 MRSTool 控制的Transform列表
                 */
                get: function () {
                    var transforms = this.selectedGameObjects.reduce(function (result, item) {
                        if (item.getComponent(feng3d.Scene3D))
                            return result;
                        if (item.getComponent(feng3d.Trident))
                            return result;
                        if (item.getComponent(editor.GroundGrid))
                            return result;
                        if (item.getComponent(feng3d.SkinnedMeshRenderer))
                            return result;
                        result.push(item.transform);
                        return result;
                    }, []);
                    return transforms;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorData.prototype, "selectedAssetsFile", {
                /**
                 * 选中游戏对象列表
                 */
                get: function () {
                    var result = [];
                    if (this.selectedObjects) {
                        this.selectedObjects.forEach(function (element) {
                            if (element instanceof editor.AssetsFile)
                                result.push(element);
                        });
                    }
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            return EditorData;
        }());
        editor.EditorData = EditorData;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MRSToolTarget = /** @class */ (function () {
            function MRSToolTarget() {
                this._startScaleVec = [];
                this._controllerToolTransfrom = feng3d.GameObject.create("controllerToolTransfrom").transform;
                feng3d.watcher.watch(editor.mrsTool, "isWoldCoordinate", this.updateControllerImage, this);
                feng3d.watcher.watch(editor.mrsTool, "isBaryCenter", this.updateControllerImage, this);
            }
            Object.defineProperty(MRSToolTarget.prototype, "showGameObject", {
                //
                get: function () {
                    return this._showGameObject;
                },
                set: function (value) {
                    if (this._showGameObject)
                        this._showGameObject.gameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
                    this._showGameObject = value;
                    if (this._showGameObject)
                        this._showGameObject.gameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MRSToolTarget.prototype, "controllerTool", {
                get: function () {
                    return this._controllerTool;
                },
                set: function (value) {
                    this._controllerTool = value;
                    if (this._controllerTool) {
                        this._controllerTool.position = this._controllerToolTransfrom.position;
                        this._controllerTool.rotation = this._controllerToolTransfrom.rotation;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MRSToolTarget.prototype, "controllerTargets", {
                set: function (value) {
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.showGameObject = null;
                    }
                    this._controllerTargets = value;
                    if (this._controllerTargets && this._controllerTargets.length > 0) {
                        this.showGameObject = this._controllerTargets[0];
                        this.updateControllerImage();
                    }
                },
                enumerable: true,
                configurable: true
            });
            MRSToolTarget.prototype.onShowObjectTransformChanged = function (event) {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    if (this._controllerTargets[i] != this._showGameObject) {
                        this._controllerTargets[i].position = this._showGameObject.position;
                        this._controllerTargets[i].rotation = this._showGameObject.rotation;
                        this._controllerTargets[i].scale = this._showGameObject.scale;
                    }
                }
                this.updateControllerImage();
            };
            MRSToolTarget.prototype.updateControllerImage = function () {
                if (!this._controllerTargets || this._controllerTargets.length == 0)
                    return;
                var transform = this._controllerTargets[0];
                var position = new feng3d.Vector3D();
                if (editor.mrsTool.isBaryCenter) {
                    position.copyFrom(transform.scenePosition);
                }
                else {
                    for (var i = 0; i < this._controllerTargets.length; i++) {
                        position.incrementBy(this._controllerTargets[i].scenePosition);
                    }
                    position.scaleBy(1 / this._controllerTargets.length);
                }
                var rotation = new feng3d.Vector3D();
                if (!editor.mrsTool.isWoldCoordinate) {
                    rotation = this._showGameObject.rotation;
                }
                this._controllerToolTransfrom.position = position;
                this._controllerToolTransfrom.rotation = rotation;
                if (this._controllerTool) {
                    this._controllerTool.position = position;
                    this._controllerTool.rotation = rotation;
                }
            };
            /**
             * 开始移动
             */
            MRSToolTarget.prototype.startTranslation = function () {
                this._startTransformDic = new Map();
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var transform = objects[i];
                    this._startTransformDic.set(transform, getTransformData(transform));
                }
            };
            MRSToolTarget.prototype.translation = function (addPos) {
                if (!this._controllerTargets)
                    return;
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var gameobject = objects[i];
                    var transform = this._startTransformDic.get(gameobject);
                    var localMove = addPos.clone();
                    if (gameobject.parent)
                        localMove = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                    gameobject.position = transform.position.add(localMove);
                }
            };
            MRSToolTarget.prototype.stopTranslation = function () {
                this._startTransformDic = null;
            };
            MRSToolTarget.prototype.startRotate = function () {
                this._startTransformDic = new Map();
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                for (var i = 0; i < objects.length; i++) {
                    var transform = objects[i];
                    this._startTransformDic.set(transform, getTransformData(transform));
                }
            };
            /**
             * 绕指定轴旋转
             * @param angle 旋转角度
             * @param normal 旋转轴
             */
            MRSToolTarget.prototype.rotate1 = function (angle, normal) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var localnormal;
                var gameobject = objects[0];
                if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
                }
                for (var i = 0; i < objects.length; i++) {
                    gameobject = objects[i];
                    var tempTransform = this._startTransformDic.get(gameobject);
                    if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                        gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        localnormal = normal.clone();
                        if (gameobject.parent)
                            localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                        if (editor.mrsTool.isBaryCenter) {
                            gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (gameobject.parent)
                                localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            gameobject.position = feng3d.Matrix3D.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                            gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                        }
                    }
                }
            };
            /**
             * 按指定角旋转
             * @param angle1 第一方向旋转角度
             * @param normal1 第一方向旋转轴
             * @param angle2 第二方向旋转角度
             * @param normal2 第二方向旋转轴
             */
            MRSToolTarget.prototype.rotate2 = function (angle1, normal1, angle2, normal2) {
                var objects = this._controllerTargets.concat();
                objects.push(this._controllerTool);
                var gameobject = objects[0];
                if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                    if (gameobject.parent) {
                        normal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                        normal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                    }
                }
                for (var i = 0; i < objects.length; i++) {
                    gameobject = objects[i];
                    var tempsceneTransform = this._startTransformDic.get(gameobject);
                    var tempPosition = tempsceneTransform.position.clone();
                    var tempRotation = tempsceneTransform.rotation.clone();
                    if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                        tempRotation = rotateRotation(tempRotation, normal2, angle2);
                        gameobject.rotation = rotateRotation(tempRotation, normal1, angle1);
                    }
                    else {
                        var localnormal1 = normal1.clone();
                        var localnormal2 = normal2.clone();
                        if (gameobject.parent) {
                            localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                            localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                        }
                        if (editor.mrsTool.isBaryCenter) {
                            tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                            gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                        }
                        else {
                            var localPivotPoint = this._controllerToolTransfrom.position;
                            if (gameobject.parent)
                                localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                            //
                            tempPosition = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            gameobject.position = feng3d.Matrix3D.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                            tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                            gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                        }
                    }
                }
            };
            MRSToolTarget.prototype.stopRote = function () {
                this._startTransformDic = null;
            };
            MRSToolTarget.prototype.startScale = function () {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
                }
            };
            MRSToolTarget.prototype.doScale = function (scale) {
                feng3d.debuger && feng3d.assert(!!scale.length);
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    var result = this._startScaleVec[i].multiply(scale);
                    this._controllerTargets[i].sx = result.x;
                    this._controllerTargets[i].sy = result.y;
                    this._controllerTargets[i].sz = result.z;
                }
            };
            MRSToolTarget.prototype.stopScale = function () {
                this._startScaleVec.length = 0;
            };
            return MRSToolTarget;
        }());
        editor.MRSToolTarget = MRSToolTarget;
        function getTransformData(transform) {
            return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
        }
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
            function toround(a, b, c) {
                if (c === void 0) { c = 360; }
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
        /**
         * 移动工具模型组件
         */
        var MToolModel = /** @class */ (function (_super) {
            __extends(MToolModel, _super);
            function MToolModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MToolModel.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.gameObject.name = "GameObjectMoveModel";
                this.initModels();
            };
            MToolModel.prototype.initModels = function () {
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
            };
            return MToolModel;
        }(feng3d.Component));
        editor.MToolModel = MToolModel;
        var CoordinateAxis = /** @class */ (function (_super) {
            __extends(CoordinateAxis, _super);
            function CoordinateAxis() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.color = new feng3d.Color(1, 0, 0, 0.99);
                _this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                _this.length = 100;
                _this._selected = false;
                return _this;
            }
            Object.defineProperty(CoordinateAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateAxis.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
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
            };
            CoordinateAxis.prototype.update = function () {
                this.segmentMaterial.color = this.selected ? this.selectedColor : this.color;
                //
                this.material.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateAxis;
        }(feng3d.Component));
        editor.CoordinateAxis = CoordinateAxis;
        var CoordinateCube = /** @class */ (function (_super) {
            __extends(CoordinateCube, _super);
            function CoordinateCube() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.color = new feng3d.Color(1, 1, 1, 0.99);
                _this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                _this._selected = false;
                return _this;
            }
            Object.defineProperty(CoordinateCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateCube.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                //
                this.oCube = feng3d.GameObject.create();
                var meshRenderer = this.oCube.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.CubeGeometry(8, 8, 8);
                this.colorMaterial = meshRenderer.material = new feng3d.ColorMaterial();
                this.oCube.mouseEnabled = true;
                this.oCube.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(this.oCube);
                this.update();
            };
            CoordinateCube.prototype.update = function () {
                this.colorMaterial.color = this.selected ? this.selectedColor : this.color;
            };
            return CoordinateCube;
        }(feng3d.Component));
        editor.CoordinateCube = CoordinateCube;
        var CoordinatePlane = /** @class */ (function (_super) {
            __extends(CoordinatePlane, _super);
            function CoordinatePlane() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.color = new feng3d.Color(1, 0, 0, 0.2);
                _this.borderColor = new feng3d.Color(1, 0, 0, 0.99);
                _this.selectedColor = new feng3d.Color(1, 0, 0, 0.5);
                _this.selectedborderColor = new feng3d.Color(1, 1, 0, 0.99);
                _this._width = 20;
                _this._selected = false;
                return _this;
            }
            Object.defineProperty(CoordinatePlane.prototype, "width", {
                //
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinatePlane.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinatePlane.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
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
            };
            CoordinatePlane.prototype.update = function () {
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
            };
            return CoordinatePlane;
        }(feng3d.Component));
        editor.CoordinatePlane = CoordinatePlane;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 旋转工具模型组件
         */
        var RToolModel = /** @class */ (function (_super) {
            __extends(RToolModel, _super);
            function RToolModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RToolModel.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.gameObject.name = "GameObjectRotationModel";
                this.initModels();
            };
            RToolModel.prototype.initModels = function () {
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
            };
            return RToolModel;
        }(feng3d.Component));
        editor.RToolModel = RToolModel;
        var CoordinateRotationAxis = /** @class */ (function (_super) {
            __extends(CoordinateRotationAxis, _super);
            function CoordinateRotationAxis() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0, 0.99);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6, 0.99);
                _this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                _this._selected = false;
                return _this;
            }
            Object.defineProperty(CoordinateRotationAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateRotationAxis.prototype, "filterNormal", {
                /**
                 * 过滤法线显示某一面线条
                 */
                get: function () { return this._filterNormal; },
                set: function (value) { this._filterNormal = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationAxis.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.initModels();
            };
            CoordinateRotationAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create();
                var meshRenderer = border.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorGameObject);
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
            };
            CoordinateRotationAxis.prototype.update = function () {
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
            };
            CoordinateRotationAxis.prototype.showSector = function (startPos, endPos) {
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
            };
            CoordinateRotationAxis.prototype.hideSector = function () {
                if (this.sector.gameObject.parent)
                    this.sector.gameObject.parent.removeChild(this.sector.gameObject);
            };
            return CoordinateRotationAxis;
        }(feng3d.Component));
        editor.CoordinateRotationAxis = CoordinateRotationAxis;
        /**
         * 扇形对象
         */
        var SectorGameObject = /** @class */ (function (_super) {
            __extends(SectorGameObject, _super);
            function SectorGameObject() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.borderColor = new feng3d.Color(0, 1, 1, 0.6);
                _this.radius = 80;
                _this._start = 0;
                _this._end = 0;
                return _this;
            }
            /**
             * 构建3D对象
             */
            SectorGameObject.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
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
            };
            SectorGameObject.prototype.update = function (start, end) {
                if (start === void 0) { start = 0; }
                if (end === void 0) { end = 0; }
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
            };
            return SectorGameObject;
        }(feng3d.Component));
        editor.SectorGameObject = SectorGameObject;
        var CoordinateRotationFreeAxis = /** @class */ (function (_super) {
            __extends(CoordinateRotationFreeAxis, _super);
            function CoordinateRotationFreeAxis() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.radius = 80;
                _this.color = new feng3d.Color(1, 0, 0, 0.99);
                _this.backColor = new feng3d.Color(0.6, 0.6, 0.6, 0.99);
                _this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                _this._selected = false;
                return _this;
            }
            Object.defineProperty(CoordinateRotationFreeAxis.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateRotationFreeAxis.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.initModels();
            };
            CoordinateRotationFreeAxis.prototype.initModels = function () {
                var border = feng3d.GameObject.create("border");
                var meshRenderer = border.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.color = new feng3d.Color(1, 1, 1, 0.99);
                this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                this.gameObject.addChild(border);
                this.sector = feng3d.GameObject.create("sector").addComponent(SectorGameObject);
                this.sector.update(0, 360);
                this.sector.gameObject.visible = false;
                this.sector.gameObject.mouseEnabled = true;
                this.sector.gameObject.mouselayer = feng3d.mouselayer.editor;
                this.gameObject.addChild(this.sector.gameObject);
                this.update();
            };
            CoordinateRotationFreeAxis.prototype.update = function () {
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
            };
            return CoordinateRotationFreeAxis;
        }(feng3d.Component));
        editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 缩放工具模型组件
         */
        var SToolModel = /** @class */ (function (_super) {
            __extends(SToolModel, _super);
            function SToolModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SToolModel.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.gameObject.name = "GameObjectScaleModel";
                this.initModels();
            };
            SToolModel.prototype.initModels = function () {
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
            };
            return SToolModel;
        }(feng3d.Component));
        editor.SToolModel = SToolModel;
        var CoordinateScaleCube = /** @class */ (function (_super) {
            __extends(CoordinateScaleCube, _super);
            function CoordinateScaleCube() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.color = new feng3d.Color(1, 0, 0, 0.99);
                _this.selectedColor = new feng3d.Color(1, 1, 0, 0.99);
                _this.length = 100;
                _this._selected = false;
                _this._scale = 1;
                return _this;
            }
            Object.defineProperty(CoordinateScaleCube.prototype, "selected", {
                //
                get: function () { return this._selected; },
                set: function (value) { if (this._selected == value)
                    return; this._selected = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CoordinateScaleCube.prototype, "scaleValue", {
                //
                get: function () { return this._scale; },
                set: function (value) { if (this._scale == value)
                    return; this._scale = value; this.update(); },
                enumerable: true,
                configurable: true
            });
            CoordinateScaleCube.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
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
            };
            CoordinateScaleCube.prototype.update = function () {
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
            };
            return CoordinateScaleCube;
        }(feng3d.Component));
        editor.CoordinateScaleCube = CoordinateScaleCube;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MRSToolBase = /** @class */ (function (_super) {
            __extends(MRSToolBase, _super);
            function MRSToolBase() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.ismouseDown = false;
                return _this;
            }
            MRSToolBase.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
                holdSizeComponent.holdSize = 1;
                holdSizeComponent.camera = editor.editorCamera;
                //
                this.gameObject.on("addedToScene", this.onAddedToScene, this);
                this.gameObject.on("removedFromScene", this.onRemovedFromScene, this);
            };
            MRSToolBase.prototype.onAddedToScene = function () {
                this.updateToolModel();
                this._gameobjectControllerTarget.controllerTool = this.transform;
                //
                feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
                this.gameObject.on("scenetransformChanged", this.onScenetransformChanged, this);
                editor.editorCamera.gameObject.on("scenetransformChanged", this.onCameraScenetransformChanged, this);
            };
            MRSToolBase.prototype.onRemovedFromScene = function () {
                this._gameobjectControllerTarget.controllerTool = null;
                //
                feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
                feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
                this.gameObject.off("scenetransformChanged", this.onScenetransformChanged, this);
                editor.editorCamera.gameObject.off("scenetransformChanged", this.onCameraScenetransformChanged, this);
            };
            Object.defineProperty(MRSToolBase.prototype, "toolModel", {
                get: function () {
                    return this._toolModel;
                },
                set: function (value) {
                    if (this._toolModel)
                        this.gameObject.removeChild(this._toolModel.gameObject);
                    this._toolModel = value;
                    ;
                    if (this._toolModel) {
                        this.gameObject.addChild(this._toolModel.gameObject);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MRSToolBase.prototype, "selectedItem", {
                get: function () {
                    return this._selectedItem;
                },
                set: function (value) {
                    if (this._selectedItem == value)
                        return;
                    if (this._selectedItem)
                        this._selectedItem.selected = false;
                    this._selectedItem = value;
                    if (this._selectedItem)
                        this._selectedItem.selected = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MRSToolBase.prototype, "gameobjectControllerTarget", {
                get: function () {
                    return this._gameobjectControllerTarget;
                },
                set: function (value) {
                    this._gameobjectControllerTarget = value;
                },
                enumerable: true,
                configurable: true
            });
            MRSToolBase.prototype.updateToolModel = function () {
            };
            MRSToolBase.prototype.onMouseDown = function () {
                this.selectedItem = null;
                this.ismouseDown = true;
            };
            MRSToolBase.prototype.onMouseUp = function () {
                this.ismouseDown = false;
                this.movePlane3D = null;
                this.startSceneTransform = null;
            };
            MRSToolBase.prototype.onScenetransformChanged = function () {
                this.updateToolModel();
            };
            MRSToolBase.prototype.onCameraScenetransformChanged = function () {
                this.updateToolModel();
            };
            /**
             * 获取鼠标射线与移动平面的交点（模型空间）
             */
            MRSToolBase.prototype.getLocalMousePlaneCross = function () {
                //射线与平面交点
                var crossPos = this.getMousePlaneCross();
                //把交点从世界转换为模型空间
                var inverseGlobalMatrix3D = this.startSceneTransform.clone();
                inverseGlobalMatrix3D.invert();
                crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
                return crossPos;
            };
            MRSToolBase.prototype.getMousePlaneCross = function () {
                var line3D = editor.editorCamera.getMouseRay3D();
                //射线与平面交点
                var crossPos = this.movePlane3D.lineCross(line3D);
                return crossPos;
            };
            return MRSToolBase;
        }(feng3d.Component));
        editor.MRSToolBase = MRSToolBase;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 位移工具
         */
        var MTool = /** @class */ (function (_super) {
            __extends(MTool, _super);
            function MTool() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                return _this;
            }
            MTool.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.MToolModel);
            };
            MTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            MTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            MTool.prototype.onItemMouseDown = function (event) {
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
                var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
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
                this.gameobjectControllerTarget.startTranslation();
                //
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            };
            MTool.prototype.onMouseMove = function () {
                var crossPos = this.getLocalMousePlaneCross();
                var addPos = crossPos.subtract(this.startPlanePos);
                addPos.x *= this.changeXYZ.x;
                addPos.y *= this.changeXYZ.y;
                addPos.z *= this.changeXYZ.z;
                var sceneTransform = this.startSceneTransform.clone();
                sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
                var sceneAddpos = sceneTransform.position.subtract(this.startSceneTransform.position);
                this.gameobjectControllerTarget.translation(sceneAddpos);
            };
            MTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
                this.gameobjectControllerTarget.stopTranslation();
                this.startPos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
                this.updateToolModel();
            };
            MTool.prototype.updateToolModel = function () {
                //鼠标按下时不更新
                if (this.ismouseDown)
                    return;
                var cameraPos = editor.editorCamera.transform.scenePosition;
                var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
                this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
                this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
            };
            return MTool;
        }(editor.MRSToolBase));
        editor.MTool = MTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var RTool = /** @class */ (function (_super) {
            __extends(RTool, _super);
            function RTool() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RTool.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.RToolModel);
            };
            RTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            RTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            RTool.prototype.onItemMouseDown = function (event) {
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
                var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
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
                this.gameobjectControllerTarget.startRotate();
                //
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            };
            RTool.prototype.onMouseMove = function () {
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
                        this.gameobjectControllerTarget.rotate1(angle, this.movePlane3D.normal);
                        this.stepPlaneCross.copyFrom(planeCross);
                        this.gameobjectControllerTarget.startRotate();
                        //绘制扇形区域
                        if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                            this.selectedItem.showSector(this.startPlanePos, planeCross);
                        }
                        break;
                    case this.toolModel.freeAxis:
                        var endPoint = editor.engine.mousePos.clone();
                        var offset = endPoint.subtract(this.startMousePos);
                        var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
                        var right = cameraSceneTransform.right;
                        var up = cameraSceneTransform.up;
                        this.gameobjectControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                        //
                        this.startMousePos = endPoint;
                        this.gameobjectControllerTarget.startRotate();
                        break;
                }
            };
            RTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
                if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                    this.selectedItem.hideSector();
                }
                this.gameobjectControllerTarget.stopRote();
                this.startMousePos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
            };
            RTool.prototype.updateToolModel = function () {
                var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix.clone();
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
            };
            return RTool;
        }(editor.MRSToolBase));
        editor.RTool = RTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var STool = /** @class */ (function (_super) {
            __extends(STool, _super);
            function STool() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                return _this;
            }
            STool.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.toolModel = feng3d.GameObject.create().addComponent(editor.SToolModel);
            };
            STool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            STool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            STool.prototype.onItemMouseDown = function (event) {
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
                var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
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
                this.gameobjectControllerTarget.startScale();
                //
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            };
            STool.prototype.onMouseMove = function () {
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
                this.gameobjectControllerTarget.doScale(addScale);
                //
                this.toolModel.xCube.scaleValue = addScale.x;
                this.toolModel.yCube.scaleValue = addScale.y;
                this.toolModel.zCube.scaleValue = addScale.z;
            };
            STool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
                this.gameobjectControllerTarget.stopScale();
                this.startPlanePos = null;
                this.startSceneTransform = null;
                //
                this.toolModel.xCube.scaleValue = 1;
                this.toolModel.yCube.scaleValue = 1;
                this.toolModel.zCube.scaleValue = 1;
            };
            return STool;
        }(editor.MRSToolBase));
        editor.STool = STool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 游戏对象控制器类型
         */
        var MRSToolType;
        (function (MRSToolType) {
            /**
             * 移动
             */
            MRSToolType[MRSToolType["MOVE"] = 0] = "MOVE";
            /**
             * 旋转
             */
            MRSToolType[MRSToolType["ROTATION"] = 1] = "ROTATION";
            /**
             * 缩放
             */
            MRSToolType[MRSToolType["SCALE"] = 2] = "SCALE";
        })(MRSToolType = editor.MRSToolType || (editor.MRSToolType = {}));
        /**
         * 控制器数据
         */
        var MRSToolData = /** @class */ (function () {
            function MRSToolData() {
                /**
                 * 使用的控制工具类型
                 */
                this.toolType = MRSToolType.MOVE;
                /**
                 * 是否使用世界坐标
                 */
                this.isWoldCoordinate = false;
                /**
                 * 坐标原点是否在质心
                 */
                this.isBaryCenter = true;
            }
            return MRSToolData;
        }());
        editor.MRSToolData = MRSToolData;
        /**
         * 控制器数据
         */
        editor.mrsTool = new MRSToolData();
        /**
         * 设置永久可见
         */
        function setAwaysVisible(component) {
            var meshRenderers = component.getComponentsInChildren(feng3d.MeshRenderer);
            meshRenderers.forEach(function (element) {
                if (element.material) {
                    // element.material.depthMask = false;
                    element.material.depthtest = false;
                }
            });
        }
        /**
         * 位移旋转缩放工具
         */
        var MRSTool = /** @class */ (function (_super) {
            __extends(MRSTool, _super);
            function MRSTool() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MRSTool.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                var mrsToolObject = feng3d.GameObject.create("MRSTool");
                mrsToolObject.serializable = false;
                mrsToolObject.showinHierarchy = false;
                this.mrsToolObject = editor.editorData.mrsToolObject = mrsToolObject;
                this.controllerTarget = new editor.MRSToolTarget();
                this.mTool = feng3d.GameObject.create("MTool").addComponent(editor.MTool);
                this.rTool = feng3d.GameObject.create("RTool").addComponent(editor.RTool);
                this.sTool = feng3d.GameObject.create("STool").addComponent(editor.STool);
                setAwaysVisible(this.mTool);
                setAwaysVisible(this.rTool);
                setAwaysVisible(this.sTool);
                this.mTool.gameobjectControllerTarget = this.controllerTarget;
                this.rTool.gameobjectControllerTarget = this.controllerTarget;
                this.sTool.gameobjectControllerTarget = this.controllerTarget;
                //
                this.currentTool = this.mTool;
                //
                feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
                feng3d.watcher.watch(editor.mrsTool, "toolType", this.onToolTypeChange, this);
            };
            MRSTool.prototype.dispose = function () {
                //
                this.currentTool = null;
                //
                this.mrsToolObject.dispose();
                this.mrsToolObject = null;
                editor.editorData.mrsToolObject = null;
                //
                this.controllerTarget = null;
                this.mTool.dispose();
                this.mTool = null;
                this.rTool.dispose();
                this.rTool = null;
                this.sTool.dispose();
                this.sTool = null;
                //
                feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
                feng3d.watcher.unwatch(editor.mrsTool, "toolType", this.onToolTypeChange, this);
                _super.prototype.dispose.call(this);
            };
            MRSTool.prototype.onSelectedGameObjectChange = function () {
                //筛选出 工具控制的对象
                var transforms = editor.editorData.mrsTransforms;
                if (transforms.length > 0) {
                    this.controllerTarget.controllerTargets = transforms;
                    this.gameObject.addChild(this.mrsToolObject);
                }
                else {
                    this.controllerTarget.controllerTargets = null;
                    this.mrsToolObject.remove();
                }
            };
            MRSTool.prototype.onToolTypeChange = function () {
                switch (editor.mrsTool.toolType) {
                    case MRSToolType.MOVE:
                        this.currentTool = this.mTool;
                        break;
                    case MRSToolType.ROTATION:
                        this.currentTool = this.rTool;
                        break;
                    case MRSToolType.SCALE:
                        this.currentTool = this.sTool;
                        break;
                }
            };
            Object.defineProperty(MRSTool.prototype, "currentTool", {
                set: function (value) {
                    if (this._currentTool == value)
                        return;
                    if (this._currentTool) {
                        this.mrsToolObject.removeChild(this._currentTool.gameObject);
                    }
                    this._currentTool = value;
                    if (this._currentTool) {
                        this.mrsToolObject.addChild(this._currentTool.gameObject);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return MRSTool;
        }(feng3d.Component));
        editor.MRSTool = MRSTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var HierarchyNode = /** @class */ (function (_super) {
            __extends(HierarchyNode, _super);
            function HierarchyNode(obj) {
                var _this = _super.call(this, obj) || this;
                _this.isOpen = false;
                /**
                 * 子节点列表
                 */
                _this.children = [];
                feng3d.watcher.watch(editor.editorData, "selectedObjects", _this.onSelectedGameObjectChanged, _this);
                feng3d.watcher.watch(_this.gameobject, "name", _this.update, _this);
                _this.update();
                return _this;
            }
            /**
             * 销毁
             */
            HierarchyNode.prototype.destroy = function () {
                feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onSelectedGameObjectChanged, this);
                feng3d.watcher.unwatch(this.gameobject, "name", this.update, this);
                this.gameobject = null;
                _super.prototype.destroy.call(this);
            };
            HierarchyNode.prototype.update = function () {
                this.label = this.gameobject.name;
            };
            HierarchyNode.prototype.onSelectedGameObjectChanged = function () {
                var selectedGameObjects = editor.editorData.selectedGameObjects;
                var isselected = selectedGameObjects.indexOf(this.gameobject) != -1;
                if (this.selected != isselected) {
                    this.selected = isselected;
                    if (this.selected) {
                        //新增选中效果
                        var wireframeComponent = this.gameobject.getComponent(feng3d.WireframeComponent);
                        if (!wireframeComponent)
                            this.gameobject.addComponent(feng3d.WireframeComponent);
                    }
                    else {
                        //清除选中效果
                        var wireframeComponent = this.gameobject.getComponent(feng3d.WireframeComponent);
                        if (wireframeComponent)
                            this.gameobject.removeComponent(wireframeComponent);
                    }
                }
            };
            return HierarchyNode;
        }(editor.TreeNode));
        editor.HierarchyNode = HierarchyNode;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var nodeMap = new Map();
        var HierarchyTree = /** @class */ (function (_super) {
            __extends(HierarchyTree, _super);
            function HierarchyTree() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * 获取选中节点
             */
            HierarchyTree.prototype.getSelectedNode = function () {
                for (var i = 0; i < editor.editorData.selectedGameObjects.length; i++) {
                    var node = this.getNode(editor.editorData.selectedGameObjects[i]);
                    if (node)
                        return node;
                }
                return null;
            };
            HierarchyTree.prototype.init = function (gameobject) {
                var _this = this;
                if (this.rootnode)
                    this.rootnode.destroy();
                nodeMap.clear();
                var node = new editor.HierarchyNode({ gameobject: gameobject });
                nodeMap.set(gameobject, node);
                node.isOpen = true;
                this.rootnode = node;
                gameobject.children.forEach(function (element) {
                    _this.add(element);
                });
            };
            HierarchyTree.prototype.delete = function (gameobject) {
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.destroy(node);
                    nodeMap.delete(gameobject);
                }
            };
            HierarchyTree.prototype.add = function (gameobject) {
                var _this = this;
                if (!gameobject.showinHierarchy)
                    return;
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.removeNode(node);
                }
                var parentnode = nodeMap.get(gameobject.parent);
                if (parentnode) {
                    if (!node) {
                        node = new editor.HierarchyNode({ gameobject: gameobject });
                        nodeMap.set(gameobject, node);
                    }
                    this.addNode(node, parentnode);
                }
                gameobject.children.forEach(function (element) {
                    _this.add(element);
                });
                return node;
            };
            HierarchyTree.prototype.remove = function (gameobject) {
                var _this = this;
                var node = nodeMap.get(gameobject);
                if (node) {
                    this.removeNode(node);
                }
                gameobject.children.forEach(function (element) {
                    _this.remove(element);
                });
            };
            /**
             * 获取节点
             */
            HierarchyTree.prototype.getNode = function (gameObject) {
                var node = nodeMap.get(gameObject);
                return node;
            };
            return HierarchyTree;
        }(editor.Tree));
        editor.HierarchyTree = HierarchyTree;
        editor.hierarchyTree = new HierarchyTree();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Hierarchy = /** @class */ (function () {
            function Hierarchy() {
            }
            Object.defineProperty(Hierarchy.prototype, "rootGameObject", {
                get: function () {
                    return this._rootGameObject;
                },
                set: function (value) {
                    if (this._rootGameObject) {
                        this._rootGameObject.off("added", this.ongameobjectadded, this);
                        this._rootGameObject.off("removed", this.ongameobjectremoved, this);
                    }
                    this._rootGameObject = value;
                    if (this._rootGameObject) {
                        editor.hierarchyTree.init(this._rootGameObject);
                        this._rootGameObject.on("added", this.ongameobjectadded, this);
                        this._rootGameObject.on("removed", this.ongameobjectremoved, this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Hierarchy.prototype.ongameobjectadded = function (event) {
                editor.hierarchyTree.add(event.data);
            };
            Hierarchy.prototype.ongameobjectremoved = function (event) {
                editor.hierarchyTree.remove(event.data);
            };
            Hierarchy.prototype.addGameoObjectFromAsset = function (path, parent) {
                editor.fs.readFileAsString(path, function (err, content) {
                    var json = JSON.parse(content);
                    var gameobject = feng3d.serialization.deserialize(json);
                    gameobject.name = path.split("/").pop().split(".").shift();
                    if (parent)
                        parent.addChild(gameobject);
                    else
                        editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
                    editor.editorData.selectObject(gameobject);
                });
            };
            return Hierarchy;
        }());
        editor.Hierarchy = Hierarchy;
        editor.hierarchy = new Hierarchy();
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var SceneRotateTool = /** @class */ (function (_super) {
            __extends(SceneRotateTool, _super);
            function SceneRotateTool() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.showInInspector = false;
                _this.serializable = false;
                return _this;
            }
            SceneRotateTool.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                var thisObj = this;
                var _a = initModel(), rotationToolModel = _a.rotationToolModel, arrowsX = _a.arrowsX, arrowsY = _a.arrowsY, arrowsZ = _a.arrowsZ, arrowsNX = _a.arrowsNX, arrowsNY = _a.arrowsNY, arrowsNZ = _a.arrowsNZ, planeX = _a.planeX, planeY = _a.planeY, planeZ = _a.planeZ, planeNX = _a.planeNX, planeNY = _a.planeNY, planeNZ = _a.planeNZ;
                var _b = newEngine(), toolEngine = _b.toolEngine, canvas = _b.canvas;
                toolEngine.root.addChild(rotationToolModel);
                rotationToolModel.transform.sx = 0.01;
                rotationToolModel.transform.sy = 0.01;
                rotationToolModel.transform.sz = 0.01;
                rotationToolModel.transform.z = 0.80;
                var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
                arr.forEach(function (element) {
                    element.on("click", onclick);
                });
                var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];
                feng3d.ticker.onframe(function () {
                    var rect = editor.engine.canvas.getBoundingClientRect();
                    canvas.style.top = rect.top + "px";
                    canvas.style.left = (rect.left + rect.width - canvas.width) + "px";
                    var rotation = editor.editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scaleBy(180 / Math.PI);
                    rotationToolModel.transform.rotation = rotation;
                    //隐藏角度
                    var visibleAngle = Math.cos(15 * Math.DEG2RAD);
                    //隐藏正面箭头
                    arrowsArr.forEach(function (element) {
                        if (Math.abs(element.transform.localToWorldMatrix.up.dotProduct(feng3d.Vector3D.Z_AXIS)) < visibleAngle)
                            element.visible = true;
                        else
                            element.visible = false;
                    });
                    //
                    var canvasRect = canvas.getBoundingClientRect();
                    var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                    if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                        feng3d.shortcut.activityState("mouseInSceneRotateTool");
                    }
                    else {
                        feng3d.shortcut.deactivityState("mouseInSceneRotateTool");
                    }
                });
                feng3d.windowEventProxy.on("mouseup", function (e) {
                    var canvasRect = canvas.getBoundingClientRect();
                    var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                    if (!bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                        return;
                    //右键点击菜单
                    if (e.button == 2) {
                        editor.menu.popup([
                            {
                                label: "左视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsX, data: null });
                                }
                            },
                            {
                                label: "右视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsNX, data: null });
                                }
                            },
                            {
                                label: "顶视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsY, data: null });
                                }
                            },
                            {
                                label: "底视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsNY, data: null });
                                }
                            },
                            {
                                label: "前视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsZ, data: null });
                                }
                            },
                            {
                                label: "后视图", click: function () {
                                    onclick({ type: "click", currentTarget: arrowsNZ, data: null });
                                }
                            },
                        ]);
                    }
                });
                function initModel() {
                    var rotationToolModel = feng3d.rawData.create(rotateToolModelJson);
                    var arrowsX = rotationToolModel.find("arrowsX");
                    var arrowsY = rotationToolModel.find("arrowsY");
                    var arrowsZ = rotationToolModel.find("arrowsZ");
                    var arrowsNX = rotationToolModel.find("arrowsNX");
                    var arrowsNY = rotationToolModel.find("arrowsNY");
                    var arrowsNZ = rotationToolModel.find("arrowsNZ");
                    var planeX = rotationToolModel.find("planeX");
                    var planeY = rotationToolModel.find("planeY");
                    var planeZ = rotationToolModel.find("planeZ");
                    var planeNX = rotationToolModel.find("planeNX");
                    var planeNY = rotationToolModel.find("planeNY");
                    var planeNZ = rotationToolModel.find("planeNZ");
                    return { rotationToolModel: rotationToolModel, arrowsX: arrowsX, arrowsY: arrowsY, arrowsZ: arrowsZ, arrowsNX: arrowsNX, arrowsNY: arrowsNY, arrowsNZ: arrowsNZ, planeX: planeX, planeY: planeY, planeZ: planeZ, planeNX: planeNX, planeNY: planeNY, planeNZ: planeNZ };
                }
                function newEngine() {
                    var canvas = document.getElementById("sceneRotateToolCanvas");
                    ;
                    // can
                    canvas.width = 80;
                    canvas.height = 80;
                    var toolEngine = new feng3d.Engine(canvas);
                    toolEngine.scene.background.a = 0.0;
                    toolEngine.root.addChild(feng3d.GameObjectFactory.createPointLight());
                    return { toolEngine: toolEngine, canvas: canvas };
                }
                function onclick(e) {
                    var front_view = new feng3d.Vector3D(0, 0, 0); //前视图
                    var back_view = new feng3d.Vector3D(0, 180, 0); //后视图
                    var right_view = new feng3d.Vector3D(0, -90, 0); //右视图
                    var left_view = new feng3d.Vector3D(0, 90, 0); //左视图
                    var top_view = new feng3d.Vector3D(-90, 0, 180); //顶视图
                    var bottom_view = new feng3d.Vector3D(-90, 180, 0); //底视图
                    var rotation;
                    switch (e.currentTarget) {
                        case arrowsX:
                            rotation = left_view;
                            break;
                        case arrowsNX:
                            rotation = right_view;
                            break;
                        case arrowsY:
                            rotation = top_view;
                            break;
                        case arrowsNY:
                            rotation = bottom_view;
                            break;
                        case arrowsZ:
                            rotation = back_view;
                            break;
                        case arrowsNZ:
                            rotation = front_view;
                            break;
                    }
                    if (rotation) {
                        var cameraTargetMatrix3D = feng3d.Matrix3D.fromRotation(rotation);
                        cameraTargetMatrix3D.invert();
                        var result = cameraTargetMatrix3D.decompose()[1];
                        result.scaleBy(180 / Math.PI);
                        editor.editorDispatcher.dispatch("editorCameraRotate", result);
                    }
                }
            };
            return SceneRotateTool;
        }(feng3d.Component));
        editor.SceneRotateTool = SceneRotateTool;
        /**
         * 旋转工具模型，该模型由editor生成 RotationToolModel.gameobject
         */
        var rotateToolModelJson = {
            "__class__": "feng3d.GameObject",
            "children": [
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        null,
                        null,
                        {
                            "__class__": "feng3d.Transform",
                            "rz": 90,
                            "x": 19
                        },
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color",
                                        "b": 0,
                                        "g": 0
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsX"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rz": -90,
                            "x": -19
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsNX"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rz": 180,
                            "y": 19
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color",
                                        "b": 0,
                                        "r": 0
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsY"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "y": -19
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsNY"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rx": -90,
                            "z": 19
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color",
                                        "g": 0,
                                        "r": 0
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsZ"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rx": 90,
                            "z": -19
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.ConeGeometry",
                                "bottomClosed": true,
                                "bottomRadius": 7,
                                "height": 21,
                                "segmentsH": 1,
                                "segmentsW": 16,
                                "surfaceClosed": true,
                                "topClosed": false,
                                "topRadius": 0,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "arrowsNZ"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rz": -90,
                            "x": 7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeX"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rz": 90,
                            "x": -7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeNX"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "y": 7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeY"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rz": 180,
                            "y": -7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeNY"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rx": 90,
                            "z": 7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeZ"
                },
                {
                    "__class__": "feng3d.GameObject",
                    "children": [],
                    "components": [
                        {
                            "__class__": "feng3d.Transform",
                            "rx": -90,
                            "z": -7
                        },
                        null,
                        null,
                        {
                            "__class__": "feng3d.MeshRenderer",
                            "geometry": {
                                "__class__": "feng3d.PlaneGeometry",
                                "height": 14,
                                "segmentsH": 1,
                                "segmentsW": 1,
                                "width": 14,
                                "yUp": true
                            },
                            "material": {
                                "__class__": "feng3d.StandardMaterial",
                                "ambientMethod": {
                                    "__class__": "feng3d.AmbientMethod",
                                    "ambientTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    },
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    }
                                },
                                "diffuseMethod": {
                                    "__class__": "feng3d.DiffuseMethod",
                                    "color": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "difuseTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "normalMethod": {
                                    "__class__": "feng3d.NormalMethod",
                                    "normalTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                },
                                "specularMethod": {
                                    "__class__": "feng3d.SpecularMethod",
                                    "specularColor": {
                                        "__class__": "feng3d.Color"
                                    },
                                    "specularTexture": {
                                        "__class__": "feng3d.Texture2D"
                                    }
                                }
                            }
                        }
                    ],
                    "name": "planeNZ"
                }
            ],
            "components": [
                null,
                null,
                {
                    "__class__": "feng3d.Transform"
                },
                null
            ],
            "name": "RotationToolModel"
        };
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
        var GroundGrid = /** @class */ (function (_super) {
            __extends(GroundGrid, _super);
            function GroundGrid() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.num = 100;
                return _this;
            }
            GroundGrid.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                var groundGridObject = feng3d.GameObject.create("GroundGrid");
                groundGridObject.mouseEnabled = false;
                groundGridObject.transform.showInInspector = false;
                gameObject.addChild(groundGridObject);
                var __this = this;
                editor.editorCamera.transform.on("transformChanged", update, this);
                var meshRenderer = groundGridObject.addComponent(feng3d.MeshRenderer);
                var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                material.enableBlend = true;
                update();
                function update() {
                    var cameraGlobalPosition = editor.editorCamera.transform.scenePosition;
                    var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                    var step = Math.pow(10, level - 1);
                    var startX = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
                    var startZ = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;
                    //设置在原点
                    startX = startZ = 0;
                    step = 1;
                    var halfNum = __this.num / 2;
                    var xcolor = new feng3d.Color(1, 0, 0, 0.5);
                    var zcolor = new feng3d.Color(0, 0, 1, 0.5);
                    var color;
                    segmentGeometry.removeAllSegments();
                    for (var i = -halfNum; i <= halfNum; i++) {
                        var color0 = new feng3d.Color().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                        color0.a = ((i % 10) == 0) ? 0.5 : 0.1;
                        color = (i * step + startZ == 0) ? xcolor : color0;
                        segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(-halfNum * step + startX, 0, i * step + startZ), new feng3d.Vector3D(halfNum * step + startX, 0, i * step + startZ), color, color));
                        color = (i * step + startX == 0) ? zcolor : color0;
                        segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(i * step + startX, 0, -halfNum * step + startZ), new feng3d.Vector3D(i * step + startX, 0, halfNum * step + startZ), color, color));
                    }
                }
            };
            __decorate([
                feng3d.oav()
            ], GroundGrid.prototype, "num", void 0);
            return GroundGrid;
        }(feng3d.Component));
        editor.GroundGrid = GroundGrid;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var editorObject;
        var EditorEngine = /** @class */ (function (_super) {
            __extends(EditorEngine, _super);
            function EditorEngine() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(EditorEngine.prototype, "scene", {
                get: function () {
                    return this._scene;
                },
                set: function (value) {
                    if (this._scene) {
                        this._scene.iseditor = false;
                        this._scene.gameObject.removeChild(editorObject);
                        this._scene.updateScriptFlag = feng3d.ScriptFlag.feng3d;
                    }
                    this._scene = value;
                    if (this._scene) {
                        this._scene.iseditor = true;
                        this._scene.gameObject.addChild(editorObject);
                        this._scene.updateScriptFlag = feng3d.ScriptFlag.feng3d | feng3d.ScriptFlag.editor;
                        editor.hierarchy.rootGameObject = this._scene.gameObject;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return EditorEngine;
        }(feng3d.Engine));
        editor.EditorEngine = EditorEngine;
        /**
        * 编辑器3D入口
        * @author feng 2016-10-29
        */
        var Main3D = /** @class */ (function () {
            function Main3D() {
                this.init();
            }
            Main3D.prototype.init = function () {
                //
                editor.editorCamera = feng3d.GameObject.create("editorCamera").addComponent(feng3d.Camera);
                editor.editorCamera.transform.x = 5;
                editor.editorCamera.transform.y = 3;
                editor.editorCamera.transform.z = 5;
                editor.editorCamera.transform.lookAt(new feng3d.Vector3D());
                //
                editor.editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
                //
                editorObject = feng3d.GameObject.create("editorObject");
                editorObject.flag = feng3d.GameObjectFlag.editor;
                editorObject.serializable = false;
                editorObject.showinHierarchy = false;
                editorObject.addComponent(editor.SceneRotateTool);
                //
                editorObject.addComponent(feng3d.Trident);
                //初始化模块
                editorObject.addComponent(editor.GroundGrid);
                editorObject.addComponent(editor.MRSTool);
                editorObject.addComponent(editor.EditorComponent);
                //
                editor.editorDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
                //
                var scene = newScene();
                //
                var canvas = document.getElementById("glcanvas");
                editor.engine = new EditorEngine(canvas, scene, editor.editorCamera);
                editor.engine.renderObjectflag = feng3d.GameObjectFlag.feng3d | feng3d.GameObjectFlag.editor;
                editor.editorAssets.readScene("default.scene", function (err, scene) {
                    editor.engine.scene = scene;
                });
                window.addEventListener("beforeunload", function () {
                    editor.editorAssets.saveScene("default.scene", editor.engine.scene);
                });
                // var cubeTexture = new TextureCube([
                //     'resource/3d/skybox/px.jpg',
                //     'resource/3d/skybox/py.jpg',
                //     'resource/3d/skybox/pz.jpg',
                //     'resource/3d/skybox/nx.jpg',
                //     'resource/3d/skybox/ny.jpg',
                //     'resource/3d/skybox/nz.jpg',
                // ]);
                // var skyBoxComponent = scene.gameObject.addComponent(SkyBox);
                // skyBoxComponent.texture = cubeTexture;
            };
            Main3D.prototype.onEditorCameraRotate = function (e) {
                var resultRotation = e.data;
                var camera = editor.editorCamera;
                var forward = camera.transform.forwardVector;
                var lookDistance;
                if (editor.editorData.selectedGameObjects.length > 0) {
                    //计算观察距离
                    var selectedObj = editor.editorData.selectedGameObjects[0];
                    var lookray = selectedObj.transform.scenePosition.subtract(camera.transform.scenePosition);
                    lookDistance = Math.max(0, forward.dotProduct(lookray));
                }
                else {
                    lookDistance = editor.sceneControlConfig.lookDistance;
                }
                //旋转中心
                var rotateCenter = camera.transform.scenePosition.add(forward.scaleBy(lookDistance));
                //计算目标四元素旋转
                var targetQuat = new feng3d.Quaternion();
                resultRotation.scaleBy(Math.DEG2RAD);
                targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
                //
                var sourceQuat = new feng3d.Quaternion();
                sourceQuat.fromEulerAngles(camera.transform.rx * Math.DEG2RAD, camera.transform.ry * Math.DEG2RAD, camera.transform.rz * Math.DEG2RAD);
                var rate = { rate: 0.0 };
                egret.Tween.get(rate, {
                    onChange: function () {
                        var cameraQuat = new feng3d.Quaternion();
                        cameraQuat.slerp(sourceQuat, targetQuat, rate.rate);
                        camera.transform.orientation = cameraQuat;
                        //
                        var translation = camera.transform.forwardVector;
                        translation.negate();
                        translation.scaleBy(lookDistance);
                        camera.transform.position = rotateCenter.add(translation);
                    },
                }).to({ rate: 1 }, 300, egret.Ease.sineIn);
            };
            return Main3D;
        }());
        editor.Main3D = Main3D;
        function newScene() {
            var scene = feng3d.GameObject.create("Untitled").addComponent(feng3d.Scene3D);
            scene.background = new feng3d.Color(0.4, 0.4, 0.4, 1.0);
            var camera = feng3d.GameObjectFactory.createCamera("Main Camera");
            scene.gameObject.addChild(camera);
            var directionalLight = feng3d.GameObject.create("DirectionalLight");
            directionalLight.addComponent(feng3d.DirectionalLight);
            directionalLight.transform.rx = 120;
            scene.gameObject.addChild(directionalLight);
            return scene;
        }
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var EditorComponent = /** @class */ (function (_super) {
            __extends(EditorComponent, _super);
            function EditorComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.serializable = false;
                _this.showInInspector = false;
                return _this;
            }
            EditorComponent.prototype.init = function (gameobject) {
                _super.prototype.init.call(this, gameobject);
                this.gameObject.on("addedToScene", this.onAddedToScene, this);
                this.gameObject.on("removedFromScene", this.onRemovedFromScene, this);
            };
            /**
             * 销毁
             */
            EditorComponent.prototype.dispose = function () {
                this.gameObject.off("addedToScene", this.onAddedToScene, this);
                this.gameObject.off("removedFromScene", this.onRemovedFromScene, this);
                this.onRemovedFromScene();
                _super.prototype.dispose.call(this);
            };
            EditorComponent.prototype.onAddedToScene = function () {
                var _this = this;
                this.scene = this.gameObject.scene;
                var lights = this.scene.getComponentsInChildren(feng3d.Light);
                lights.forEach(function (element) {
                    _this.addLightIcon(element);
                });
                this.scene.on("addComponentToScene", this.onAddComponentToScene, this);
                this.scene.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
            };
            EditorComponent.prototype.onRemovedFromScene = function () {
                var _this = this;
                if (!this.scene)
                    return;
                this.scene.off("addComponentToScene", this.onAddComponentToScene, this);
                this.scene.off("removeComponentFromScene", this.onRemoveComponentFromScene, this);
                var lights = this.scene.getComponentsInChildren(feng3d.Light);
                lights.forEach(function (element) {
                    _this.removeLightIcon(element);
                });
                this.scene = null;
            };
            EditorComponent.prototype.onAddComponentToScene = function (event) {
                this.addLightIcon(event.data);
            };
            EditorComponent.prototype.onRemoveComponentFromScene = function (event) {
                this.removeLightIcon(event.data);
            };
            EditorComponent.prototype.addLightIcon = function (light) {
                if (light instanceof feng3d.DirectionalLight) {
                    light.gameObject.addComponent(editor.DirectionLightIcon);
                }
                else if (light instanceof feng3d.PointLight) {
                    light.gameObject.addComponent(editor.PointLightIcon);
                }
            };
            EditorComponent.prototype.removeLightIcon = function (light) {
                if (light instanceof feng3d.DirectionalLight) {
                    light.gameObject.removeComponentsByType(editor.DirectionLightIcon);
                }
                else if (light instanceof feng3d.PointLight) {
                    light.gameObject.removeComponentsByType(editor.PointLightIcon);
                }
            };
            return EditorComponent;
        }(feng3d.Component));
        editor.EditorComponent = EditorComponent;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var EditorEnvironment = /** @class */ (function () {
            function EditorEnvironment() {
                this.init();
            }
            EditorEnvironment.prototype.init = function () {
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
            };
            return EditorEnvironment;
        }());
        editor.EditorEnvironment = EditorEnvironment;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var egret;
(function (egret) {
    egret.MouseEvent = egret.TouchEvent;
    //映射事件名称
    egret.MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
    egret.MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
    egret.MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
    egret.MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
    egret.MouseEvent.MOUSE_OUT = "mouseout";
    egret.MouseEvent.RIGHT_CLICK = "rightclick";
    egret.MouseEvent.DOUBLE_CLICK = "dblclick";
    //
    //解决TextInput.text绑定Number是不显示0的bug
    var p = egret.DisplayObject.prototype;
    var old = p.dispatchEvent;
    p.dispatchEvent = function (event) {
        if (event.type == egret.MouseEvent.MOUSE_OVER) {
            //鼠标已经在对象上时停止over冒泡
            if (this.isMouseOver) {
                event.stopPropagation();
                return true;
            }
            this.isMouseOver = true;
        }
        if (event.type == egret.MouseEvent.MOUSE_OUT) {
            //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
            var overDisplayObject = egret.mouseEventEnvironment.overDisplayObject;
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
})(egret || (egret = {}));
var egret;
(function (egret) {
    var MouseEventEnvironment = /** @class */ (function () {
        function MouseEventEnvironment() {
            var _this = this;
            this.webTouchHandler = this.getWebTouchHandler();
            this.canvas = this.webTouchHandler.canvas;
            this.touch = this.webTouchHandler.touch;
            this.webTouchHandler.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
            feng3d.windowEventProxy.on("mousedown", function (e) {
                //右键按下
                if (e.button != 2)
                    return;
                var location = _this.webTouchHandler.getLocation(e);
                var x = location.x;
                var y = location.y;
                _this.rightmousedownObject = _this.touch["findTarget"](x, y);
            });
            feng3d.windowEventProxy.on("mouseup", function (e) {
                //右键按下
                if (e.button != 2)
                    return;
                var location = _this.webTouchHandler.getLocation(e);
                var x = location.x;
                var y = location.y;
                var target = _this.touch["findTarget"](x, y);
                if (target == _this.rightmousedownObject) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
                    _this.rightmousedownObject = null;
                }
            });
            feng3d.windowEventProxy.on("dblclick", function (e) {
                var location = _this.webTouchHandler.getLocation(e);
                var x = location.x;
                var y = location.y;
                var target = _this.touch["findTarget"](x, y);
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.DOUBLE_CLICK, true, true, x, y);
            });
        }
        MouseEventEnvironment.prototype.onMouseMove = function (event) {
            var location = this.webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;
            var target = this.touch["findTarget"](x, y);
            if (target == this.overDisplayObject)
                return;
            var preOverDisplayObject = this.overDisplayObject;
            this.overDisplayObject = target;
            if (preOverDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, egret.MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (this.overDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(this.overDisplayObject, egret.MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        };
        MouseEventEnvironment.prototype.getWebTouchHandler = function () {
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
        };
        return MouseEventEnvironment;
    }());
    egret.MouseEventEnvironment = MouseEventEnvironment;
})(egret || (egret = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        /**
         * 编辑器脚本
         */
        var EditorScript = /** @class */ (function (_super) {
            __extends(EditorScript, _super);
            function EditorScript() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.showInInspector = false;
                _this.serializable = false;
                _this.flag = feng3d.ScriptFlag.editor;
                return _this;
            }
            return EditorScript;
        }(feng3d.Script));
        editor.EditorScript = EditorScript;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var MouseRayTestScript = /** @class */ (function (_super) {
            __extends(MouseRayTestScript, _super);
            function MouseRayTestScript() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MouseRayTestScript.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                feng3d.windowEventProxy.on("click", this.onclick, this);
            };
            MouseRayTestScript.prototype.onclick = function () {
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
                var translate = function () {
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
            };
            MouseRayTestScript.prototype.update = function () {
            };
            /**
             * 销毁
             */
            MouseRayTestScript.prototype.dispose = function () {
                feng3d.windowEventProxy.off("click", this.onclick, this);
            };
            return MouseRayTestScript;
        }(editor.EditorScript));
        editor.MouseRayTestScript = MouseRayTestScript;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var DirectionLightIcon = /** @class */ (function (_super) {
            __extends(DirectionLightIcon, _super);
            function DirectionLightIcon() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            DirectionLightIcon.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.initicon();
            };
            DirectionLightIcon.prototype.initicon = function () {
                var size = 1;
                var linesize = 10;
                this.directionalLight = this.getComponent(feng3d.DirectionalLight);
                var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
                lightIcon.serializable = false;
                lightIcon.showinHierarchy = false;
                var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
                billboardComponent.camera = editor.editorCamera;
                var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.PlaneGeometry(size, size, 1, 1, false);
                var textureMaterial = this.textureMaterial = meshRenderer.material = new feng3d.TextureMaterial();
                textureMaterial.texture = new feng3d.Texture2D("resource/assets/3d/icons/sun.png");
                textureMaterial.texture.format = feng3d.TextureFormat.RGBA;
                textureMaterial.texture.premulAlpha = true;
                textureMaterial.enableBlend = true;
                this.gameObject.addChild(lightIcon);
                //
                var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
                lightLines.mouseEnabled = false;
                lightLines.serializable = false;
                lightLines.showinHierarchy = false;
                var holdSizeComponent = lightLines.addComponent(feng3d.HoldSizeComponent);
                holdSizeComponent.camera = editor.editorCamera;
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
            };
            DirectionLightIcon.prototype.update = function () {
                this.textureMaterial.color = this.directionalLight.color;
                this.lightLines.visible = editor.editorData.selectedGameObjects.indexOf(this.gameObject) != -1;
            };
            DirectionLightIcon.prototype.dispose = function () {
                this.enabled = false;
                this.textureMaterial = null;
                this.directionalLight = null;
                //
                this.lightIcon.dispose();
                this.lightLines.dispose();
                this.lightIcon = null;
                this.lightLines = null;
                _super.prototype.dispose.call(this);
            };
            return DirectionLightIcon;
        }(editor.EditorScript));
        editor.DirectionLightIcon = DirectionLightIcon;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var PointLightIcon = /** @class */ (function (_super) {
            __extends(PointLightIcon, _super);
            function PointLightIcon() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.showInInspector = false;
                _this.serializable = false;
                return _this;
            }
            PointLightIcon.prototype.init = function (gameObject) {
                _super.prototype.init.call(this, gameObject);
                this.initicon();
            };
            PointLightIcon.prototype.initicon = function () {
                var size = 1;
                this.pointLight = this.getComponent(feng3d.PointLight);
                var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
                lightIcon.serializable = false;
                lightIcon.showinHierarchy = false;
                var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
                billboardComponent.camera = editor.editorCamera;
                var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
                meshRenderer.geometry = new feng3d.PlaneGeometry(size, size, 1, 1, false);
                var textureMaterial = this.textureMaterial = meshRenderer.material = new feng3d.TextureMaterial();
                textureMaterial.texture = new feng3d.Texture2D("resource/assets/3d/icons/light.png");
                textureMaterial.texture.format = feng3d.TextureFormat.RGBA;
                textureMaterial.texture.premulAlpha = true;
                textureMaterial.enableBlend = true;
                this.gameObject.addChild(lightIcon);
                // this.lightIcon.on("click", () =>
                // {
                //     editor3DData.selectObject(this.gameObject);
                // });
                //
                var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
                lightLines.mouseEnabled = false;
                lightLines.serializable = false;
                lightLines.showinHierarchy = false;
                var lightLines1 = this.lightLines1 = feng3d.GameObject.create("Lines1");
                lightLines1.addComponent(feng3d.BillboardComponent).camera = editor.editorCamera;
                lightLines1.mouseEnabled = false;
                lightLines1.serializable = false;
                lightLines1.showinHierarchy = false;
                var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
                var meshRenderer1 = lightLines1.addComponent(feng3d.MeshRenderer);
                var material = meshRenderer.material = new feng3d.SegmentMaterial();
                // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
                material.color = new feng3d.Color(1, 1, 1, 0.5);
                material.enableBlend = true;
                var material = meshRenderer1.material = new feng3d.SegmentMaterial();
                // material.color = new Color(163 / 255, 162 / 255, 107 / 255);
                material.color = new feng3d.Color(1, 1, 1, 0.5);
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
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(1, 0, 0), new feng3d.Color(1, 0, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(-1, 0, 0), new feng3d.Color(1, 0, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 1, 0), new feng3d.Color(0, 1, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, -1, 0), new feng3d.Color(0, 1, 0)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 0, 1), new feng3d.Color(0, 0, 1)));
                pointGeometry.addPoint(new feng3d.PointInfo(new feng3d.Vector3D(0, 0, -1), new feng3d.Color(0, 0, 1)));
                var pointMaterial = meshRenderer.material = new feng3d.PointMaterial();
                pointMaterial.enableBlend = true;
                pointMaterial.pointSize = 5;
                // pointMaterial.color = new Color(163 / 255 * 1.2, 162 / 255 * 1.2, 107 / 255 * 1.2);
                this.gameObject.addChild(lightpoints);
                this.enabled = true;
            };
            PointLightIcon.prototype.update = function () {
                this.textureMaterial.color = this.pointLight.color;
                this.lightLines.transform.scale =
                    this.lightLines1.transform.scale =
                        this.lightpoints.transform.scale =
                            new feng3d.Vector3D(this.pointLight.range, this.pointLight.range, this.pointLight.range);
                if (editor.editorData.selectedGameObjects.indexOf(this.gameObject) != -1) {
                    //
                    var camerapos = this.gameObject.transform.inverseTransformPoint(editor.editorCamera.gameObject.transform.scenePosition);
                    //
                    this.segmentGeometry.removeAllSegments();
                    var alpha = 1;
                    var backalpha = 0.5;
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
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(1, 0, 0, alpha), new feng3d.Color(1, 0, 0, alpha)));
                        point0 = new feng3d.Vector3D(x, 0, y);
                        point1 = new feng3d.Vector3D(x1, 0, y1);
                        if (point0.dotProduct(camerapos) < 0 || point1.dotProduct(camerapos) < 0)
                            alpha = backalpha;
                        else
                            alpha = 1.0;
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(0, 1, 0, alpha), new feng3d.Color(0, 1, 0, alpha)));
                        point0 = new feng3d.Vector3D(x, y, 0);
                        point1 = new feng3d.Vector3D(x1, y1, 0);
                        if (point0.dotProduct(camerapos) < 0 || point1.dotProduct(camerapos) < 0)
                            alpha = backalpha;
                        else
                            alpha = 1.0;
                        this.segmentGeometry.addSegment(new feng3d.Segment(point0, point1, new feng3d.Color(0, 0, 1, alpha), new feng3d.Color(0, 0, 1, alpha)));
                    }
                    this.pointGeometry.removeAllPoints();
                    var point = new feng3d.Vector3D(1, 0, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 0, 0, alpha)));
                    point = new feng3d.Vector3D(-1, 0, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(1, 0, 0, alpha)));
                    point = new feng3d.Vector3D(0, 1, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(0, 1, 0, alpha)));
                    point = new feng3d.Vector3D(0, -1, 0);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(0, 1, 0, alpha)));
                    point = new feng3d.Vector3D(0, 0, 1);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(0, 0, 1, alpha)));
                    point = new feng3d.Vector3D(0, 0, -1);
                    if (point.dotProduct(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.pointGeometry.addPoint(new feng3d.PointInfo(point, new feng3d.Color(0, 0, 1, alpha)));
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
            };
            PointLightIcon.prototype.dispose = function () {
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
                _super.prototype.dispose.call(this);
            };
            return PointLightIcon;
        }(editor.EditorScript));
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
                "threejs/libs/inflate.min.js",
                //
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
            success: function () {
                Number.prototype["format"] = function () {
                    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                };
                // log("提供解析的 three.js 初始化完成，")
            }
        });
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.threejsLoader = {
            load: load,
        };
        var usenumberfixed = true;
        function load(url, onParseComplete) {
            var skeletonComponent;
            //
            var loader = new window["THREE"].FBXLoader();
            if (typeof url == "string") {
                loader.load(url, onLoad, onProgress, onError);
            }
            else {
                var reader = new FileReader();
                reader.addEventListener('load', function (event) {
                    var scene = loader.parse(event.target["result"]);
                    onLoad(scene);
                }, false);
                reader.readAsArrayBuffer(url);
            }
            function onLoad(scene) {
                var gameobject = parse(scene);
                gameobject.transform.sx = -1;
                onParseComplete && onParseComplete(gameobject);
                feng3d.log("onLoad");
            }
            function onProgress(event) {
                feng3d.log(event);
            }
            function onError(err) {
                feng3d.error(err);
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
                        feng3d.assert(object3d.bindMode == "attached");
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
                        feng3d.warn("\u6CA1\u6709\u63D0\u4F9B " + object3d.type + " \u7C7B\u578B\u5BF9\u8C61\u7684\u89E3\u6790");
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
                object3d.children.forEach(function (element) {
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
                        feng3d.warn("\u6CA1\u6709\u5904\u7406 propertyName " + result[2]);
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
                        feng3d.warn("\u6CA1\u6709\u63D0\u4F9B\u89E3\u6790 " + keyframeTrack.ValueTypeName + " \u7C7B\u578BTrack\u6570\u636E");
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
                    feng3d.warn("\u6CA1\u6709\u5728\u9AA8\u67B6\u4E2D\u627E\u5230 \u9AA8\u9ABC " + bones[i].name);
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
                            feng3d.warn("没有解析顶点数据", key);
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
            material.cullFace = feng3d.CullFace.NONE;
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
        editor.mainMenu = [
            {
                label: "新建项目", click: function () {
                    editor.popupview.popup({ newprojectname: "newproject" }, function (data) {
                        if (data.newprojectname && data.newprojectname.length > 0) {
                            editor.editorcache.projectname = data.newprojectname;
                            window.location.reload();
                        }
                    });
                }
            },
            {
                label: "保存场景", click: function () {
                    var gameobject = editor.hierarchyTree.rootnode.gameobject;
                    editor.editorAssets.saveObject(gameobject, gameobject.name + ".scene", true);
                }
            },
            {
                label: "导入项目", click: function () {
                    editor.fs.selectFile(function (filelist) {
                        editor.fs.importProject(filelist.item(0), function () {
                            console.log("导入项目完成");
                            editor.editorAssets.initproject(editor.editorAssets.projectPath, function () {
                                editor.editorAssets.readScene("default.scene", function (err, scene) {
                                    editor.engine.scene = scene;
                                    editor.editorui.assetsview.updateShowFloder();
                                    editor.assetsDispather.dispatch("changed");
                                    console.log("导入项目完成!");
                                });
                            });
                        });
                    });
                }
            },
            {
                label: "导出项目", click: function () {
                    editor.fs.exportProject(function (err, content) {
                        // see FileSaver.js
                        saveAs(content, "example.feng3d.zip");
                    });
                }
            },
        ];
        /**
         * 层级界面创建3D对象列表数据
         */
        editor.createObjectConfig = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
            {
                label: "GameObject", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createGameObject());
                }
            },
            {
                label: "Plane", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createPlane());
                }
            },
            {
                label: "Cube", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createCube());
                }
            },
            {
                label: "Sphere", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createSphere());
                }
            },
            {
                label: "Capsule", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createCapsule());
                }
            },
            {
                label: "Cylinder", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createCylinder());
                }
            },
            {
                label: "Cone", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createCone());
                }
            },
            {
                label: "Torus", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createTorus());
                }
            },
            {
                label: "Particle", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createParticle());
                }
            },
            {
                label: "Camera", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createCamera());
                }
            },
            {
                label: "PointLight", click: function () {
                    addToHierarchy(feng3d.GameObjectFactory.createPointLight());
                }
            },
            {
                label: "DirectionalLight", click: function () {
                    var gameobject = feng3d.GameObject.create("DirectionalLight");
                    gameobject.addComponent(feng3d.DirectionalLight);
                    addToHierarchy(gameobject);
                }
            },
        ];
        function addToHierarchy(gameobject) {
            var selectedNode = editor.hierarchyTree.getSelectedNode();
            if (selectedNode)
                selectedNode.gameobject.addChild(gameobject);
            else
                editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
            editor.editorData.selectObject(gameobject);
        }
        /**
         * 层级界面创建3D对象列表数据
         */
        editor.createComponentConfig = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
            { label: "ParticleAnimator", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.ParticleAnimator); } },
            { label: "Camera", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.Camera); } },
            { label: "PointLight", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.PointLight); } },
            { label: "DirectionalLight", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.DirectionalLight); } },
            { label: "Script", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.Script); } },
            { label: "OutLineComponent", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.OutLineComponent); } },
            { label: "HoldSizeComponent", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.HoldSizeComponent); } },
            { label: "BillboardComponent", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.BillboardComponent); } },
            { label: "Animation", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.Animation); } },
            // { label: "LineComponent", click: () => { needcreateComponentGameObject.addComponent(LineComponent); } },
            { label: "CartoonComponent", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.CartoonComponent); } },
            { label: "FPSController", click: function () { editor.needcreateComponentGameObject.addComponent(feng3d.FPSController); } },
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
    { key: "alt+rightmousedown", command: "sceneCameraForwardBackMouseMoveStart", stateCommand: "sceneCameraForwardBackMouseMoving", when: "mouseInView3D+!fpsViewing" },
    { key: "mousemove", command: "sceneCameraForwardBackMouseMove", when: "sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", stateCommand: "!sceneCameraForwardBackMouseMoving", when: "sceneCameraForwardBackMouseMoving" },
    { key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "mouseInView3D+!sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
    { key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
    { key: "mouseup", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
    { key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "dragScene", when: "dragSceneing" },
    { key: "middlemouseup", stateCommand: "!dragSceneing", when: "dragSceneing" },
    { key: "mousewheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "" },
    { key: "f", command: "lookToSelectedGameObject", when: "" },
    { key: "w", command: "gameobjectMoveTool", when: "!fpsViewing" },
    { key: "e", command: "gameobjectRotationTool", when: "!fpsViewing" },
    { key: "r", command: "gameobjectScaleTool", when: "!fpsViewing" },
    { key: "del", command: "deleteSeletedGameObject", when: "" },
    { key: "click+!alt", command: "selectGameObject", when: "mouseInView3D+!mouseInSceneRotateTool" },
];
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        editor.editorDispatcher = new feng3d.EventDispatcher();
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
        var Editor = /** @class */ (function (_super) {
            __extends(Editor, _super);
            function Editor() {
                var _this = _super.call(this) || this;
                var mainui = new editor.MainUI(function () {
                    editor.editorui.stage = _this.stage;
                    //
                    var maskLayer = new eui.UILayer();
                    maskLayer.touchEnabled = false;
                    _this.stage.addChild(maskLayer);
                    editor.editorui.maskLayer = maskLayer;
                    //
                    var popupLayer = new eui.UILayer();
                    popupLayer.touchEnabled = false;
                    _this.stage.addChild(popupLayer);
                    editor.editorui.popupLayer = popupLayer;
                    //初始化配置
                    editor.objectViewConfig();
                    _this.initproject(function () {
                        setTimeout(function () {
                            _this.init();
                        }, 1);
                    });
                    _this.removeChild(mainui);
                });
                _this.addChild(mainui);
                return _this;
            }
            Editor.prototype.init = function () {
                //
                editor.editorData = new editor.EditorData();
                document.head.getElementsByTagName("title")[0].innerText = "editor -- " + editor.editorAssets.projectPath;
                //
                new editor.EditorEnvironment();
                this.initMainView();
                //初始化feng3d
                new editor.Main3D();
                feng3d.shortcut.addShortCuts(shortcutConfig);
                editor.editorshortcut.init();
                this.once(egret.Event.ENTER_FRAME, function () {
                    //
                    egret.mouseEventEnvironment = new egret.MouseEventEnvironment();
                }, this);
                this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
            };
            Editor.prototype.initMainView = function () {
                //
                this.mainView = new editor.MainView();
                this.stage.addChildAt(this.mainView, 1);
                this.onresize();
                window.onresize = this.onresize.bind(this);
                editor.editorui.mainview = this.mainView;
            };
            Editor.prototype.onresize = function () {
                this.stage.setContentSize(window.innerWidth, window.innerHeight);
                this.mainView.width = this.stage.stageWidth;
                this.mainView.height = this.stage.stageHeight;
            };
            Editor.prototype.initproject = function (callback) {
                editor.editorcache.projectname = editor.editorcache.projectname || "newproject";
                editor.fs.hasProject(editor.editorcache.projectname, function (has) {
                    if (has) {
                        editor.editorAssets.projectPath = editor.editorcache.projectname;
                        editor.fs.initproject(editor.editorcache.projectname, callback);
                    }
                    else {
                        editor.fs.createproject(editor.editorcache.projectname, function () {
                            editor.editorAssets.projectPath = editor.editorcache.projectname;
                            editor.fs.initproject(editor.editorcache.projectname, callback);
                        });
                    }
                });
            };
            Editor.prototype._onAddToStage = function () {
                editor.editorData.stage = this.stage;
            };
            return Editor;
        }(eui.UILayer));
        editor.Editor = Editor;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=editor.js.map