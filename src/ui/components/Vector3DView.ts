module feng3d.editor
{
	export class Vector3DView extends eui.Component implements eui.UIComponent
	{
		public vm = new Vector3D(1,2,3);

		public constructor()
		{
			super();
			this.skinName = "Vector3DViewSkin";
		}

		protected partAdded(partName: string, instance: any): void
		{
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void
		{
			super.childrenCreated();
		}
	}
}