import { MTool } from "./MTool";
import { RTool } from "./RTool";
import { STool } from "./STool";
import { MRSToolBase } from "./MRSToolBase";
import { editorData, MRSToolType } from "../../global/EditorData";

// namespace feng3d { export interface ComponentMap { MRSTool: editor.MRSTool } }

/**
 * 设置永久可见
 */
function setAwaysVisible(component: feng3d.Component)
{
    var models = component.getComponentsInChildren(feng3d.Model);
    models.forEach(element =>
    {
        if (element.material && !element.material.assetId)
        {
            element.material.renderParams.depthtest = false;
        }
    });
}

/**
 * 位移旋转缩放工具
 */
export class MRSTool extends feng3d.Component
{
    private mTool: MTool;
    private rTool: RTool;
    private sTool: STool;

    private _currentTool: MRSToolBase;

    private mrsToolObject: feng3d.GameObject;

    init(gameObject: feng3d.GameObject)
    {
        super.init(gameObject);

        this.mrsToolObject = Object.setValue(new feng3d.GameObject(), { name: "MRSTool" });

        this.mTool = Object.setValue(new feng3d.GameObject(), { name: "MTool" }).addComponent(MTool);
        this.rTool = Object.setValue(new feng3d.GameObject(), { name: "RTool" }).addComponent(RTool);
        this.sTool = Object.setValue(new feng3d.GameObject(), { name: "STool" }).addComponent(STool);
        setAwaysVisible(this.mTool);
        setAwaysVisible(this.rTool);
        setAwaysVisible(this.sTool);
        //
        this.currentTool = this.mTool;
        //
        feng3d.dispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
        feng3d.dispatcher.on("editor.toolTypeChanged", this.onToolTypeChange, this);
    }

    dispose()
    {
        //
        this.currentTool = null;
        //
        this.mrsToolObject.dispose();
        this.mrsToolObject = null;
        //
        this.mTool.dispose();
        this.mTool = null;
        this.rTool.dispose();
        this.rTool = null;
        this.sTool.dispose();
        this.sTool = null;
        //
        feng3d.dispatcher.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
        feng3d.dispatcher.off("editor.toolTypeChanged", this.onToolTypeChange, this);

        super.dispose();
    }

    private onSelectedGameObjectChange()
    {
        var objects = editorData.selectedGameObjects.filter(v => !(v.hideFlags & feng3d.HideFlags.DontTransform));

        //筛选出 工具控制的对象
        if (objects.length > 0)
        {
            this.gameObject.addChild(this.mrsToolObject);
        }
        else
        {
            this.mrsToolObject.remove();
        }
    }

    private onToolTypeChange()
    {
        switch (editorData.toolType)
        {
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
    }

    private set currentTool(value)
    {
        if (this._currentTool == value)
            return;
        if (this._currentTool)
        {
            this._currentTool.gameObject.remove();
        }
        this._currentTool = value;
        if (this._currentTool)
        {
            this.mrsToolObject.addChild(this._currentTool.gameObject);
        }
    }
}