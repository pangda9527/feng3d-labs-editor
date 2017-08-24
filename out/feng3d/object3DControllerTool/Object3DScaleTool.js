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
        var Object3DScaleTool = (function (_super) {
            __extends(Object3DScaleTool, _super);
            function Object3DScaleTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                /**
                 * 用于判断是否改变了XYZ
                 */
                _this.changeXYZ = new feng3d.Vector3D();
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DScaleModel);
                return _this;
            }
            Object3DScaleTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            Object3DScaleTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zCube.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.oCube.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            Object3DScaleTool.prototype.onItemMouseDown = function (event) {
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
                switch (selectedGameObject) {
                    case this.toolModel.xCube.gameObject:
                        this.selectedItem = this.toolModel.xCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(ox).crossProduct(ox), po);
                        this.changeXYZ.setTo(1, 0, 0);
                        break;
                    case this.toolModel.yCube.gameObject:
                        this.selectedItem = this.toolModel.yCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oy).crossProduct(oy), po);
                        this.changeXYZ.setTo(0, 1, 0);
                        break;
                    case this.toolModel.zCube.gameObject:
                        this.selectedItem = this.toolModel.zCube;
                        this.movePlane3D.fromNormalAndPoint(cameraDir.crossProduct(oz).crossProduct(oz), po);
                        this.changeXYZ.setTo(0, 0, 1);
                        break;
                    case this.toolModel.oCube.gameObject:
                        this.selectedItem = this.toolModel.oCube;
                        this.startMousePos = editor.editor3DData.mouseInView3D.clone();
                        this.changeXYZ.setTo(1, 1, 1);
                        break;
                }
                this.startSceneTransform = globalMatrix3D.clone();
                this.startPlanePos = this.getLocalMousePlaneCross();
                this.object3DControllerTarget.startScale();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            };
            Object3DScaleTool.prototype.onMouseMove = function () {
                var addPos = new feng3d.Vector3D();
                var addScale = new feng3d.Vector3D();
                if (this.selectedItem == this.toolModel.oCube) {
                    var currentMouse = editor.editor3DData.mouseInView3D;
                    var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                    addPos.setTo(distance, distance, distance);
                    var scale = 1 + (addPos.x + addPos.y) / (editor.editor3DData.view3DRect.height);
                    addScale.setTo(scale, scale, scale);
                }
                else {
                    var crossPos = this.getLocalMousePlaneCross();
                    var offset = crossPos.subtract(this.startPlanePos);
                    if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                        addScale.x = offset.x / this.startPlanePos.x;
                    }
                    if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                        addScale.y = offset.y / this.startPlanePos.y;
                    }
                    if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                        addScale.z = offset.z / this.startPlanePos.z;
                    }
                    addScale.x += 1;
                    addScale.y += 1;
                    addScale.z += 1;
                }
                this.object3DControllerTarget.doScale(addScale);
                //
                this.toolModel.xCube.scaleValue = addScale.x;
                this.toolModel.yCube.scaleValue = addScale.y;
                this.toolModel.zCube.scaleValue = addScale.z;
            };
            Object3DScaleTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.off("mousemove", this.onMouseMove, this);
                this.startPlanePos = null;
                this.startSceneTransform = null;
                //
                this.toolModel.xCube.scaleValue = 1;
                this.toolModel.yCube.scaleValue = 1;
                this.toolModel.zCube.scaleValue = 1;
            };
            return Object3DScaleTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DScaleTool = Object3DScaleTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DScaleTool.js.map