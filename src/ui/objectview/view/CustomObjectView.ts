module feng3d {

	export class CustomObjectView extends egret.Sprite implements IObjectView {
		private _space: any;

		public constructor(objectViewInfo: ObjectViewInfo) {
			super();
			this._space = objectViewInfo.owner;
			var label: egret.TextField;
			label = new egret.TextField();
			label.text = "自定义对象界面_" + egret.getQualifiedClassName(this._space);
			label.textColor = 0xff00ff;
			label.width = 100;
			label.wordWrap = true;
			this.addChild(label);
			this.updateView();
		}

		public get space(): any {
			return this._space;
		}

		public set space(value: any) {
			this._space = value;
			this.updateView();
		}

		public updateView() {
		}

		public getAttributeView(attributeName: string): IObjectAttributeView {
			return null;
		}

		public getblockView(blockName: string): IObjectBlockView {
			return null;
		}

	}
}
