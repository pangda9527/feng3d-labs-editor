declare namespace editor {
    class OVTerrain extends TerrainView implements feng3d.IObjectView {
        space: Object;
        private _objectViewInfo;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
    }
}
//# sourceMappingURL=OVTerrain.d.ts.map