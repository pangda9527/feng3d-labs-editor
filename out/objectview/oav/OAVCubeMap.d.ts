declare namespace editor {
    class OAVCubeMap extends OAVBase {
        px: eui.Image;
        py: eui.Image;
        pz: eui.Image;
        nx: eui.Image;
        ny: eui.Image;
        nz: eui.Image;
        pxGroup: eui.Group;
        pxBtn: eui.Button;
        pyGroup: eui.Group;
        pyBtn: eui.Button;
        pzGroup: eui.Group;
        pzBtn: eui.Button;
        nxGroup: eui.Group;
        nxBtn: eui.Button;
        nyGroup: eui.Group;
        nyBtn: eui.Button;
        nzGroup: eui.Group;
        nzBtn: eui.Button;
        private images;
        private btns;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        private updateImage;
        private onImageClick;
        private dispatchValueChange;
        dispose(): void;
        updateView(): void;
        onResize(): void;
    }
}
//# sourceMappingURL=OAVCubeMap.d.ts.map