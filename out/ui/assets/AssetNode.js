"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
var TreeNode_1 = require("../components/TreeNode");
var EditorRS_1 = require("../../assets/EditorRS");
var Feng3dScreenShot_1 = require("../../feng3d/Feng3dScreenShot");
var EditorAsset_1 = require("./EditorAsset");
/**
 * 资源树结点
 */
var AssetNode = /** @class */ (function (_super) {
    __extends(AssetNode, _super);
    /**
     * 构建
     *
     * @param asset 资源
     */
    function AssetNode(asset) {
        var _this = _super.call(this) || this;
        _this.children = [];
        /**
         * 是否已加载
         */
        _this.isLoaded = false;
        _this.asset = asset;
        _this.isDirectory = asset.assetType == feng3d.AssetType.folder;
        _this.label = asset.name;
        // 更新图标
        if (_this.isDirectory) {
            _this.image = "folder_png";
        }
        else {
            _this.image = "file_png";
        }
        asset.readThumbnail(function (err, image) {
            if (image) {
                _this.image = feng3d.dataTransform.imageToDataURL(image);
            }
            else {
                _this.updateImage();
            }
        });
        return _this;
    }
    /**
     * 加载
     *
     * @param callback 加载完成回调
     */
    AssetNode.prototype.load = function (callback) {
        var _this = this;
        if (this.isLoaded) {
            callback && callback();
            return;
        }
        if (this.isLoading) {
            callback && this.on("loaded", callback);
            return;
        }
        this.isLoading = true;
        EditorRS_1.editorRS.readAsset(this.asset.assetId, function (err, asset) {
            feng3d.assert(!err);
            _this.isLoading = false;
            _this.isLoaded = true;
            callback && callback();
            _this.dispatch("loaded", _this);
        });
    };
    /**
     * 更新缩略图
     */
    AssetNode.prototype.updateImage = function () {
        var _this = this;
        if (this.asset instanceof feng3d.TextureAsset) {
            var texture = this.asset.data;
            this.image = texture.dataURL;
            feng3d.dataTransform.dataURLToImage(this.image, function (image) {
                _this.asset.writeThumbnail(image);
            });
        }
        else if (this.asset instanceof feng3d.TextureCubeAsset) {
            var textureCube = this.asset.data;
            textureCube.onLoadCompleted(function () {
                _this.image = Feng3dScreenShot_1.feng3dScreenShot.drawTextureCube(textureCube);
                feng3d.dataTransform.dataURLToImage(_this.image, function (image) {
                    _this.asset.writeThumbnail(image);
                });
            });
        }
        else if (this.asset instanceof feng3d.MaterialAsset) {
            var mat = this.asset;
            mat.data.onLoadCompleted(function () {
                _this.image = Feng3dScreenShot_1.feng3dScreenShot.drawMaterial(mat.data).toDataURL();
                feng3d.dataTransform.dataURLToImage(_this.image, function (image) {
                    _this.asset.writeThumbnail(image);
                });
            });
        }
        else if (this.asset instanceof feng3d.GeometryAsset) {
            this.image = Feng3dScreenShot_1.feng3dScreenShot.drawGeometry(this.asset.data).toDataURL();
            feng3d.dataTransform.dataURLToImage(this.image, function (image) {
                _this.asset.writeThumbnail(image);
            });
        }
        else if (this.asset instanceof feng3d.GameObjectAsset) {
            var gameObject = this.asset.data;
            gameObject.onLoadCompleted(function () {
                _this.image = Feng3dScreenShot_1.feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                feng3d.dataTransform.dataURLToImage(_this.image, function (image) {
                    _this.asset.writeThumbnail(image);
                });
            });
        }
    };
    /**
     * 删除
     */
    AssetNode.prototype.delete = function () {
        this.children.forEach(function (element) {
            element.delete();
        });
        this.remove();
        EditorAsset_1.editorAsset.deleteAsset(this);
    };
    /**
     * 获取文件夹列表
     *
     * @param includeClose 是否包含关闭的文件夹
     */
    AssetNode.prototype.getFolderList = function (includeClose) {
        if (includeClose === void 0) { includeClose = false; }
        var folders = [];
        if (this.isDirectory) {
            folders.push(this);
        }
        if (this.isOpen || includeClose) {
            this.children.forEach(function (v) {
                var cfolders = v.getFolderList();
                folders = folders.concat(cfolders);
            });
        }
        return folders;
    };
    /**
     * 获取文件列表
     */
    AssetNode.prototype.getFileList = function () {
        var files = [];
        files.push(this);
        this.children.forEach(function (v) {
            var cfiles = v.getFileList();
            files = files.concat(cfiles);
        });
        return files;
    };
    /**
     * 导出
     */
    AssetNode.prototype.export = function () {
        feng3d.error("未实现");
        var zip = new JSZip();
        var path = this.asset.assetPath;
        if (!feng3d.pathUtils.isDirectory(path))
            path = feng3d.pathUtils.getParentPath(path);
        var filename = this.label;
        EditorRS_1.editorRS.fs.getAllfilepathInFolder(path, function (err, filepaths) {
            readfiles();
            function readfiles() {
                if (filepaths.length > 0) {
                    var filepath = filepaths.shift();
                    EditorRS_1.editorRS.fs.readArrayBuffer(filepath, function (err, data) {
                        //处理文件夹
                        data && zip.file(filepath, data);
                        readfiles();
                    });
                }
                else {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, filename + ".zip");
                    });
                }
            }
        });
    };
    __decorate([
        feng3d.serialize
    ], AssetNode.prototype, "children", void 0);
    return AssetNode;
}(TreeNode_1.TreeNode));
exports.AssetNode = AssetNode;
//# sourceMappingURL=AssetNode.js.map