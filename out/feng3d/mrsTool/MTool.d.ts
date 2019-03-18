import { MRSToolBase } from "./MRSToolBase";
import { MToolModel } from "./models/MToolModel";
/**
 * 位移工具
 */
export declare class MTool extends MRSToolBase {
    protected toolModel: MToolModel;
    /**
     * 用于判断是否改变了XYZ
     */
    private changeXYZ;
    private startPlanePos;
    private startPos;
    init(gameObject: feng3d.GameObject): void;
    protected onAddedToScene(): void;
    protected onRemovedFromScene(): void;
    protected onItemMouseDown(event: feng3d.Event<any>): void;
    private onMouseMove;
    protected onMouseUp(): void;
    protected updateToolModel(): void;
}
//# sourceMappingURL=MTool.d.ts.map