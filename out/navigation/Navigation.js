"use strict";
// namespace feng3d
// {
//     export interface ComponentMap { Navigation: editor.Navigation; }
// }
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 导航代理
 */
var NavigationAgent = /** @class */ (function () {
    function NavigationAgent() {
        /**
         * 距离边缘半径
         */
        this.radius = 0.5;
        /**
         * 允许行走高度
         */
        this.height = 2;
        /**
         * 允许爬上的阶梯高度
         */
        this.stepHeight = 0.4;
        /**
         * 允许行走坡度
         */
        this.maxSlope = 45; //[0,60]
    }
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "radius", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "height", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "stepHeight", void 0);
    __decorate([
        feng3d.oav()
    ], NavigationAgent.prototype, "maxSlope", void 0);
    return NavigationAgent;
}());
exports.NavigationAgent = NavigationAgent;
/**
 * 导航组件，提供生成导航网格功能
 */
var Navigation = /** @class */ (function (_super) {
    __extends(Navigation, _super);
    function Navigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.agent = new NavigationAgent();
        return _this;
    }
    Navigation.prototype.init = function (gameobject) {
        _super.prototype.init.call(this, gameobject);
        this.hideFlags = this.hideFlags | feng3d.HideFlags.DontSaveInBuild;
        this._navobject = Object.setValue(new feng3d.GameObject(), { name: "NavObject", hideFlags: feng3d.HideFlags.DontSave });
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
        var pointsObject = Object.setValue(new feng3d.GameObject(), {
            name: "debugVoxels",
            components: [{
                    __class__: "feng3d.MeshModel",
                    material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 0, 1), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                    geometry: this._debugVoxelsPointGeometry = new feng3d.PointGeometry()
                },]
        });
        this._navobject.addChild(pointsObject);
    };
    /**
     * 清楚oav网格模型
     */
    Navigation.prototype.clear = function () {
        this._navobject && this._navobject.remove();
    };
    /**
     * 计算导航网格数据
     */
    Navigation.prototype.bake = function () {
        var geometrys = this._getNavGeometrys(this.gameObject.scene.gameObject);
        if (geometrys.length == 0) {
            this._navobject && this._navobject.remove();
            return;
        }
        this.gameObject.scene.gameObject.addChild(this._navobject);
        this._navobject.transform.position = new feng3d.Vector3();
        var geometry = feng3d.geometryUtils.mergeGeometry(geometrys);
        this._recastnavigation = this._recastnavigation || new Recastnavigation();
        this._recastnavigation.doRecastnavigation(geometry, this.agent);
        var voxels = this._recastnavigation.getVoxels();
        var voxels0 = voxels.filter(function (v) { return v.flag == VoxelFlag.Default; });
        var voxels1 = voxels.filter(function (v) { return v.flag != VoxelFlag.Default; });
        var voxels2 = voxels.filter(function (v) { return !!(v.flag & VoxelFlag.IsContour); });
        this._allowedVoxelsPointGeometry.points = voxels0.map(function (v) { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
        this._rejectivedVoxelsPointGeometry.points = voxels1.map(function (v) { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
        // this._debugVoxelsPointGeometry.points = voxels2.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
    };
    /**
     * 获取参与导航的几何体列表
     * @param gameobject
     * @param geometrys
     */
    Navigation.prototype._getNavGeometrys = function (gameobject, geometrys) {
        var _this = this;
        geometrys = geometrys || [];
        if (!gameobject.visible)
            return geometrys;
        var model = gameobject.getComponent(feng3d.Model);
        var geometry = model && model.geometry;
        if (geometry && gameobject.navigationArea != -1) {
            var matrix3d = gameobject.transform.localToWorldMatrix;
            var positions = Array.apply(null, geometry.positions);
            matrix3d.transformVectors(positions, positions);
            var indices = Array.apply(null, geometry.indices);
            //
            geometrys.push({ positions: positions, indices: indices });
        }
        gameobject.children.forEach(function (element) {
            _this._getNavGeometrys(element, geometrys);
        });
        return geometrys;
    };
    __decorate([
        feng3d.oav({ component: "OAVObjectView" })
    ], Navigation.prototype, "agent", void 0);
    __decorate([
        feng3d.oav()
    ], Navigation.prototype, "clear", null);
    __decorate([
        feng3d.oav()
    ], Navigation.prototype, "bake", null);
    return Navigation;
}(feng3d.Component));
exports.Navigation = Navigation;
//# sourceMappingURL=Navigation.js.map