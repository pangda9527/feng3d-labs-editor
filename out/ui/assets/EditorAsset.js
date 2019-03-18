"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AssetNode_1 = require("./AssetNode");
var EditorRS_1 = require("../../assets/EditorRS");
var EditorData_1 = require("../../global/EditorData");
var Menu_1 = require("../components/Menu");
var NativeRequire_1 = require("../../assets/NativeRequire");
var threejsLoader_1 = require("../../loaders/threejsLoader");
var AssetFileTemplates_1 = require("./AssetFileTemplates");
var EditorAsset = /** @class */ (function () {
    function EditorAsset() {
        /**
         * 资源ID字典
         */
        this._assetIDMap = {};
        /**
         * 上次执行的项目脚本
         */
        this._preProjectJsContent = null;
        feng3d.dispatcher.on("asset.parsed", this.onParsed, this);
    }
    /**
     * 初始化项目
     * @param callback
     */
    EditorAsset.prototype.initproject = function (callback) {
        var _this = this;
        EditorRS_1.editorRS.init(function () {
            EditorRS_1.editorRS.getAllAssets().map(function (asset) {
                return _this._assetIDMap[asset.assetId] = new AssetNode_1.AssetNode(asset);
            }).forEach(function (element) {
                if (element.asset.parentAsset) {
                    var parentNode = _this._assetIDMap[element.asset.parentAsset.assetId];
                    parentNode.addChild(element);
                }
            });
            _this.rootFile = _this._assetIDMap[EditorRS_1.editorRS.root.assetId];
            _this.showFloder = _this.rootFile;
            _this.rootFile.isOpen = true;
            callback();
        });
    };
    EditorAsset.prototype.readScene = function (path, callback) {
        EditorRS_1.editorRS.fs.readObject(path, function (err, object) {
            if (err) {
                callback(err, null);
                return;
            }
            var scene = object.getComponent(feng3d.Scene3D);
            callback(null, scene);
        });
    };
    /**
     * 根据资源编号获取文件
     *
     * @param assetId 文件路径
     */
    EditorAsset.prototype.getAssetByID = function (assetId) {
        return this._assetIDMap[assetId];
    };
    /**
     * 删除资源
     *
     * @param assetNode 资源
     */
    EditorAsset.prototype.deleteAsset = function (assetNode, callback) {
        var _this = this;
        EditorRS_1.editorRS.deleteAsset(assetNode.asset, function (err) {
            if (err) {
                callback && callback(err);
                return;
            }
            delete _this._assetIDMap[assetNode.asset.assetId];
            feng3d.dispatcher.dispatch("asset.deletefile", { id: assetNode.asset.assetId });
            callback && callback(err);
        });
    };
    /**
     * 保存资源
     *
     * @param assetNode 资源
     * @param callback 完成回调
     */
    EditorAsset.prototype.saveAsset = function (assetNode, callback) {
        EditorRS_1.editorRS.writeAsset(assetNode.asset, function (err) {
            feng3d.assert(!err, "\u8D44\u6E90 " + assetNode.asset.assetId + " \u4FDD\u5B58\u5931\u8D25\uFF01");
            callback && callback();
        });
    };
    /**
     * 新增资源
     *
     * @param feng3dAssets
     */
    EditorAsset.prototype.createAsset = function (folderNode, cls, value, callback) {
        var _this = this;
        var folder = folderNode.asset;
        EditorRS_1.editorRS.createAsset(cls, value, folder, function (err, asset) {
            if (asset) {
                var assetNode = new AssetNode_1.AssetNode(asset);
                assetNode.isLoaded = true;
                _this._assetIDMap[assetNode.asset.assetId] = assetNode;
                folderNode.addChild(assetNode);
                EditorData_1.editorData.selectObject(assetNode);
                callback && callback(null, assetNode);
            }
            else {
                alert(err.message);
            }
        });
    };
    /**
     * 弹出文件菜单
     */
    EditorAsset.prototype.popupmenu = function (assetNode) {
        var _this = this;
        var folder = assetNode.asset;
        var menuconfig = [
            {
                label: "新建",
                show: assetNode.isDirectory,
                submenu: [
                    {
                        label: "文件夹", click: function () {
                            _this.createAsset(assetNode, feng3d.FolderAsset, { name: "NewFolder" });
                        }
                    },
                    {
                        label: "脚本", click: function () {
                            var fileName = EditorRS_1.editorRS.getValidChildName(folder, "NewScript");
                            _this.createAsset(assetNode, feng3d.ScriptAsset, { name: fileName, textContent: AssetFileTemplates_1.assetFileTemplates.getNewScript(fileName) }, function () {
                                feng3d.dispatcher.dispatch("script.compile");
                            });
                        }
                    },
                    {
                        label: "着色器", click: function () {
                            var fileName = EditorRS_1.editorRS.getValidChildName(folder, "NewShader");
                            _this.createAsset(assetNode, feng3d.ShaderAsset, { name: fileName, textContent: AssetFileTemplates_1.assetFileTemplates.getNewShader(fileName) }, function () {
                                feng3d.dispatcher.dispatch("script.compile");
                            });
                        }
                    },
                    {
                        label: "js", click: function () {
                            _this.createAsset(assetNode, feng3d.JSAsset, { name: "NewJs" });
                        }
                    },
                    {
                        label: "Json", click: function () {
                            _this.createAsset(assetNode, feng3d.JsonAsset, { name: "New Json" });
                        }
                    },
                    {
                        label: "文本", click: function () {
                            _this.createAsset(assetNode, feng3d.TextAsset, { name: "New Text" });
                        }
                    },
                    { type: "separator" },
                    {
                        label: "立方体贴图", click: function () {
                            _this.createAsset(assetNode, feng3d.TextureCubeAsset, { name: "new TextureCube", data: new feng3d.TextureCube() });
                        }
                    },
                    {
                        label: "材质", click: function () {
                            _this.createAsset(assetNode, feng3d.MaterialAsset, { name: "New Material", data: new feng3d.Material() });
                        }
                    },
                    {
                        label: "几何体",
                        submenu: [
                            {
                                label: "平面", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New PlaneGeometry", data: new feng3d.PlaneGeometry() });
                                }
                            },
                            {
                                label: "立方体", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New CubeGeometry", data: new feng3d.CubeGeometry() });
                                }
                            },
                            {
                                label: "球体", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New SphereGeometry", data: new feng3d.SphereGeometry() });
                                }
                            },
                            {
                                label: "胶囊体", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New CapsuleGeometry", data: new feng3d.CapsuleGeometry() });
                                }
                            },
                            {
                                label: "圆柱体", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New CylinderGeometry", data: new feng3d.CylinderGeometry() });
                                }
                            },
                            {
                                label: "圆锥体", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New ConeGeometry", data: new feng3d.ConeGeometry() });
                                }
                            },
                            {
                                label: "圆环", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New TorusGeometry", data: new feng3d.TorusGeometry() });
                                }
                            },
                            {
                                label: "地形", click: function () {
                                    _this.createAsset(assetNode, feng3d.GeometryAsset, { name: "New TerrainGeometry", data: new feng3d.TerrainGeometry() });
                                }
                            },
                        ],
                    },
                ]
            },
            { type: "separator" },
            {
                label: "导入资源", click: function () {
                    EditorRS_1.editorRS.selectFile(function (fileList) {
                        var files = [];
                        for (var i = 0; i < fileList.length; i++) {
                            files[i] = fileList[i];
                        }
                        _this.inputFiles(files);
                    });
                }, show: assetNode.isDirectory,
            },
            {
                label: "在资源管理器中显示", click: function () {
                    var fullpath = EditorRS_1.editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                    NativeRequire_1.nativeAPI.showFileInExplorer(fullpath);
                }, show: !!NativeRequire_1.nativeAPI,
            }, {
                label: "使用VSCode打开项目", click: function () {
                    NativeRequire_1.nativeAPI.openWithVSCode(EditorRS_1.editorRS.fs.projectname, function (err) {
                        if (err)
                            throw err;
                    });
                }, show: !!NativeRequire_1.nativeAPI,
            },
            { type: "separator" },
            {
                label: "编辑", click: function () {
                    if (NativeRequire_1.nativeAPI) {
                        // 使用本地 VSCode 打开
                        var path = EditorRS_1.editorRS.fs.getAbsolutePath(assetNode.asset.assetPath);
                        NativeRequire_1.nativeAPI.openWithVSCode(EditorRS_1.editorRS.fs.projectname, function (err) {
                            if (err)
                                throw err;
                            NativeRequire_1.nativeAPI.openWithVSCode(path, function (err) {
                                if (err)
                                    throw err;
                            });
                        });
                    }
                    else {
                        if (codeeditoWin)
                            codeeditoWin.close();
                        codeeditoWin = window.open("codeeditor.html");
                        var script = assetNode.asset;
                        codeeditoWin.onload = function () {
                            feng3d.dispatcher.dispatch("codeeditor.openScript", script);
                        };
                    }
                }, show: assetNode.asset instanceof feng3d.StringAsset,
            },
        ];
        // 解析菜单
        this.parserMenu(menuconfig, assetNode);
        menuconfig.push({
            label: "导出", click: function () {
                assetNode.export();
            }, show: !assetNode.isDirectory,
        }, {
            label: "删除", click: function () {
                assetNode.delete();
            }, show: assetNode != this.rootFile && assetNode != this.showFloder,
        }, {
            label: "去除背景色", click: function () {
                var image = assetNode.asset["image"];
                var imageUtil = new feng3d.ImageUtil().fromImage(image);
                var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                imageUtil.clearBackColor(backColor);
                feng3d.dataTransform.imagedataToImage(imageUtil.imageData, function (img) {
                    assetNode.asset["image"] = img;
                    _this.saveAsset(assetNode);
                });
            }, show: assetNode.asset.data instanceof feng3d.Texture2D,
        });
        Menu_1.menu.popup(menuconfig);
    };
    /**
     * 保存对象
     *
     * @param object 对象
     * @param callback
     */
    EditorAsset.prototype.saveObject = function (object, callback) {
        feng3d.error("\u672A\u5B9E\u73B0");
        // var assetsFile = this.createAssets(this.showFloder, object.name, object);
        // callback && callback(assetsFile);
    };
    /**
     *
     * @param files 需要导入的文件列表
     * @param callback 完成回调
     * @param assetNodes 生成资源文件列表（不用赋值，函数递归时使用）
     */
    EditorAsset.prototype.inputFiles = function (files, callback, assetNodes) {
        var _this = this;
        if (assetNodes === void 0) { assetNodes = []; }
        if (files.length == 0) {
            EditorData_1.editorData.selectMultiObject(assetNodes);
            callback && callback(assetNodes);
            return;
        }
        var file = files.shift();
        var reader = new FileReader();
        reader.addEventListener('load', function (event) {
            var result = event.target["result"];
            var showFloder = _this.showFloder;
            var createAssetCallback = function (err, assetNode) {
                if (err) {
                    alert(err.message);
                }
                else {
                    assetNodes.push(assetNode);
                }
                _this.inputFiles(files, callback, assetNodes);
            };
            var fileName = file.name;
            var lastIndex = fileName.lastIndexOf(".");
            if (lastIndex != -1) {
                fileName = fileName.substring(0, lastIndex);
            }
            if (feng3d.regExps.image.test(file.name)) {
                feng3d.dataTransform.arrayBufferToImage(result, function (img) {
                    _this.createAsset(showFloder, feng3d.TextureAsset, { name: fileName, image: img }, createAssetCallback);
                });
            }
            else {
                _this.createAsset(showFloder, feng3d.ArrayBufferAsset, { name: fileName, arraybuffer: result }, createAssetCallback);
            }
        }, false);
        reader.readAsArrayBuffer(file);
    };
    EditorAsset.prototype.runProjectScript = function (callback) {
        var _this = this;
        EditorRS_1.editorRS.fs.readString("project.js", function (err, content) {
            if (content != _this._preProjectJsContent) {
                //
                var windowEval = eval.bind(window);
                try {
                    // 运行project.js
                    windowEval(content);
                    // 刷新属性界面（界面中可能有脚本）
                    feng3d.dispatcher.dispatch("inspector.update");
                }
                catch (error) {
                    feng3d.warn(error);
                }
            }
            _this._preProjectJsContent = content;
            callback && callback();
        });
    };
    /**
     * 解析菜单
     * @param menuconfig 菜单
     * @param assetNode 文件
     */
    EditorAsset.prototype.parserMenu = function (menuconfig, assetNode) {
        if (assetNode.asset instanceof feng3d.FileAsset) {
            var filePath = assetNode.asset.assetPath;
            var extensions = feng3d.pathUtils.getExtension(filePath);
            switch (extensions) {
                case "mdl":
                    menuconfig.push({ label: "解析", click: function () { return feng3d.mdlLoader.load(filePath); } });
                    break;
                case "obj":
                    menuconfig.push({ label: "解析", click: function () { return feng3d.objLoader.load(filePath); } });
                    break;
                case "mtl":
                    menuconfig.push({ label: "解析", click: function () { return feng3d.mtlLoader.load(filePath); } });
                    break;
                case "fbx":
                    menuconfig.push({ label: "解析", click: function () { return threejsLoader_1.threejsLoader.load(filePath); } });
                    break;
                case "md5mesh":
                    menuconfig.push({ label: "解析", click: function () { return feng3d.md5Loader.load(filePath); } });
                    break;
                case "md5anim":
                    menuconfig.push({ label: "解析", click: function () { return feng3d.md5Loader.loadAnim(filePath); } });
                    break;
            }
        }
    };
    EditorAsset.prototype.showFloderChanged = function (property, oldValue, newValue) {
        this.showFloder.openParents();
        feng3d.dispatcher.dispatch("asset.showFloderChanged", { oldpath: oldValue, newpath: newValue });
    };
    EditorAsset.prototype.onParsed = function (e) {
        var data = e.data;
        if (data instanceof feng3d.FileAsset) {
            this.saveObject(data.data);
        }
    };
    __decorate([
        feng3d.watch("showFloderChanged")
    ], EditorAsset.prototype, "showFloder", void 0);
    return EditorAsset;
}());
exports.EditorAsset = EditorAsset;
exports.editorAsset = new EditorAsset();
var codeeditoWin;
//# sourceMappingURL=EditorAsset.js.map