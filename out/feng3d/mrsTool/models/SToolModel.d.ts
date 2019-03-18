import { CoordinateCube } from "./MToolModel";
/**
 * 缩放工具模型组件
 */
export declare class SToolModel extends feng3d.Component {
    xCube: CoordinateScaleCube;
    yCube: CoordinateScaleCube;
    zCube: CoordinateScaleCube;
    oCube: CoordinateCube;
    init(gameObject: feng3d.GameObject): void;
    private initModels;
}
export declare class CoordinateScaleCube extends feng3d.Component {
    private isinit;
    private coordinateCube;
    private segmentGeometry;
    readonly color: feng3d.Color4;
    private selectedColor;
    private length;
    selected: boolean;
    scaleValue: number;
    init(gameObject: feng3d.GameObject): void;
    update(): void;
}
//# sourceMappingURL=SToolModel.d.ts.map