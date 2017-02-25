module feng3d.editor
{
	export class OVObject3D extends eui.Component implements IObjectView
	{
		private _space: any;
		public constructor(objectViewInfo: ObjectViewInfo)
		{
			super();
			this._space = objectViewInfo.owner;

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