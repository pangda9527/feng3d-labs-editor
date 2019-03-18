import { CoordinateAxis, CoordinatePlane, CoordinateCube } from "./models/MToolModel";
import { CoordinateScaleCube } from "./models/SToolModel";
import { CoordinateRotationAxis, CoordinateRotationFreeAxis } from "./models/RToolModel";
export declare class MRSToolBase extends feng3d.Component {
    private _selectedItem;
    private _toolModel;
    protected ismouseDown: boolean;
    protected movePlane3D: feng3d.Plane3D;
    protected startSceneTransform: feng3d.Matrix4x4;
    init(gameObject: feng3d.GameObject): void;
    protected onAddedToScene(): void;
    protected onRemovedFromScene(): void;
    protected onItemMouseDown(event: feng3d.Event<any>): void;
    protected toolModel: feng3d.Component;
    selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateScaleCube | CoordinateRotationAxis | CoordinateRotationFreeAxis;
    protected updateToolModel(): void;
    protected onMouseDown(): void;
    protected onMouseUp(): void;
    /**
     * 获取鼠标射线与移动平面的交点（模型空间）
     */
    protected getLocalMousePlaneCross(): feng3d.Vector3;
    protected getMousePlaneCross(): feng3d.Vector3;
}
//# sourceMappingURL=MRSToolBase.d.ts.map