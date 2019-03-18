/**
 * 旋转工具模型组件
 */
export declare class RToolModel extends feng3d.Component {
    xAxis: CoordinateRotationAxis;
    yAxis: CoordinateRotationAxis;
    zAxis: CoordinateRotationAxis;
    freeAxis: CoordinateRotationFreeAxis;
    cameraAxis: CoordinateRotationAxis;
    init(gameObject: feng3d.GameObject): void;
    private initModels;
}
export declare class CoordinateRotationAxis extends feng3d.Component {
    private isinit;
    private segmentGeometry;
    private torusGeometry;
    private sector;
    radius: number;
    readonly color: feng3d.Color4;
    private backColor;
    private selectedColor;
    selected: boolean;
    /**
     * 过滤法线显示某一面线条
     */
    filterNormal: feng3d.Vector3;
    init(gameObject: feng3d.GameObject): void;
    private initModels;
    update(): void;
    showSector(startPos: feng3d.Vector3, endPos: feng3d.Vector3): void;
    hideSector(): void;
}
/**
 * 扇形对象
 */
export declare class SectorGameObject extends feng3d.Component {
    private isinit;
    private segmentGeometry;
    private geometry;
    private borderColor;
    radius: number;
    private _start;
    private _end;
    /**
     * 构建3D对象
     */
    init(gameObject: feng3d.GameObject): void;
    update(start?: number, end?: number): void;
}
export declare class CoordinateRotationFreeAxis extends feng3d.Component {
    private isinit;
    private segmentGeometry;
    private sector;
    private radius;
    color: feng3d.Color4;
    private backColor;
    private selectedColor;
    selected: boolean;
    init(gameObject: feng3d.GameObject): void;
    private initModels;
    update(): void;
}
//# sourceMappingURL=RToolModel.d.ts.map