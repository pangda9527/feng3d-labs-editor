import { AssetType, dataTransform, FileAsset, FolderAsset, GameObjectAsset, GeometryAsset, globalEmitter, MaterialAsset, pathUtils, serialize, TextureAsset, TextureCubeAsset } from 'feng3d';
import { editorRS } from '../../assets/EditorRS';
import { Feng3dScreenShot } from '../../feng3d/Feng3dScreenShot';
import { TreeNode, TreeNodeMap } from '../components/TreeNode';
import { DragData } from '../drag/Drag';
import { editorAsset } from './EditorAsset';

export interface AssetNodeEventMap extends TreeNodeMap
{
    /**
     * 加载完成
     */
    loaded
}

/**
 * 资源树结点
 */
export class AssetNode<T extends AssetNodeEventMap = AssetNodeEventMap> extends TreeNode<T>
{
    /**
     * 是否文件夹
     */
    isDirectory: boolean;

    /**
     * 图标名称或者路径
     */
    image: string;

    /**
     * 显示标签
     */
    label: string;

    @serialize
    children: AssetNode[] = [];

    parent: AssetNode;

    asset: FileAsset;

    /**
     * 是否已加载
     */
    isLoaded = false;

    /**
     * 是否加载中
     */
    private isLoading: boolean;

    /**
     * 构建
     * 
     * @param asset 资源
     */
    constructor(asset: FileAsset)
    {
        super();

        this.asset = asset;
        this.isDirectory = asset.assetType == AssetType.folder;
        this.label = asset.fileName;
        // 更新图标
        if (this.isDirectory)
        {
            this.image = "folder_png";
        }
        else
        {
            this.image = "file_png";
        }

        asset.readPreview((err, image) =>
        {
            if (image)
            {
                this.image = dataTransform.imageToDataURL(image);
            } else
            {
                this.updateImage();
            }
        });
    }

    /**
     * 加载
     * 
     * @param callback 加载完成回调
     */
    load(callback?: () => void)
    {
        if (this.isLoaded)
        {
            callback && callback();
            return;
        }

        if (this.isLoading)
        {
            callback && this.on("loaded", callback);
            return;
        }

        this.isLoading = true;

        editorRS.readAsset(this.asset.assetId, (err, asset) =>
        {
            console.assert(!err);

            this.isLoading = false;
            this.isLoaded = true;

            callback && callback();

            this.emit("loaded", this);
        });
    }

    /**
     * 更新预览图
     */
    updateImage()
    {
        if (this.asset instanceof TextureAsset)
        {
            var texture = this.asset.data;

            this.image = Feng3dScreenShot.feng3dScreenShot.drawTexture(texture);

            dataTransform.dataURLToImage(this.image, (image) =>
            {
                this.asset.writePreview(image);
            });

        } else if (this.asset instanceof TextureCubeAsset)
        {
            var textureCube = this.asset.data;
            textureCube.onLoadCompleted(() =>
            {
                this.image = Feng3dScreenShot.feng3dScreenShot.drawTextureCube(textureCube);

                dataTransform.dataURLToImage(this.image, (image) =>
                {
                    this.asset.writePreview(image);
                });
            });
        } else if (this.asset instanceof MaterialAsset)
        {
            var mat = this.asset;
            mat.data.onLoadCompleted(() =>
            {
                this.image = Feng3dScreenShot.feng3dScreenShot.drawMaterial(mat.data).toDataURL();
                dataTransform.dataURLToImage(this.image, (image) =>
                {
                    this.asset.writePreview(image);
                });
            });
        } else if (this.asset instanceof GeometryAsset)
        {
            this.image = Feng3dScreenShot.feng3dScreenShot.drawGeometry(<any>this.asset.data).toDataURL();

            dataTransform.dataURLToImage(this.image, (image) =>
            {
                this.asset.writePreview(image);
            });
        } else if (this.asset instanceof GameObjectAsset)
        {
            var gameObject = this.asset.data;
            gameObject.onLoadCompleted(() =>
            {
                this.image = Feng3dScreenShot.feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                dataTransform.dataURLToImage(this.image, (image) =>
                {
                    this.asset.writePreview(image);
                });
            });
        }
    }

    /**
     * 删除
     */
    delete()
    {
        this.children.forEach(element =>
        {
            element.delete();
        });
        this.remove();

        editorAsset.deleteAsset(this);
    }

    /**
     * 获取文件夹列表
     * 
     * @param includeClose 是否包含关闭的文件夹
     */
    getFolderList(includeClose = false)
    {
        var folders: AssetNode[] = [];
        if (this.isDirectory)
        {
            folders.push(this);
        }
        if (this.isOpen || includeClose)
        {
            this.children.forEach(v =>
            {
                var cfolders = v.getFolderList();
                folders = folders.concat(cfolders);
            });
        }
        return folders;
    }

    /**
     * 获取文件列表
     */
    getFileList()
    {
        var files: AssetNode[] = [];
        files.push(this);
        this.children.forEach(v =>
        {
            var cfiles = v.getFileList();
            files = files.concat(cfiles);
        });
        return files;
    }

    /**
     * 提供拖拽数据
     * 
     * @param dragsource 
     */
    setdargSource(dragsource: DragData)
    {
        var extension = this.asset.assetType;
        switch (extension)
        {
            case AssetType.gameobject:
                dragsource.addDragData("file_gameobject", <any>this.asset);
                break;
            case AssetType.script:
                dragsource.addDragData("file_script", <any>this.asset);
                break;
            case AssetType.anim:
                dragsource.addDragData("animationclip", <any>this.asset.data);
                break;
            case AssetType.material:
                dragsource.addDragData("material", <any>this.asset.data);
                break;
            case AssetType.texturecube:
                dragsource.addDragData("texturecube", <any>this.asset.data);
                break;
            case AssetType.geometry:
                dragsource.addDragData("geometry", <any>this.asset.data);
                break;
            case AssetType.texture:
                dragsource.addDragData("texture2d", <any>this.asset.data);
                break;
            case AssetType.audio:
                dragsource.addDragData("audio", <any>this.asset.data);
                break;
        }
        dragsource.addDragData("assetNodes", this);
    }

    /**
     * 接受拖拽数据
     * 
     * @param dragdata 
     */
    acceptDragDrop(dragdata: DragData)
    {
        if (!(this.asset instanceof FolderAsset)) return;
        var folder = this.asset;

        dragdata.getDragData("assetNodes").forEach(v =>
        {
            editorRS.moveAsset(v.asset, folder, (err) =>
            {
                if (!err)
                {
                    this.addChild(v);
                } else
                {
                    globalEmitter.emit("message.error", err.message);
                }
            });
        });
    }

    /**
     * 导出
     */
    export()
    {
        var zip = new JSZip();

        var path = this.asset.assetPath;
        if (!pathUtils.isDirectory(path))
            path = pathUtils.dirname(path);

        var filename = this.label;
        editorRS.fs.getAllPathsInFolder(path, (err, filepaths) =>
        {
            readfiles();
            function readfiles()
            {
                if (filepaths.length > 0)
                {
                    var filepath = filepaths.shift();
                    editorRS.fs.readArrayBuffer(filepath, (err, data: ArrayBuffer) =>
                    {
                        //处理文件夹
                        data && zip.file(filepath, data);
                        readfiles();
                    });
                } else
                {
                    zip.generateAsync({ type: "blob" }).then(function (content)
                    {
                        saveAs(content, `${filename}.zip`);
                    });
                }
            }
        });
    }
}
