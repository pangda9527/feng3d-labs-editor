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
    @feng3d.AddComponentMenu("Navigation/Navigation")
    export class Navigation extends feng3d.Component
    {
        @feng3d.oav({ component: "OAVObjectView" })
        agent = new NavigationAgent();

        private _navobject: feng3d.GameObject;
        private _recastnavigation: Recastnavigation;
        private _allowedVoxelsPointGeometry: feng3d.PointGeometry;
        private _rejectivedVoxelsPointGeometry: feng3d.PointGeometry;
        private _debugVoxelsPointGeometry: feng3d.PointGeometry;

        init()
        {
            super.init();
            this.hideFlags = this.hideFlags | feng3d.HideFlags.DontSaveInBuild;

            this._navobject = feng3d.serialization.setValue(new feng3d.GameObject(), { name: "NavObject", hideFlags: feng3d.HideFlags.DontSave });
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "allowedVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 1, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._allowedVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "rejectivedVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(1, 0, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._rejectivedVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = feng3d.serialization.setValue(new feng3d.GameObject(), {
                name: "debugVoxels",
                components: [{
                    __class__: "feng3d.MeshModel",
                    material: feng3d.serialization.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 0, 1), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._debugVoxelsPointGeometry = new feng3d.PointGeometry()
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
            this._navobject.transform.position = new feng3d.Vector3();

            var geometry = feng3d.geometryUtils.mergeGeometry(geometrys);

            this._recastnavigation = this._recastnavigation || new Recastnavigation();

            this._recastnavigation.doRecastnavigation(geometry, this.agent);
            var voxels = this._recastnavigation.getVoxels();

            var voxels0 = voxels.filter(v => v.flag == VoxelFlag.Default);
            var voxels1 = voxels.filter(v => v.flag != VoxelFlag.Default);
            var voxels2 = voxels.filter(v => !!(v.flag & VoxelFlag.IsContour));

            this._allowedVoxelsPointGeometry.points = voxels0.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
            this._rejectivedVoxelsPointGeometry.points = voxels1.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
            // this._debugVoxelsPointGeometry.points = voxels2.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
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
            var model = gameobject.getComponent(feng3d.Renderable);
            var geometry = model && model.geometry;
            if (geometry && gameobject.navigationArea != -1)
            {
                var matrix = gameobject.transform.localToWorldMatrix;
                var positions = Array.apply(null, geometry.positions);
                matrix.transformVectors(positions, positions);
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