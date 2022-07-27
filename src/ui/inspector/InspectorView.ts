import { IEvent, globalEmitter, Feng3dObject, HideFlags, objectview, FileAsset, ReadRS } from 'feng3d';
import { editorRS } from '../../assets/EditorRS';
import { EditorData } from '../../global/EditorData';
import { Modules } from '../../Modules';
import { ObjectViewEvent } from '../../objectview/events/ObjectViewEvent';
import { AssetNode } from '../assets/AssetNode';
import { editorAsset } from '../assets/EditorAsset';
import { ModuleView } from '../components/TabView';
import { inspectorMultiObject } from './InspectorMultiObject';

/**
 * 属性面板（检查器）
 */
export class InspectorView extends eui.Component implements ModuleView
{
	static moduleName = 'Inspector';

	public typeLab: eui.Label;
	public backButton: eui.Button;
	public group: eui.Group;
	public emptyLabel: eui.Label;

	moduleName: string;

	constructor()
	{
		super();
		this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = 'InspectorViewSkin';
		this.moduleName = InspectorView.moduleName;
	}

	/**
	 * 历史选中对象列表
	 */
	private _historySelectedObject = [];

	/**
	 * 最多存储历史选中对象数量
	 */
	private _maxHistorySelectedObject = 10;

	get historySelectedObjectLength()
	{
		return this._historySelectedObject.length;
	}

	/**
	 *
	 */
	preSelectedObjects()
	{
		this._historySelectedObject.pop();
		const v = this._historySelectedObject.pop();
		EditorData.editorData.selectedObjects = v;
	}

	private showData(data: any)
	{
		if (this._viewData === data) return;
		if (this._viewData)
		{
			this.saveShowData();
		}

		//
		this._viewData = data;
		this.updateView();
	}

	private onSaveShowData(event: IEvent<() => void>)
	{
		this.saveShowData(event.data);
	}

	private updateView()
	{
		this.typeLab.text = ``;
		this.backButton.visible = this._historySelectedObject.length > 1;
		if (this._view && this._view.parent)
		{
			this._view.parent.removeChild(this._view);
		}
		if (this.emptyLabel.parent)
		{ this.emptyLabel.parent.removeChild(this.emptyLabel); }
		if (this._viewData)
		{
			if (this._viewData instanceof AssetNode)
			{
				if (this._viewData.isDirectory) return;
				if (this._viewData.asset)
				{
					this.updateShowData(this._viewData.asset);
				}
				else
					if (!this._viewData.isLoaded)
					{
						const viewData = this._viewData;
						viewData.load(() =>
						{
							console.assert(!!viewData.asset);
							if (viewData === this._viewData)
							{ this.updateShowData(viewData.asset); }
						});
					}
			}
			else
			{
				this.updateShowData(this._viewData);
			}
		}
		else
		{
			this.group.addChild(this.emptyLabel);
		}
	}

	/**
	 * 保存显示数据
	 */
	private saveShowData(callback?: () => void)
	{
		if (this._dataChanged)
		{
			if (this._viewData.assetId)
			{
				const feng3dAsset = ReadRS.rs.getAssetById(this._viewData.assetId);
				if (feng3dAsset)
				{
					editorRS.writeAsset(feng3dAsset, (err) =>
					{
						console.assert(!err, `资源 ${feng3dAsset.assetId} 保存失败！`);
						callback && callback();
					});
				}
			}
			else if (this._viewData instanceof AssetNode)
			{
				editorAsset.saveAsset(this._viewData);
			}

			this._dataChanged = false;
		}
		else
		{
			callback && callback();
		}
	}

	//
	private _view: eui.Component;
	private _viewData: any;
	private _dataChanged = false;

	private onComplete(): void
	{
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		if (this.stage)
		{
			this.onAddedToStage();
		}
	}

	private onAddedToStage()
	{
		this.backButton.visible = this._historySelectedObject.length > 1;

		this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
		globalEmitter.on('editor.selectedObjectsChanged', this.onSelectedObjectsChanged, this);
		//
		globalEmitter.on('inspector.update', this.updateView, this);
		globalEmitter.on('inspector.saveShowData', this.onSaveShowData, this);

		//
		this.updateView();
	}

	private onRemovedFromStage()
	{
		this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
		globalEmitter.off('editor.selectedObjectsChanged', this.onSelectedObjectsChanged, this);
		//
		globalEmitter.off('inspector.update', this.updateView, this);
		globalEmitter.off('inspector.saveShowData', this.onSaveShowData, this);
	}

	private onSelectedObjectsChanged()
	{
		this._historySelectedObject.push(EditorData.editorData.selectedObjects);
		if (this._historySelectedObject.length > this._maxHistorySelectedObject) this._historySelectedObject.shift();

		const data = inspectorMultiObject.convertInspectorObject(EditorData.editorData.selectedObjects);
		this.showData(data);
	}

	private updateShowData(showdata: Object)
	{
		this.typeLab.text = `${showdata.constructor['name']}`;
		if (this._view)
		{ this._view.removeEventListener(ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this); }
		let editable = true;
		if (showdata instanceof Feng3dObject) editable = !(showdata.hideFlags & HideFlags.NotEditable);
		this._view = objectview.getObjectView(showdata, { editable });
		// this._view.percentWidth = 100;
		this.group.addChild(this._view);
		this.group.scrollV = 0;
		this._view.addEventListener(ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
	}

	private onValueChanged(_e: ObjectViewEvent)
	{
		this._dataChanged = true;
		if (this._viewData instanceof FileAsset)
		{
			if (this._viewData.assetId)
			{
				const assetNode = editorAsset.getAssetByID(this._viewData.assetId);
				assetNode && assetNode.updateImage();
			}
		}
		else if (this._viewData instanceof AssetNode)
		{
			this._viewData.updateImage();
		}
	}

	private onBackButton()
	{
		this.preSelectedObjects();
	}
}

Modules.moduleViewCls[InspectorView.moduleName] = InspectorView;
