declare namespace feng3d.editor {
    class Object3DControllerToolBase extends Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix3D;
        protected _object3DControllerTarget: Object3DControllerTarget;
        constructor(gameObject: GameObject);
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected toolModel: Component;
        selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateRotationAxis | CoordinateRotationFreeAxis | CoordinateScaleCube;
        object3DControllerTarget: Object3DControllerTarget;
        protected updateToolModel(): void;
        protected onMouseDown(): void;
        protected onMouseUp(): void;
        protected onScenetransformChanged(): void;
        protected onCameraScenetransformChanged(): void;
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross(): Vector3D;
        protected getMousePlaneCross(): Vector3D;
    }
}
