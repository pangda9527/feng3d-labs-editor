import { MRSToolBase } from "./MRSToolBase";
import { RToolModel } from "./models/RToolModel";
export declare class RTool extends MRSToolBase {
    protected toolModel: RToolModel;
    private startPlanePos;
    private stepPlaneCross;
    private startMousePos;
    init(gameObject: feng3d.GameObject): void;
    protected onAddedToScene(): void;
    protected onRemovedFromScene(): void;
    protected onItemMouseDown(event: feng3d.Event<any>): void;
    private onMouseMove;
    protected onMouseUp(): void;
    protected updateToolModel(): void;
}
//# sourceMappingURL=RTool.d.ts.map