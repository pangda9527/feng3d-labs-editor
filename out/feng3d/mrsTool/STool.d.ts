import { MRSToolBase } from "./MRSToolBase";
import { SToolModel } from "./models/SToolModel";
export declare class STool extends MRSToolBase {
    protected toolModel: SToolModel;
    private startMousePos;
    /**
     * 用于判断是否改变了XYZ
     */
    private changeXYZ;
    private startPlanePos;
    init(gameObject: feng3d.GameObject): void;
    protected onAddedToScene(): void;
    protected onRemovedFromScene(): void;
    protected onItemMouseDown(event: feng3d.Event<any>): void;
    private onMouseMove;
    protected onMouseUp(): void;
}
//# sourceMappingURL=STool.d.ts.map