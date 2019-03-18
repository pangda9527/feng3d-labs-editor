import { AssetView } from "../ui/assets/AssetView";
import { MainView } from "../ui/MainView";
import { Feng3dView } from "../ui/Feng3dView";
export interface EditorUI {
    stage: egret.Stage;
    assetview: AssetView;
    mainview: MainView;
    tooltipLayer: eui.UILayer;
    popupLayer: eui.UILayer;
    /**
     * 3D视图
     */
    feng3dView: Feng3dView;
}
export declare var editorui: EditorUI;
//# sourceMappingURL=editorui.d.ts.map