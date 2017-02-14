module feng3d.editor {
	export class CustomBlockView extends egret.Sprite implements IObjectBlockView {
		private _space: any;
		private _blockName: string;

		public constructor(blockViewInfo: BlockViewInfo) {
			super();
			var _self__: any = this;
			this._blockName = blockViewInfo["name"];
			this._space = blockViewInfo["owner"];
			var label: egret.TextField;
			label = new egret.TextField();
			label.text = "自定义块界面_(blockName:" + this._blockName + ")";
			label.textColor = 0xff00ff;
			label.width = 100;
			label.wordWrap = true;
			_self__.addChild(label);
			this.updateView();
		}

		public get space(): any {
			return this._space;
		}

		public set space(value: any) {
			this._space = value;
			this.updateView();
		}

		public get blockName(): string {
			return this._blockName;
		}

		public updateView() {
		}

		public getAttributeView(attributeName: string): IObjectAttributeView {
			return null;
		}

	}
}