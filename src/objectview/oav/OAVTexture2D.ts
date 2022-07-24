import { OAVComponent, AttributeViewInfo, watcher, Texture2D, ReadRS } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { menu, MenuItem } from '../../ui/components/Menu';
import { OAVBase } from './OAVBase';

/**
 * 挑选（拾取）OAV界面
 */
@OAVComponent()
export class OAVTexture2D extends OAVBase
{
    public image: eui.Image;
    public pickBtn: eui.Button;
    public labelLab: eui.Label;

    constructor(attributeViewInfo: AttributeViewInfo)
    {
        super(attributeViewInfo);

        this.skinName = "OAVTexture2D";
    }

    initView()
    {
        this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);

        if (this._attributeViewInfo.editable)
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

        watcher.watch(this.space, this.attributeName, this.updateView, this);
    }

    dispose()
    {
        this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
        this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);

        watcher.unwatch(this.space, this.attributeName, this.updateView, this);
    }

    private ontxtClick()
    {
        var menus: MenuItem[] = [];
        var texture2ds = ReadRS.rs.getLoadedAssetDatasByType(Texture2D);
        texture2ds.forEach(texture2d =>
        {
            menus.push({
                label: texture2d.name, click: () =>
                {
                    this.attributeValue = texture2d;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                }
            });
        });
        menu.popup(menus);
    }

    /**
     * 更新界面
     */
    updateView(): void
    {
        var texture: Texture2D = this.attributeValue;
        this.image.source = texture.dataURL;
    }

    private onDoubleClick()
    {
        if (this.attributeValue && typeof this.attributeValue == "object")
            EditorData.editorData.selectObject(this.attributeValue);
    }
}
