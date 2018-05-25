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

        init(gameobject: feng3d.GameObject)
        {
            super.init(gameobject);
        }

        private _navobject: feng3d.GameObject;

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
            var geometrys = getNavGeometry(this.gameObject.scene.gameObject);
            if (geometrys.length == 0)
            {
                this._navobject && this._navobject.remove();
                return;
            }
            var geometry = mergeGeometry(geometrys);

            //
            var geometrydata = getGeometryData(geometry);
            var process = new navigation.NavigationProcess(geometrydata);
            //
            process.checkMaxSlope(this.maxSlope);
            process.checkAgentRadius(this.agentRadius);
            process.checkAgentHeight(this.agentHeight);
            //
            geometrydata = process.getGeometry();
            if (geometrydata.indices.length == 0)
            {
                this._navobject && this._navobject.remove();
                return;
            }
            //
            var navobject = this._navobject = this._navobject || createNavObject();
            navobject.getComponent(feng3d.MeshRenderer).geometry = getGeometry(geometrydata);
            var parentobject = this.gameObject.scene.gameObject.find("editorObject") || this.gameObject.scene.gameObject;
            parentobject.addChild(navobject);

            function getGeometry(geometrydata: { positions: number[], indices: number[] })
            {
                var customGeometry = new feng3d.CustomGeometry();
                customGeometry.positions = geometrydata.positions;
                customGeometry.indices = geometrydata.indices;
                return customGeometry;
            }

            function getGeometryData(geometry: feng3d.Geometry)
            {
                var positions: number[] = [];
                var indices: number[] = [];
                positions.push.apply(positions, geometry.positions);
                indices.push.apply(indices, geometry.indices);
                return { positions: positions, indices: indices }
            }

            function createNavObject()
            {
                var navobject = feng3d.GameObject.create("navigation");
                navobject.mouseEnabled = false;
                navobject.addComponent(feng3d.MeshRenderer).set((space) =>
                {
                    space.geometry = new feng3d.CustomGeometry();
                    space.material = feng3d.materialFactory.create("color", { uniforms: { u_diffuseInput: new feng3d.Color4(0, 1, 0, 0.5) } });
                });
                navobject.transform.y = 0.01;
                return navobject;
            }

            function mergeGeometry(geometrys: feng3d.CustomGeometry[])
            {
                var customGeometry = new feng3d.CustomGeometry();
                geometrys.forEach(element =>
                {
                    customGeometry.addGeometry(element);
                });
                return customGeometry;
            }

            function getNavGeometry(gameobject: feng3d.GameObject, geometrys?: feng3d.CustomGeometry[])
            {
                geometrys = geometrys || [];

                if (!gameobject.visible)
                    return geometrys;
                var meshRenderer = gameobject.getComponent(feng3d.MeshRenderer);
                var geometry = meshRenderer && meshRenderer.geometry;
                if (geometry && gameobject.navigationArea != -1)
                {
                    var matrix3d = gameobject.transform.localToWorldMatrix;
                    var positions = Array.apply(null, geometry.positions);
                    matrix3d.transformVectors(positions, positions);
                    var indices = Array.apply(null, geometry.indices);
                    //
                    var customGeometry = new feng3d.CustomGeometry();
                    customGeometry.positions = positions;
                    customGeometry.indices = indices;
                    geometrys.push(customGeometry);
                }
                gameobject.children.forEach(element =>
                {
                    getNavGeometry(element, geometrys);
                });
                return geometrys;
            }
        }
    }
}