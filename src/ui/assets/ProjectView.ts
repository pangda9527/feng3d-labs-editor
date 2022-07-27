import { globalEmitter, watcher, ticker, Vector2, shortcut, windowEventProxy, Rectangle } from 'feng3d';
import { EditorData } from '../../global/EditorData';
import { editorui } from '../../global/editorui';
import { Modules } from '../../Modules';
import { AreaSelectRect } from '../components/AreaSelectRect';
import { ModuleView } from '../components/TabView';
import { MouseOnDisableScroll } from '../components/tools/MouseOnDisableScroll';
import { drag } from '../drag/Drag';
import { AssetFileItemRenderer } from './AssetFileItemRenderer';
import { AssetTreeItemRenderer } from './AssetTreeItemRenderer';
import { editorAsset } from './EditorAsset';

/**
 * 项目模块视图
 */
export class ProjectView extends eui.Component implements ModuleView
{
    public assetTreeScroller: eui.Scroller;
    public assetTreeList: eui.List;

    public floderpathTxt: eui.Label;
    public includeTxt: eui.TextInput;
    public excludeTxt: eui.TextInput;
    public filelistgroup: eui.Group;
    public floderScroller: eui.Scroller;
    public filelist: eui.List;
    public filepathLabel: eui.Label;
    //
    private _assettreeInvalid = true;
    private listData: eui.ArrayCollection;
    private filelistData: eui.ArrayCollection;

    private fileDrag: FileDrag;
    private _areaSelectRect: AreaSelectRect;

    /**
     * 模块名称
     */
    moduleName: string;
    static moduleName = 'Project';

    constructor()
    {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = 'ProjectView';

        //
        this.moduleName = ProjectView.moduleName;

        editorui.assetview = this;
        //
        this._areaSelectRect = new AreaSelectRect();
        //
        this.fileDrag = new FileDrag(this);
    }

    private onComplete(): void
    {
        this.assetTreeList.itemRenderer = AssetTreeItemRenderer;
        this.filelist.itemRenderer = AssetFileItemRenderer;

        this.floderScroller.viewport = this.filelist;
        this.assetTreeScroller.viewport = this.assetTreeList;

        this.listData = this.assetTreeList.dataProvider = new eui.ArrayCollection();
        this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number)
    {
        super.$onAddToStage(stage, nestLevel);

        this.excludeTxt.text = '';
        this.filepathLabel.text = '';

        //
        drag.register(this.filelistgroup, (_dragsource) => { }, ['gameobject'], (dragSource) =>
        {
            dragSource.getDragData('gameobject').forEach((v) =>
            {
                editorAsset.saveObject(v);
            });
        });

        this.initlist();

        //
        this.fileDrag.addEventListener();

        this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
        this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
        this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
        this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
        this.filelist.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        MouseOnDisableScroll.register(this.filelist);

        this.floderpathTxt.touchEnabled = true;
        this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);

