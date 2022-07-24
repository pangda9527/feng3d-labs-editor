
@feng3d.OVComponent()
export class OVTerrain extends TerrainView implements feng3d.IObjectView
{
    space: Object;
    private _objectViewInfo: feng3d.ObjectViewInfo;

    constructor(objectViewInfo: feng3d.ObjectViewInfo)
    {
        super();
        this._objectViewInfo = objectViewInfo;
        this.space = <any>objectViewInfo.owner;
    }

    getAttributeView(attributeName: String)
    {
        return null;
    }

    getblockView(blockName: String)
    {
        return null;
    }

}
