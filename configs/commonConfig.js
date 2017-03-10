/**
 * 层级界面创建3D对象列表数据
 */
var createObjectConfig = [
    //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过ClassUtils.getDefinitionByName获取定义
    { label: "Object", className: "feng3d.Object3D" },
    { label: "Plane", className: "feng3d.PlaneObject3D" },
    { label: "Cube", className: "feng3d.CubeObject3D" },
    { label: "Sphere", className: "feng3d.SphereObject3D" },
    { label: "Capsule", className: "feng3d.CapsuleObject3D" },
    { label: "Cylinder", className: "feng3d.CylinderObject3D" },
    { label: "Cone", className: "feng3d.ConeObject3D" },
    { label: "Particle", className: "feng3d.ParticleObject3D" },
    { label: "Camera", className: "feng3d.CameraObject3D" },
];