import { Scene, ArrayUtils, globalEmitter, shortcut, GameObject, Box3, TextAsset } from 'feng3d';
import { AssetNode } from '../ui/assets/AssetNode';

/**
 * 游戏对象控制器类型
 */
export enum MRSToolType
{
    /**
     * 移动
     */
    MOVE,
    /**
     * 旋转
     */
    ROTATION,
    /**
     * 缩放
     */
    SCALE,
}

/**
 * 编辑器数据
 */
export class EditorData
{
    static editorData = new EditorData();

    /**
     * 游戏运行时的场景
     */
    gameScene: Scene;

    /**
     * 选中对象，游戏对象与资源文件列表
     * 选中对象时尽量使用 selectObject 方法设置选中对象
     */
    get selectedObjects()
    {
        return this._selectedObjects;
    }

    set selectedObjects(v)
    {
        v = v.filter((v) => !!v);
        if (!v) v = [];
        if (v === this._selectedObjects) return;
        if (v.length === this.selectedObjects.length && ArrayUtils.unique(v.concat(this._selectedObjects)).length === v.length) return;

        this._selectedObjects = v;

        this._selectedGameObjectsInvalid = true;
        this._selectedAssetFileInvalid = true;
        this._transformGameObjectInvalid = true;
        this._transformBoxInvalid = true;

        globalEmitter.emit('editor.selectedObjectsChanged');
    }
    private _selectedObjects = [];

    /**
     * 被复制的对象
     */
    copyObjects = [];

    clearSelectedObjects()
    {
        this.selectedObjects = [];
    }

    /**
     * 选择对象
     * 该方法会处理 按ctrl键附加选中对象操作
     * @param objs 选中的对象
     */
    selectObject(object: any)
    {
        const selecteds = this.selectedObjects.concat();

        const isAdd = shortcut.keyState.getKeyState('ctrl');
        if (!isAdd) selecteds.length = 0;
        //
        const index = selecteds.indexOf(object);
        if (index === -1) selecteds.push(object);
        else selecteds.splice(index, 1);
        //
        this.selectedObjects = selecteds;
    }

    /**
     * 选择对象
     * 该方法会处理 按ctrl键附加选中对象操作
     * @param objs 选中的对象
     */
    selectMultiObject(objs: (GameObject | AssetNode)[], isAdd?: boolean)
    {
        const selecteds = this.selectedObjects.concat();

        if (isAdd === undefined)
        {
            isAdd = shortcut.keyState.getKeyState('ctrl');
        }
        if (!isAdd) selecteds.length = 0;
        //
        objs.forEach((v) =>
        {
            const index = selecteds.indexOf(v);
            if (index === -1) selecteds.push(v);
            else selecteds.splice(index, 1);
        });
        //
        this.selectedObjects = selecteds;
    }

    /**
     * 使用的控制工具类型
     */
    get toolType()
    {
        return this._toolType;
    }
    set toolType(v)
    {
        if (this._toolType === v) return;
        this._toolType = v;
        globalEmitter.emit('editor.toolTypeChanged');
    }

    private _toolType = MRSToolType.MOVE;

    /**
     * 选中游戏对象列表
     */
    get selectedGameObjects()
    {
        if (this._selectedGameObjectsInvalid)
        {
            this._selectedGameObjects.length = 0;
            this.selectedObjects.forEach((v) =>
            {
                if (v instanceof GameObject) this._selectedGameObjects.push(v);
            });

            this._selectedGameObjectsInvalid = false;
        }

        return this._selectedGameObjects;
    }
    private _selectedGameObjects: GameObject[] = [];
    private _selectedGameObjectsInvalid = true;

    /**
     * 坐标原点是否在质心
     */
    get isBaryCenter()
    {
        return this._isBaryCenter;
    }
    set isBaryCenter(v)
    {
        if (this._isBaryCenter === v) return;
        this._isBaryCenter = v;
        this._transformBoxInvalid = true;
        globalEmitter.emit('editor.isBaryCenterChanged');
    }
    private _isBaryCenter = true;

    /**
     * 是否使用世界坐标
     */
    get isWoldCoordinate()
    {
        return this._isWoldCoordinate;
    }
    set isWoldCoordinate(v)
    {
        if (this._isWoldCoordinate === v) return;
        this._isWoldCoordinate = v;
        globalEmitter.emit('editor.isWoldCoordinateChanged');
    }
    private _isWoldCoordinate = false;

    /**
     * 变换对象
     */
    get transformGameObject()
    {
        if (this._transformGameObjectInvalid)
        {
            const length = this.selectedGameObjects.length;
            if (length > 0)
            {
                this._transformGameObject = this.selectedGameObjects[length - 1];
            }
            else
            {
                this._transformGameObject = null;
            }
            this._transformGameObjectInvalid = false;
        }

        return this._transformGameObject;
    }
    private _transformGameObject: GameObject;
    private _transformGameObjectInvalid = true;

    get transformBox()
    {
        if (this._transformBoxInvalid)
        {
            const length = this.selectedGameObjects.length;
            if (length > 0)
            {
                this._transformBox = null;
                this.selectedGameObjects.forEach((cv) =>
                {
                    const box = cv.boundingBox.worldBounds;
                    if (EditorData.editorData.isBaryCenter || !this._transformBox)
                    {
                        this._transformBox = box.clone();
                    }
                    else
                    {
                        this._transformBox.union(box);
                    }
                });
            }
            else
            {
                this._transformBox = null;
            }
            this._transformBoxInvalid = false;
        }

        return this._transformBox;
    }
    private _transformBox: Box3;
    private _transformBoxInvalid = true;

    /**
     * 选中游戏对象列表
     */
    get selectedAssetNodes()
    {
        if (this._selectedAssetFileInvalid)
        {
            this._selectedAssetNodes.length = 0;
            this.selectedObjects.forEach((v) =>
            {
                if (v instanceof AssetNode) this._selectedAssetNodes.push(v);
            });
            this._selectedAssetFileInvalid = false;
        }

        return this._selectedAssetNodes;
    }
    private _selectedAssetFileInvalid = true;
    private _selectedAssetNodes: AssetNode[] = [];

    /**
     * 编辑器打开的脚本
     */
    openScript: TextAsset;

    /**
     * 历史记录undo列表
     */
    undoList: (() => void)[] = [];

    /**
     * 获取编辑器资源绝对路径
     * @param url 编辑器资源相对路径
     */
    getEditorAssetPath(url: string)
    {
        return `${document.URL.substring(0, document.URL.lastIndexOf('/') + 1)}resource/${url}`;
    }
}
