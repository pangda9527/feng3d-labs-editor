module feng3d.editor {
	export class BooleanAttrView extends eui.Group implements feng3d.IObjectAttributeView {
		private _space: any;
		private _attributeName: string;
		private _attributeType: string;
		private label: eui.Label;
		private checkBox: eui.CheckBox;

		public constructor(attributeViewInfo: feng3d.AttributeViewInfo) {
			super();
			this._space = attributeViewInfo["owner"];
			this._attributeName = attributeViewInfo["name"];
			this._attributeType = attributeViewInfo["type"];
			this.label = new eui.Label();
			this.label.width = 100;
			this.label.height = 20;
			this.addChild(this.label);
			this.checkBox = new eui.CheckBox();
			this.checkBox.x = 100;
			this.checkBox.y = 5;
			this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
			this.addChild(this.checkBox);
			this.label.text = this._attributeName;
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
			this.checkBox["selected"] = this.attributeValue;
		}

		protected onChange(event: egret.Event) {
			this.attributeValue = this.checkBox["selected"];
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
				var objectViewEvent = <any>new ObjectViewEvent(ObjectViewEvent.VALUE_CHANGE, true);
				objectViewEvent.space = this._space;
				objectViewEvent.attributeName = this._attributeName;
				objectViewEvent.attributeValue = this.attributeValue;
				this.dispatchEvent(objectViewEvent);
			}
		}
	}
}