        globalEmitter.on('editor.selectedObjectsChanged', this.selectedfilechanged, this);
        globalEmitter.on('asset.showAsset', this.onShowAsset, this);
    }

    $onRemoveFromStage()
    {
        super.$onRemoveFromStage();

        this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
        this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
        this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
        this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
        this.filelist.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);

        MouseOnDisableScroll.unRegister(this.filelist);

        watcher.unwatch(editorAsset, 'showFloder', this.updateShowFloder, this);

        this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
        globalEmitter.off('editor.selectedObjectsChanged', this.selectedfilechanged, this);
        globalEmitter.on('asset.showAsset', this.onShowAsset, this);

        //
        drag.unregister(this.filelistgroup);

        this.fileDrag.removeEventListener();
    }

    private initlist()
    {
        this.invalidateAssettree();

        editorAsset.rootFile.on('openChanged', this.invalidateAssettree, this);
        editorAsset.rootFile.on('added', this.invalidateAssettree, this);
        editorAsset.rootFile.on('removed', this.invalidateAssettree, this);

        watcher.watch(editorAsset, 'showFloder', this.updateShowFloder, this);
    }

    private update()
    {
        if (this._assettreeInvalid)
        {
            this.updateAssetTree();
            this.updateShowFloder();
            this._assettreeInvalid = false;
        }
    }

    invalidateAssettree()
    {
        this._assettreeInvalid = true;
        ticker.nextframe(this.update, this);
    }

    private updateAssetTree()
    {
        const folders = editorAsset.rootFile.getFolderList();
        this.listData.replaceAll(folders);
    }

    private updateShowFloder(_host?: any, _property?: string, _oldvalue?: any)
    {
        let floder = editorAsset.showFloder;
        if (!floder) return;

        const textFlow = new Array<egret.ITextElement>();
        do
        {
            if (textFlow.length > 0)
            { textFlow.unshift({ text: ' > ' }); }
            textFlow.unshift({ text: floder.label, style: { href: `event:${floder.asset.assetId}` } });
            floder = floder.parent;
        }
        while (floder);
        this.floderpathTxt.textFlow = textFlow;

        const children = editorAsset.showFloder.children;

        let excludeReg: RegExp;
        try
        {
            excludeReg = new RegExp(this.excludeTxt.text);
        }
        catch (error)
        {
            excludeReg = new RegExp('');
        }
        let includeReg: RegExp;
        try
        {
            includeReg = new RegExp(this.includeTxt.text);
        }
        catch (error)
        {
            includeReg = new RegExp('');
        }

        const fileinfos = children.filter((value) =>
        {
            if (this.includeTxt.text)
            {
                if (!includeReg.test(value.label))
                {
                    return false;
                }
            }
            if (this.excludeTxt.text)
            {
                if (excludeReg.test(value.label))
                {
                    return false;
                }
            }

            return true;
        });
        let nodes = fileinfos.map((value) => value);
        nodes = nodes.sort((a, b) =>
        {
            if (a.isDirectory > b.isDirectory)
            {
                return -1;
            }
            if (a.isDirectory < b.isDirectory)
            {
                return 1;
            }
            if (a.label < b.label)
            {
                return -1;
            }

            return 1;
        });

        this.filelistData.replaceAll(nodes);
        this.filelist.scrollV = 0;
        this.selectedfilechanged();
    }

    private onfilter()
    {
        this.updateShowFloder();
    }

    private selectedfilechanged()
    {
        const selectedAssetFile = EditorData.editorData.selectedAssetNodes;
        if (selectedAssetFile.length > 0)
        {
            this.filepathLabel.text = selectedAssetFile.map((v) =>
                v.asset.fileName + v.asset.extenson).join(',');
        }
        else
        { this.filepathLabel.text = ''; }
    }

    private onShowAsset()
    {

    }

    private onfilelistclick(e: egret.MouseEvent)
    {
        if (e.target === this.filelist)
        {
            EditorData.editorData.clearSelectedObjects();
        }
    }

    private onfilelistrightclick(_e: egret.MouseEvent)
    {
        EditorData.editorData.clearSelectedObjects();

        editorAsset.popupmenu(editorAsset.showFloder);
    }

    private onfloderpathTxtLink(evt: egret.TextEvent)
    {
        editorAsset.showFloder = editorAsset.getAssetByID(evt.text);
    }

    private areaSelectStartPosition: Vector2;
    private onMouseDown(e: egret.MouseEvent)
    {
        if (e.target !== this.filelist) return;
        if (shortcut.getState('splitGroupDraging')) return;

        this.areaSelectStartPosition = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        windowEventProxy.on('mousemove', this.onMouseMove, this);
        windowEventProxy.on('mouseup', this.onMouseUp, this);
    }

    private onMouseMove()
    {
        let areaSelectEndPosition = new Vector2(windowEventProxy.clientX, windowEventProxy.clientY);
        const rectangle = this.filelist.getGlobalBounds();
        //
        areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
        //
        this._areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
        //
        const min = this.areaSelectStartPosition.clone().min(areaSelectEndPosition);
        const max = this.areaSelectStartPosition.clone().max(areaSelectEndPosition);
        const areaRect = new Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
        //
        const datas = this.filelist.$indexToRenderer.filter((v) =>
        {
            const rectangle = v.getGlobalBounds();

            return areaRect.intersects(rectangle);
        }).map((v) => v.data);
        EditorData.editorData.selectMultiObject(datas);
    }

    private onMouseUp()
    {
        this._areaSelectRect.hide();
        windowEventProxy.off('mousemove', this.onMouseMove, this);
        windowEventProxy.off('mouseup', this.onMouseUp, this);
    }
}

class FileDrag
{
    addEventListener: () => void;
    removeEventListener: () => void;

    constructor(displayobject: egret.DisplayObject)
    {
        this.addEventListener = () =>
        {
            document.addEventListener('dragenter', dragenter, false);
            document.addEventListener('dragover', dragover, false);
            document.addEventListener('drop', drop, false);
        };

        this.removeEventListener = () =>
        {
            document.removeEventListener('dragenter', dragenter, false);
            document.removeEventListener('dragover', dragover, false);
            document.removeEventListener('drop', drop, false);
        };

        function dragenter(e)
        {
            e.stopPropagation();
            e.preventDefault();
        }
        function dragover(e)
        {
            e.stopPropagation();
            e.preventDefault();
        }
        function drop(e: DragEvent)
        {
            e.stopPropagation();
            e.preventDefault();
            const dt = e.dataTransfer;
            const fileList = dt.files;
            const files = [];
            for (let i = 0; i < fileList.length; i++)
            {
                files[i] = fileList[i];
            }
            if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY))
            {
                editorAsset.inputFiles(files);
            }
        }
    }
}

Modules.moduleViewCls[ProjectView.moduleName] = ProjectView;
