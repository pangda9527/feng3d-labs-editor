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
        /**
         * 地面网格
         * @author feng 2016-10-29
         */
        var GroundGrid = (function (_super) {
            __extends(GroundGrid, _super);
            function GroundGrid(gameObject) {
                var _this = _super.call(this, gameObject) || this;
                _this.num = 100;
                gameObject.serializable = false;
                _this.gameObject.mouseEnabled = false;
                _this.init();
                return _this;
                // editor3DData.cameraObject3D.addEventListener(Object3DEvent.SCENETRANSFORM_CHANGED, this.onCameraScenetransformChanged, this);
            }
            /**
             * 创建地面网格对象
             */
            GroundGrid.prototype.init = function () {
                var meshFilter = this.gameObject.addComponent(feng3d.MeshFilter);
                this.segmentGeometry = meshFilter.mesh = new feng3d.SegmentGeometry();
                var meshRenderer = this.gameObject.addComponent(feng3d.MeshRenderer);
                meshRenderer.material = new feng3d.SegmentMaterial();
                this.update();
            };
            GroundGrid.prototype.update = function () {
                var cameraGlobalPosition = editor.editor3DData.camera.transform.scenePosition;
                this.level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                this.step = Math.pow(10, this.level - 1);
                var startX = Math.round(cameraGlobalPosition.x / (10 * this.step)) * 10 * this.step;
                var startZ = Math.round(cameraGlobalPosition.z / (10 * this.step)) * 10 * this.step;
                //设置在原点
                startX = startZ = 0;
                this.step = 100;
                var halfNum = this.num / 2;
                this.segmentGeometry.removeAllSegments();
                for (var i = -halfNum; i <= halfNum; i++) {
                    var color = (i % 10) == 0 ? 0x888888 : 0x777777;
                    var thickness = (i % 10) == 0 ? 2 : 1;
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(-halfNum * this.step + startX, 0, i * this.step + startZ), new feng3d.Vector3D(halfNum * this.step + startX, 0, i * this.step + startZ), color, color));
                    this.segmentGeometry.addSegment(new feng3d.Segment(new feng3d.Vector3D(i * this.step + startX, 0, -halfNum * this.step + startZ), new feng3d.Vector3D(i * this.step + startX, 0, halfNum * this.step + startZ), color, color));
                }
            };
            return GroundGrid;
        }(feng3d.Component));
        editor.GroundGrid = GroundGrid;
    })(editor = feng3d.editor || (feng3d.editor = {}));
})(feng3d || (feng3d = {}));
//# sourceMappingURL=GroundGrid.js.map