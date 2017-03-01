module feng3d.editor
{
    export class Object3DControllerToolBase extends Object3D
    {
        protected _selectedObject3D: Object3D;
        protected toolModel: Object3D;

        constructor()
        {
            super();

            Binding.bindProperty(Editor3DData.instance, ["selectedObject3D"], this, "selectedObject3D");
        }

        protected get selectedObject3D()
        {
            return this._selectedObject3D;
        }
        protected set selectedObject3D(value)
        {
            if (this._selectedObject3D == value)
                return;
            if (this._selectedObject3D)
            {
                this.removeChild(this.toolModel);
                this._selectedObject3D.removeEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
            }
            this._selectedObject3D = value;
            if (this._selectedObject3D)
            {
                this.addChild(this.toolModel);
                this.toolModel.transform.globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
                this._selectedObject3D.addEventListener(TransfromEvent.SCENETRANSFORM_CHANGED, this.onScenetransformChanged, this);
            }
        }

        protected onScenetransformChanged()
        {
            this.toolModel.transform.globalMatrix3D = this._selectedObject3D.transform.globalMatrix3D;
        }
    }
}