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
        var Object3DRotationTool = (function (_super) {
            __extends(Object3DRotationTool, _super);
            function Object3DRotationTool(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.toolModel = feng3d.GameObject.create().addComponent(editor.Object3DRotationModel);
                return _this;
            }
            Object3DRotationTool.prototype.onAddedToScene = function () {
                _super.prototype.onAddedToScene.call(this);
                this.toolModel.xAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.on("mousedown", this.onItemMouseDown, this);
            };
            Object3DRotationTool.prototype.onRemovedFromScene = function () {
                _super.prototype.onRemovedFromScene.call(this);
                this.toolModel.xAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.yAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.zAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.freeAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
                this.toolModel.cameraAxis.gameObject.off("mousedown", this.onItemMouseDown, this);
            };
            Object3DRotationTool.prototype.onItemMouseDown = function (event) {
                //全局矩阵
                var globalMatrix3D = this.transform.localToWorldMatrix;
                //中心与X,Y,Z轴上点坐标
                var pos = globalMatrix3D.position;
                var xDir = globalMatrix3D.right;
                var yDir = globalMatrix3D.up;
                var zDir = globalMatrix3D.forward;
                //摄像机前方方向
                var cameraSceneTransform = editor.editor3DData.camera.transform.localToWorldMatrix;
                var cameraDir = cameraSceneTransform.forward;
                var cameraPos = cameraSceneTransform.position;
                this.movePlane3D = new feng3d.Plane3D();
                var selectedGameObject = event.currentTarget;
                switch (selectedGameObject) {
                    case this.toolModel.xAxis.gameObject:
                        this.selectedItem = this.toolModel.xAxis;
                        this.movePlane3D.fromNormalAndPoint(xDir, pos);
                        break;
                    case this.toolModel.yAxis.gameObject:
                        this.selectedItem = this.toolModel.yAxis;
                        this.movePlane3D.fromNormalAndPoint(yDir, pos);
                        break;
                    case this.toolModel.zAxis.gameObject:
                        this.selectedItem = this.toolModel.zAxis;
                        this.selectedItem = this.toolModel.zAxis;
                        this.movePlane3D.fromNormalAndPoint(zDir, pos);
                        break;
                    case this.toolModel.freeAxis.gameObject:
                        this.selectedItem = this.toolModel.freeAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                    case this.toolModel.cameraAxis.gameObject:
                        this.selectedItem = this.toolModel.cameraAxis;
                        this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                        break;
                }
                this.startPlanePos = this.getMousePlaneCross();
                this.startMousePos = editor.editor3DData.mouseInView3D.clone();
                this.startSceneTransform = globalMatrix3D.clone();
                this.object3DControllerTarget.startRotate();
                //
                feng3d.input.on("mousemove", this.onMouseMove, this);
            };
            Object3DRotationTool.prototype.onMouseMove = function () {
                switch (this.selectedItem) {
                    case this.toolModel.xAxis:
                    case this.toolModel.yAxis:
                    case this.toolModel.zAxis:
                    case this.toolModel.cameraAxis:
                        var origin = this.startSceneTransform.position;
                        var planeCross = this.getMousePlaneCross();
                        var startDir = this.startPlanePos.subtract(origin);
                        startDir.normalize();
                        var endDir = planeCross.subtract(origin);
                        endDir.normalize();
                        //计算夹角
                        var cosValue = startDir.dotProduct(endDir);
                        var angle = Math.acos(cosValue) * feng3d.MathConsts.RADIANS_TO_DEGREES;
                        //计算是否顺时针
                        var sign = this.movePlane3D.normal.crossProduct(startDir).dotProduct(endDir);
                        sign = sign > 0 ? 1 : -1;
                        angle = angle * sign;
                        //
                        this.object3DControllerTarget.rotate1(angle, this.movePlane3D.normal);
                        //绘制扇形区域
                        if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                            this.selectedItem.showSector(this.startPlanePos, planeCross);
                        }
                        break;
                    case this.toolModel.freeAxis:
                        var endPoint = editor.editor3DData.mouseInView3D.clone();
                        var offset = endPoint.subtract(this.startMousePos);
                        var cameraSceneTransform = editor.editor3DData.camera.transform.localToWorldMatrix;
                        var right = cameraSceneTransform.right;
                        var up = cameraSceneTransform.up;
                        this.object3DControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                        //
                        this.startMousePos = endPoint;
                        this.object3DControllerTarget.startRotate();
                        break;
                }
            };
            Object3DRotationTool.prototype.onMouseUp = function () {
                _super.prototype.onMouseUp.call(this);
                feng3d.input.off("mousemove", this.onMouseMove, this);
                if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                    this.selectedItem.hideSector();
                }
                this.object3DControllerTarget.stopRote();
                this.startMousePos = null;
                this.startPlanePos = null;
                this.startSceneTransform = null;
            };
            Object3DRotationTool.prototype.updateToolModel = function () {
                var cameraSceneTransform = editor.editor3DData.camera.transform.localToWorldMatrix.clone();
                var cameraDir = cameraSceneTransform.forward;
                cameraDir.negate();
                //
                var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
                for (var i = 0; i < xyzAxis.length; i++) {
                    var axis = xyzAxis[i];
                    axis.filterNormal = cameraDir;
                }
                //朝向摄像机
                var temp = cameraSceneTransform.clone();
                temp.append(this.toolModel.transform.worldToLocalMatrix);
                var rotation = temp.decompose()[1];
                rotation.scaleBy(feng3d.MathConsts.RADIANS_TO_DEGREES);
                this.toolModel.freeAxis.transform.rotation = rotation;
                this.toolModel.cameraAxis.transform.rotation = rotation;
            };
            return Object3DRotationTool;
        }(editor.Object3DControllerToolBase));
        editor.Object3DRotationTool = Object3DRotationTool;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=Object3DRotationTool.js.map