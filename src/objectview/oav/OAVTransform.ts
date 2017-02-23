module feng3d.editor
{
	export class OAVTransform extends eui.Component implements eui.UIComponent
	{
		public vm = new Transform(1, 2, 3, 4, 5, 6);

		public pVector3DView: feng3d.editor.Vector3DView;
		public rVector3DView: feng3d.editor.Vector3DView;
		public sVector3DView: feng3d.editor.Vector3DView;

		public constructor()
		{
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.skinName = "OAVTransformSKin";
		}

		protected partAdded(partName: string, instance: any): void
		{
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();

			data = this.vm;
		}

		private onComplete(): void
		{
			this.pVector3DView.vm = this.vm.position;
			this.rVector3DView.vm = this.vm.rotation;
			this.sVector3DView.vm = this.vm.scale;
			console.log("onComplete");
		}
	}
}
var data;