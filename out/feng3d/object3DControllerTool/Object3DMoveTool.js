var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var feng3d;
(function (feng3d) {
    var editor;
    (function (editor) {
        var Object3DMoveTool = (function (_super) {
            __extends(Object3DMoveTool, _super);
            function Object3DMoveTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DMoveModel);
                return _this;
            }
            Object3DMoveTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            Object3DMoveTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xzPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.xyPlane.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            Object3DMoveTool.prototype.onItemMouseDown = function (event) {
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var po = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 0));
                var px = globalMatrix3D.transformVector(new feng3d.Vector3D(1, 0, 0));
                var py = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 1, 0));
                var pz = globalMatrix3D.transformVector(new feng3d.Vector3D(0, 0, 1));
                //
                var ox = px.subtract(po);
                var oy = py.subtract(po);
                var oz = pz.subtract(po);
                //摄像机前方方向
                var cameraSceneTransform = editor.editor3DData.camera.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedGameObject = event.currentTarget;
                //
                switch (selectedGameObject) {
                    case this.toolModel.xAxis.gameObject:
                        this.selectedItem = this.toolModel.xAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yAxis.gameObject:
                        this.selectedItem = this.toolModel.yAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zAxis.gameObject:
                        this.selectedItem = this.toolModel.zAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.yzPlane.gameObject:
                        this.selectedItem = this.toolModel.yzPlane;
                        this.movePlane3D.fromPoints(po, py, pz);
                        this.changeXYZ.setTo(0, 1, 1);
                        break;
                    case this.toolModel.xzPlane.gameObject:
                        this.selectedItem = this.toolModel.xzPlane;
                        this.movePlane3D.fromPoints(po, px, pz);
                        this.changeXYZ.setTo(1, 0, 1);
                        break;
                    case this.toolModel.xyPlane.gameObject:
                        this.selectedItem = this.toolModel.xyPlane;
                        this.movePlane3D.fromPoints(po, px, py);
                        this.changeXYZ.setTo(1, 1, 0);
                        break;
                    case this.toolModel.oCube.gameObject:
                        this.selectedItem = this.toolModel.oCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                //
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.startPos = this.toolModel.transform.position;
                this.object3DControllerTarget.startTranslation();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            };
            Object3DMoveTool.prototype.onMouseMove = function () {
                var crossPos = this.getLocalMousePlaneCross();
                var addPos = crossPos.subtract(this.startPlanePos);
                addPos.x *= this.changeXYZ.x;
                addPos.y *= this.changeXYZ.y;
                addPos.z *= this.changeXYZ.z;
                var sceneTransform = this.startSceneTransform.clone();
                sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
                var sceneAddpos = sceneTransform.position.subtract(this.startSceneTransform.position);
                this.object3DControllerTarget.translation(sceneAddpos);
            };
            Object3DMoveTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.off("mousemove", this.onMouseMove, this);
                this.object3DControllerTarget.stopTranslation();
                this.startPos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
                this.updateToolModel();
            };
            Object3DMoveTool.prototype.updateToolModel = function () {
                //鼠标按下时不更新
                if (this.ismouseDown)
                    return;
                var cameraPos = editor.editor3DData.camera.transform.scenePosition;
                var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
                this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
                this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
                this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
                this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
            };
            return Object3DMoveTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DMoveTool = Object3DMoveTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DMoveTool.js.map