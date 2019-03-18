/**
 * 移动工具模型组件
 */
export declare class MToolModel extends feng3d.Component {
    xAxis: CoordinateAxis;
    yAxis: CoordinateAxis;
    zAxis: CoordinateAxis;
    yzPlane: CoordinatePlane;
    xzPlane: CoordinatePlane;
    xyPlane: CoordinatePlane;
    oCube: CoordinateCube;
    init(gameObject: feng3d.GameObject): void;
    private initModels;
}
export declare class CoordinateAxis extends feng3d.Component {
    private isinit;
    private segmentMaterial;
    private material;
    private xArrow;
    readonly color: feng3d.Color4;
    private selectedColor;
    private length;
    selected: boolean;
    init(gameObject: feng3d.GameObject): void;
    update(): void;
}
export declare class CoordinateCube extends feng3d.Component {
    private isinit;
    private colorMaterial;
    private oCube;
    color: feng3d.Color4;
    selectedColor: feng3d.Color4;
    selected: boolean;
    init(gameObject: feng3d.GameObject): void;
    update(): void;
}
export declare class CoordinatePlane extends feng3d.Component {
    private isinit;
    private colorMaterial;
    private segmentGeometry;
    color: feng3d.Color4;
    borderColor: feng3d.Color4;
    selectedColor: feng3d.Color4;
    private selectedborderColor;
    readonly width: number;
    private _width;
    selected: boolean;
    init(gameObject: feng3d.GameObject): void;
    update(): void;
}
//# sourceMappingURL=MToolModel.d.ts.map