module feng3d.editor
{
    export class SceneControl
    {
        private dragSceneMousePoint: Point;
        private dragSceneCameraGlobalMatrix3D: Matrix3D;

        constructor()
        {
            shortcut.addEventListener("dragSceneStart", this.onDragSceneStart, this);
            shortcut.addEventListener("dragScene", this.onDragScene, this);
        }

        private onDragSceneStart()
        {
            this.dragSceneMousePoint = new Point(input.clientX, input.clientY);
            this.dragSceneCameraGlobalMatrix3D = editor3DData.camera3D.globalMatrix3D.clone();
        }

        private onDragScene()
        {
            var mousePoint = new Point(input.clientX, input.clientY);
            var addPoint = mousePoint.subtract(this.dragSceneMousePoint);
            var scale = editor3DData.view3D.getScaleByDepth(300);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scaleBy(addPoint.y * scale);
            right.scaleBy(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editor3DData.camera3D.object3D.transform.globalMatrix3D = globalMatrix3D;
        }
    }
    export var sceneControl = new SceneControl();
}