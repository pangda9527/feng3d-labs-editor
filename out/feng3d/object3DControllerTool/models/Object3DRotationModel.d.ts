declare namespace feng3d.editor {
    class Object3DRotationModel extends Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        constructor(gameObject: GameObject);
        private initModels();
    }
    class CoordinateRotationAxis extends Component {
        private segmentGeometry;
        private torusGeometry;
        private sector;
        radius: number;
        readonly color: Color;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: Vector3D;
        private _filterNormal;
        constructor(gameObject: GameObject);
        private initModels();
        update(): void;
        showSector(startPos: Vector3D, endPos: Vector3D): void;
        hideSector(): void;
    }
    /**
     * 扇形对象
     */
    class SectorObject3D extends Component {
        private segmentGeometry;
        private geometry;
        private borderColor;
        radius: number;
        private _start;
        private _end;
        /**
         * 构建3D对象
         */
        constructor(gameObject: GameObject);
        update(start?: number, end?: number): void;
    }
    class CoordinateRotationFreeAxis extends Component {
        private segmentGeometry;
        private sector;
        private radius;
        color: Color;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        constructor(gameObject: GameObject);
        private initModels();
        update(): void;
    }
}
