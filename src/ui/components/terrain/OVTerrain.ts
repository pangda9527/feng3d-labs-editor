import { OVComponent, IObjectView, ObjectViewInfo } from 'feng3d';
import { TerrainView } from './TerrainView';

@OVComponent()
export class OVTerrain extends TerrainView implements IObjectView
{
    space: Object;
    private _objectViewInfo: ObjectViewInfo;

    constructor(objectViewInfo: ObjectViewInfo)
    {
        super();
        this._objectViewInfo = objectViewInfo;
        this.space = <any>objectViewInfo.owner;
    }

    getAttributeView(_attributeName: String)
    {
        return null;
    }

    getblockView(_blockName: String)
    {
        return null;
    }
}
