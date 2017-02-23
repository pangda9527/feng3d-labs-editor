module feng3d.editor
{
	export class OAVVector3D extends eui.Component implements eui.UIComponent
	{
		private _data = new Vector3D();

		public label: eui.Label;
		public vector3DView: feng3d.editor.Vector3DView;

		public get data()
		{
			return this._data;
		}

		public set data(value: Vector3D)
		{
			this._data = value;
			if (this.vector3DView)
				this.vector3DView.vm = this._data;
		}

		public constructor()
		{
			super();
		}

		protected partAdded(partName: string, instance: any): void
		{
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();

			this.vector3DView.vm = this.data;
		}
	}
}