module feng3d.editor
{
	export class TransformView extends eui.Component implements eui.UIComponent
	{
		public pVector3DView: feng3d.editor.Vector3DView;
		public rVector3DView: feng3d.editor.Vector3DView;
		public sVector3DView: feng3d.editor.Vector3DView;

		private _vm: Transform = new Transform();

		public get vm()
		{
			return this._vm;
		}
		public set vm(value)
		{
			this._vm = value;
			this.updateView();
		}

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "TransformViewSkin";
		}

		private onComplete(): void
		{
			this.updateView();
		}

		private updateView()
		{
			if (this._vm)
			{
				this.pVector3DView.vm = this._vm.position;
				this.rVector3DView.vm = this._vm.rotation;
				this.sVector3DView.vm = this._vm.scale;
			}
		}
	}
}