import { globalEmitter, GameObject, Scene, shortcut, AssetData } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { drag } from '../drag/Drag';
import { AssetNode } from './AssetNode';
import { editorAsset } from './EditorAsset';

export class AssetFileItemRenderer extends eui.ItemRenderer
{
    public icon: eui.Image;

    declare data: AssetNode;
    itemSelected = false;

    constructor()
    {
        super();
        this.skinName = 'AssetFileItemRenderer';
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);

        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
        this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

        globalEmitter.on('editor.selectedObjectsChanged', this.selectedfilechanged, this);
        this.selectedfilechanged();
    }

    $onRemoveFromStage()
    {
        super.$onRemoveFromStage();
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
        this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);

        globalEmitter.off('editor.selectedObjectsChanged', this.selectedfilechanged, this);
    }

    dataChanged()
    {
        super.dataChanged();

        if (this.data)
        {
            if (this.data.isDirectory)
            {
                drag.register(this, (dragsource) =>
                {
                    this.data.setdargSource(dragsource);
                }, ['assetNodes'], (dragdata) =>
                {
                    this.data.acceptDragDrop(dragdata);
                });
            }
            else
            {
                if (!this.data.isLoaded)
                {
                    const data = this.data;
                    data.load(() =>
                    {
                        console.assert(data.isLoaded);
                        if (data === this.data) this.dataChanged();
                    });

                    return;
                }

                drag.register(this, (dragsource) =>
                {
                    this.data.setdargSource(dragsource);
                }, []);
            }
        }
        else
        {
            drag.unregister(this);
        }
        this.selectedfilechanged();
    }

    private ondoubleclick()
    {
        if (this.data.isDirectory)
        {
            editorAsset.showFloder = this.data;
        }
        else if (this.data.asset instanceof GameObject)
        {
            const scene = this.data.asset.getComponent(Scene);
            if (scene)
            {
                EditorData.editorData.gameScene = scene;
            }
        }
    }

    private onclick()
    {
        // 处理按下shift键时
        const isShift = shortcut.keyState.getKeyState('shift');
        if (isShift)
        {
            const source = (<eui.ArrayCollection>(this.parent as eui.List).dataProvider).source;
            let index = source.indexOf(this.data);
            let min = index; let
                max = index;
            if (EditorData.editorData.selectedAssetNodes.indexOf(preAssetFile) !== -1)
            {
                index = source.indexOf(preAssetFile);
                if (index < min) min = index;
                if (index > max) max = index;
            }
            EditorData.editorData.selectMultiObject(source.slice(min, max + 1));
        }
        else
        {
            EditorData.editorData.selectObject(this.data);
            preAssetFile = this.data;
        }
    }

    private onrightclick(e: egret.Event)
    {
        e.stopPropagation();
        EditorData.editorData.selectObject(this.data);
        editorAsset.popupmenu(this.data);
    }

    private selectedfilechanged()
    {
        let selected = false;
        if (this.data)
        {
            const selectedAssetFile = EditorData.editorData.selectedAssetNodes;
            selected = selectedAssetFile.indexOf(this.data) !== -1;
            if (!selected)
            {
                const assetids = EditorData.editorData.selectedObjects.map((v) => (<AssetData>v).assetId);
                selected = assetids.indexOf(this.data.asset.assetId) !== -1;
            }
        }

        if (this.itemSelected !== selected)
        {
            this.itemSelected = selected;
        }
    }
}
let preAssetFile: AssetNode;
