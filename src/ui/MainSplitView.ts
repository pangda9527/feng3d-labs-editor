import { globalEmitter, IEvent } from 'feng3d';
import { editorcache } from '../caches/Editorcache';
import { viewLayoutConfig } from '../configs/ViewLayoutConfig';
import { modules } from '../Modules';
import { SplitGroup } from './components/SplitGroup';
import { TabView } from './components/TabView';

/**
 * 主分割界面
 *
 * 用于管理分割界面，以及处理界面布局
 */
export class MainSplitView extends eui.Component implements eui.UIComponent
{
    private view: SplitGroup;

    constructor()
    {
        super();
        this.skinName = 'MainSplitView';
    }

    protected childrenCreated(): void
    {
        super.childrenCreated();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

        if (this.stage)
        {
            this.onAddedToStage();
        }
    }

    private onAddedToStage()
    {
        globalEmitter.on('viewLayout.changed', this._saveViewLayout, this);
        globalEmitter.on('viewLayout.reset', this._resetLayout, this);

        this._initViewLayout();
    }

    private onRemovedFromStage()
    {
        globalEmitter.off('viewLayout.changed', this._saveViewLayout, this);
        globalEmitter.off('viewLayout.reset', this._resetLayout, this);
    }

    private _initViewLayout()
    {
        if (!this.view)
        {
            editorcache.viewLayout = editorcache.viewLayout || viewLayoutConfig.Default;
            //
            this.view = this._createViews(editorcache.viewLayout) as any;
            this.addChild(this.view);
        }
    }

    private _saveViewLayout()
    {
        const sp = this.getChildAt(0);

        const data = this._getData(sp);

        editorcache.viewLayout = data;
    }

    private _resetLayout(event: IEvent<Object>)
    {
        editorcache.viewLayout = event.data || viewLayoutConfig.Default;

        if (this.view)
        {
            this.view.remove();
            this._resolve(this.view);
            this.view = null;
        }
        this._initViewLayout();
    }

    private _resolve(sp: egret.DisplayObject)
    {
        if (sp instanceof SplitGroup)
        {
            sp.$children.forEach((v) => this._resolve(v));
        }
        if (sp instanceof TabView)
        {
            sp['_moduleViews'].forEach((v) =>
            {
                modules.recycleModuleView(v);
            });
        }
    }

    private _getData(sp: egret.DisplayObject)
    {
        const data: any = {};
        data.x = sp.x;
        data.y = sp.y;
        data.width = sp.width;
        data.height = sp.height;
        if (sp instanceof eui.Group || sp instanceof eui.Component)
        {
            data.percentWidth = sp.percentWidth;
            data.percentHeight = sp.percentHeight;
            data.top = sp.top;
            data.bottom = sp.bottom;
            data.left = sp.left;
            data.right = sp.right;
        }
        if (sp instanceof SplitGroup)
        {
            data.type = 'SplitGroup';
            if (sp.layout instanceof eui.HorizontalLayout)
            {
                data.layout = 'HorizontalLayout';
            }
            else if (sp.layout instanceof eui.VerticalLayout)
            {
                data.layout = 'VerticalLayout';
            }
            const children = [];
            for (let i = 0; i < sp.numChildren; i++)
            {
                const element = sp.getChildAt(i);
                children[i] = this._getData(element);
            }
            data.children = children;
        }
        if (sp instanceof TabView)
        {
            data.type = 'TabView';
            data.modules = sp.getModuleNames();
        }

        return data;
    }

    private _createViews(data: any): egret.DisplayObject
    {
        let displayObject: egret.DisplayObject;

        if (data.type === 'SplitGroup')
        {
            const splitGroup = displayObject = new SplitGroup();
            if (data.layout === 'HorizontalLayout')
            {
                const horizontalLayout = splitGroup.layout = new eui.HorizontalLayout();
                horizontalLayout.gap = 2;
            }
            else if (data.layout === 'VerticalLayout')
            {
                const verticalLayout = splitGroup.layout = new eui.VerticalLayout();
                verticalLayout.gap = 2;
            }
            const children = data.children;
            for (let i = 0; i < children.length; i++)
            {
                const child = this._createViews(children[i]);
                splitGroup.addChild(child);
            }
        }
        else if (data.type === 'TabView')
        {
            const tabView = displayObject = new TabView();
            tabView.setModuleNames(data.modules);
        }
        if (displayObject instanceof eui.Group || displayObject instanceof eui.Component)
        {
            if (data.percentWidth === null || data.percentWidth === undefined) data.percentWidth = NaN;
            if (data.percentHeight === null || data.percentHeight === undefined) data.percentHeight = NaN;
            if (data.top === null || data.top === undefined) data.top = NaN;
            if (data.bottom === null || data.bottom === undefined) data.bottom = NaN;
            if (data.left === null || data.left === undefined) data.left = NaN;
            if (data.right === null || data.right === undefined) data.right = NaN;
            //
            displayObject.percentWidth = data.percentWidth;
            displayObject.percentHeight = data.percentHeight;
            displayObject.top = data.top;
            displayObject.bottom = data.bottom;
            displayObject.left = data.left;
            displayObject.right = data.right;
        }
        displayObject.x = data.x;
        displayObject.y = data.y;
        displayObject.width = data.width;
        displayObject.height = data.height;

        return displayObject;
    }
}
