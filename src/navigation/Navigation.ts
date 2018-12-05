namespace feng3d
{
    export interface ComponentMap { Navigation: editor.Navigation; }
}

namespace editor
{
    /**
     * 导航组件，提供生成导航网格功能
     */
    export class Navigation extends feng3d.Component
    {
        /**
         * 距离边缘半径
         */
        @feng3d.oav()
        agentRadius = 0.5;

        /**
         * 允许行走高度
         */
        @feng3d.oav()
        agentHeight = 2;

        /**
         * 允许行走坡度
         */
        @feng3d.oav()
        maxSlope = 45;//[0,60]

        private _navobject: feng3d.GameObject;
        private _recastnavigation: Recastnavigation;
        private _debugNavVoxelsPointGeometry: feng3d.PointGeometry;

        init(gameobject: feng3d.GameObject)
        {
            super.init(gameobject);

            this._navobject = Object.setValue(new feng3d.GameObject(), { name: "NavObject" });
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "DebugNavVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: Object.setValue(new feng3d.Material(), { shaderName: "point", renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._debugNavVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
            });
            this._navobject.addChild(pointsObject);
        }

        /**
         * 清楚oav网格模型
         */
        @feng3d.oav()
        clear()
        {
            this._navobject && this._navobject.remove();
        }

        /**
         * 计算导航网格数据
         */
        @feng3d.oav()
        bake()
        {
            var geometrys = this._getNavGeometrys(this.gameObject.scene.gameObject);
            if (geometrys.length == 0)
            {
                this._navobject && this._navobject.remove();
                return;
            }
            this.gameObject.scene.gameObject.addChild(this._navobject);

            var geometry = feng3d.geometryUtils.mergeGeometry(geometrys);

            this._recastnavigation = this._recastnavigation || new Recastnavigation();
            this._recastnavigation.doRecastnavigation(geometry, 0.1);

            var voxels = this._recastnavigation.getVoxels();
            this._debugNavVoxelsPointGeometry.points = voxels.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z), a: 1 } })
        }

        private _getNavGeometrys(gameobject: feng3d.GameObject, geometrys?: { positions: number[], indices: number[] }[])
        {
            geometrys = geometrys || [];

            if (!gameobject.visible)
                return geometrys;
            var model = gameobject.getComponent(feng3d.Model);
            var geometry = model && model.geometry;
            if (geometry && gameobject.navigationArea != -1)
            {
                var matrix3d = gameobject.transform.localToWorldMatrix;
                var positions = Array.apply(null, geometry.positions);
                matrix3d.transformVectors(positions, positions);
                var indices = Array.apply(null, geometry.indices);
                //
                geometrys.push({ positions: positions, indices: indices });
            }
            gameobject.children.forEach(element =>
            {
                this._getNavGeometrys(element, geometrys);
            });
            return geometrys;
        }
    }
}