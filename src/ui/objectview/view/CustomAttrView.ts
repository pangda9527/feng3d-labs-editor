module feng3d.editor {

	export class CustomAttrView extends egret.Sprite implements IObjectAttributeView {
		private _space: any;
		private _attributeName: string;
		private _attributeType: string;
		private label: egret.TextField;

		public constructor(attributeViewInfo: AttributeViewInfo) {
			super();
			this._space = attributeViewInfo["owner"];
			this._attributeName = attributeViewInfo["name"];
			this._attributeType = attributeViewInfo["type"];
			var label: egret.TextField;
			label = new egret.TextField();
			label.text = "自定义属性界面_" + this._attributeName;
			label.textColor = 0xffff00;
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

		public get attributeName(): string {
			return this._attributeName;
		}

		public get attributeValue(): any {
			return this._space[this._attributeName];
		}

		public set attributeValue(value: any) {
			if (this._space[this._attributeName] != value) {
				this._space[this._attributeName] = value;
				var objectViewEvent: ObjectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
				objectViewEvent.space = this._space;
				objectViewEvent.attributeName = this._attributeName;
				objectViewEvent.attributeValue = this.attributeValue;
				this.dispatchEvent(objectViewEvent);
			}
		}

		public updateView() {
		}

	}
}