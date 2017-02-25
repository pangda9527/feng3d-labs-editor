module feng3d.editor
{
	export class OVObject3D extends eui.Component implements IObjectView
	{
		public group: eui.Group;

		private _space: Object3D;
		public constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = <any>objectViewInfo.owner;

			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OVObject3DSkin";
		}

		private onComplete(): void
		{
			this.updateView();
		}

		public get space(): any
		{
			return this._space;
		}

		public set space(value: any)
		{
			this._space = value;
			this.updateView();
		}

		public updateView()
		{

		}

		public getAttributeView(attributeName: string): IObjectAttributeView
		{
			return null;
		}

		public getblockView(blockName: string): IObjectBlockView
		{
			return null;
		}
	}
}