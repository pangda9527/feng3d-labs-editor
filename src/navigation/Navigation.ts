namespace feng3d
{
    export interface ComponentMap { Navigation: editor.Navigation; }
}

namespace editor
{
    /**
     * 导航代理
     */
    export class NavigationAgent
    {
        /**
         * 距离边缘半径
         */
        @feng3d.oav()
        radius = 0.5;

        /**
         * 允许行走高度
         */
        @feng3d.oav()
        height = 2;

        /**
         * 允许爬上的阶梯高度
         */
        @feng3d.oav()
        stepHeight = 0.4;

        /**
         * 允许行走坡度
         */
        @feng3d.oav()
        maxSlope = 45;//[0,60]
    }

    /**
     * 导航组件，提供生成导航网格功能
     */
    export class Navigation extends feng3d.Component
    {
        @feng3d.oav({ component: "OAVObjectView" })
        agent = new NavigationAgent();

        private _navobject: feng3d.GameObject;
        private _recastnavigation: Recastnavigation;
        private _allowedVoxelsPointGeometry: feng3d.PointGeometry;
        private _rejectivedVoxelsPointGeometry: feng3d.PointGeometry;

        init(gameobject: feng3d.GameObject)
        {
            super.init(gameobject);

            this._navobject = Object.setValue(new feng3d.GameObject(), { name: "NavObject" });
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "allowedVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 1, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._allowedVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "rejectivedVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(1, 0, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._rejectivedVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
            });
            this._navobject.addChild(pointsObject);
            this._navobject.hideFlags = feng3d.HideFlags.DontSave;
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
            this._recastnavigation.doRecastnavigation(geometry, this.agent, new feng3d.Vector3(0.05, 0.05, 0.05));

            var voxels = this._recastnavigation.getVoxels().filter(v => v.allowedMaxSlope && v.allowedHeight);
            var voxels1 = this._recastnavigation.getVoxels().filter(v => !(v.allowedMaxSlope && v.allowedHeight));

            this._allowedVoxelsPointGeometry.points = voxels.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
            this._rejectivedVoxelsPointGeometry.points = voxels1.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
        }

        /**
         * 获取参与导航的几何体列表
         * @param gameobject 
         * @param geometrys 
         */
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