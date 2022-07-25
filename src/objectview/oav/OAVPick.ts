import { OAVComponent, AttributeViewInfo, watcher, Texture2D, TextureCube, AudioAsset, ScriptAsset, Material, Geometry } from 'feng3d';
import { editorRS } from '../../assets/EditorRS';
import { EditorData } from '../../global/EditorData';
import { menu, MenuItem } from '../../ui/components/Menu';
import { DragDataMap, drag } from '../../ui/drag/Drag';
import { OAVBase } from './OAVBase';

/**
 * 挑选（拾取）OAV界面
 */
@OAVComponent()
export class OAVPick extends OAVBase
{
    public labelLab: eui.Label;
    public text: eui.Label;
    public pickBtn: eui.Button;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = 'OAVPick';
    }

    initView()
    {
        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);

        if (this._attributeViewInfo.editable)
        {
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);

            const param: { accepttype: keyof DragDataMap; datatype: string; } = this._attributeViewInfo.componentParam;
            drag.register(this,
                (dragsource) =>
                {
                    if (param.datatype) dragsource.addDragData(param.datatype as any, this.attributeValue);
                },
                [param.accepttype],
                (dragSource) =>
                {
                    this.attributeValue = dragSource.getDragData(param.accepttype)[0];
                });
        }

        watcher.watch(this.space, this.attributeName, this.updateView, this);
    }

    dispose()
    {
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);

        drag.unregister(this);
        watcher.unwatch(this.space, this.attributeName, this.updateView, this);
    }

    private onPickBtnClick()
    {
        const param: { accepttype: keyof DragDataMap; datatype: string; } = this._attributeViewInfo.componentParam;
        if (param.accepttype)
        {
            if (param.accepttype === 'texture2d')
            {
                const menus: MenuItem[] = [];
                const texture2ds = editorRS.getLoadedAssetDatasByType(Texture2D);
                texture2ds.forEach((item) =>
                {
                    menus.push({
                        label: item.name, click: () =>
                        {
                            this.attributeValue = item;
                        }
                    });
                });
                menu.popup(menus);
            }
            else if (param.accepttype === 'texturecube')
            {
                const menus: MenuItem[] = [];
                const textureCubes = editorRS.getLoadedAssetDatasByType(TextureCube);
                textureCubes.forEach((item) =>
                {
                    menus.push({
                        label: item.name, click: () =>
                        {
                            this.attributeValue = item;
                        }
                    });
                });
                menu.popup(menus);
            }
            else if (param.accepttype === 'audio')
            {
                const menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = ''; } }];

                const audioFiles = editorRS.getAssetsByType(AudioAsset);
                audioFiles.forEach((item) =>
                {
                    menus.push({
                        label: item.fileName, click: () =>
                        {
                            this.attributeValue = item.assetPath;
                        }
                    });
                }, []);
                menu.popup(menus);
            }
            else if (param.accepttype === 'file_script')
            {
                const scriptFiles = editorRS.getAssetsByType(ScriptAsset);

                const menus: MenuItem[] = [{ label: `None`, click: () => { this.attributeValue = null; } }];
                scriptFiles.forEach((element) =>
                {
                    menus.push({
                        label: element.scriptName,
                        click: () =>
                        {
                            this.attributeValue = element.scriptName;
                        }
                    });
                });
                menu.popup(menus);
            }
            else if (param.accepttype === 'material')
            {
                const assets = editorRS.getLoadedAssetDatasByType(Material);
                const menus: MenuItem[] = [];
                assets.forEach((element) =>
                {
                    menus.push({
                        label: element.name,
                        click: () =>
                        {
                            this.attributeValue = element;
                        }
                    });
                });
                menu.popup(menus);
            }
            else if (param.accepttype === 'geometry')
            {
                const geometrys = editorRS.getLoadedAssetDatasByType(Geometry);
                const menus: MenuItem[] = [];
                geometrys.forEach((element) =>
                {
                    menus.push({
                        label: element.name,
                        click: () =>
                        {
                            this.attributeValue = element;
                        }
                    });
                });
                menu.popup(menus);
            }
        }
    }

    /**
     * 更新界面
     */
    updateView(): void
    {
        if (this.attributeValue === undefined)
        {
            this.text.text = String(this.attributeValue);
        }
        else if (!(this.attributeValue instanceof Object))
        {
            this.text.text = String(this.attributeValue);
        }
        else
        {
            this.text.text = this.attributeValue['name'] || '';
            this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        }
    }

    private onDoubleClick()
    {
        if (this.attributeValue && typeof this.attributeValue === 'object')
        {
            EditorData.editorData.selectObject(this.attributeValue);
        }
    }
}
