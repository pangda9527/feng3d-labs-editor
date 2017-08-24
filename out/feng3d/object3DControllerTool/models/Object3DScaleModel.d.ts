declare namespace feng3d.editor {
    class Object3DScaleModel extends Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        constructor(gameObject: GameObject);
        private initModels();
    }
    class CoordinateScaleCube extends Component {
        private coordinateCube;
        private segmentGeometry;
        readonly color: Color;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        scaleValue: number;
        private _scale;
        constructor(gameObject: GameObject);
        update(): void;
    }
}
