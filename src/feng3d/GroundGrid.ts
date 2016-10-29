module feng3d.editor {

    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    export class GroundGrid {

        private _groundGridObject3D: Object3D;

        public get groundGridObject3D(): Object3D {

            return this._groundGridObject3D || (this._groundGridObject3D = this.createGroundGridObject3d());
        }

        /**
         * 创建地面网格对象
         */
        private createGroundGridObject3d(): Object3D {

            var groundGridObject3D = new Object3D("GroundGrid", [new SegmentMaterial(), new feng3d.Space3D(0, -50, 0)]);
            var segmentGeometry = new SegmentGeometry();
            var geometry = groundGridObject3D.getOrCreateComponentByClass(Geometry);
            geometry.addComponent(segmentGeometry);

            var step = 10;
            var num = 100;
            var halfNum = num / 2;
            var thickness = 1;

            segmentGeometry.removeAllSegments();
            for (var i = -halfNum; i <= halfNum; i++) {
                segmentGeometry.addSegment(new Segment(new Vector3D(-halfNum * step, 0, i * step), new Vector3D(halfNum * step, 0, i * step)));
                segmentGeometry.addSegment(new Segment(new Vector3D(i * step, 0, -halfNum * step), new Vector3D(i * step, 0, halfNum * step)));
            }

            return groundGridObject3D;
        }
    }
}