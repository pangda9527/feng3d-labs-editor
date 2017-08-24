/**
 * 层级界面创建3D对象列表数据
 */
var createObjectConfig = [
    //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
    { label: "GameObject", className: "feng3d.GameObject" },
    { label: "Plane", className: "feng3d.PlaneObject3D" },
    { label: "Cube", className: "feng3d.CubeObject3D" },
    { label: "Sphere", className: "feng3d.SphereObject3D" },
    { label: "Capsule", className: "feng3d.CapsuleObject3D" },
    { label: "Cylinder", className: "feng3d.CylinderObject3D" },
    { label: "Cone", className: "feng3d.ConeObject3D" },
    { label: "Torus", className: "feng3d.TorusObect3D" },
    { label: "Particle", className: "feng3d.ParticleObject3D" },
    { label: "Camera", className: "feng3d.CameraObject3D" },
    { label: "PointLight", className: "feng3d.PointLightObject3D" },
];
/**
 * 层级界面创建3D对象列表数据
 */
var createObject3DComponentConfig = [
    //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
    { label: "ParticleAnimator", className: "feng3d.ParticleAnimator" },
    { label: "Camera3D", className: "feng3d.Camera3D" },
    { label: "Model", className: "feng3d.Model" },
    { label: "PointLight", className: "feng3d.PointLight" },
    { label: "Script", className: "feng3d.Object3dScript" },
];
/**
 * 主菜单
 */
var mainMenuConfig = [
    { label: "save scene", command: "saveScene" },
    { label: "import", command: "import" },
];
//# sourceMappingURL=CommonConfig.js.map