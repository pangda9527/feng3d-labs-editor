declare namespace feng3d.editor {
    class Object3DMoveModel extends Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        constructor(gameObject: GameObject);
        private initModels();
    }
    class CoordinateAxis extends Component {
        private segmentMaterial;
        private material;
        private xArrow;
        readonly color: Color;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        constructor(gameObject: GameObject);
        private update();
    }
    class CoordinateCube extends Component {
        private colorMaterial;
        private oCube;
        color: Color;
        selectedColor: Color;
        selected: boolean;
        private _selected;
        constructor(gameObject: GameObject);
        update(): void;
    }
    class CoordinatePlane extends Component {
        private colorMaterial;
        private segmentGeometry;
        color: Color;
        borderColor: Color;
        selectedColor: Color;
        private selectedborderColor;
        readonly width: number;
        private _width;
        selected: boolean;
        private _selected;
        constructor(gameObject: GameObject);
        update(): void;
    }
}
