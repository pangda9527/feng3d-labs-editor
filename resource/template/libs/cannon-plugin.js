var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CANNON;
(function (CANNON) {
    CANNON.World.worldNormal = new CANNON.Vector3(0, 1, 0);
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 刚体
     */
    let Rigidbody = class Rigidbody extends feng3d.Behaviour {
        constructor() {
            super(...arguments);
            this.body = new CANNON.Body();
            this.runEnvironment = feng3d.RunEnvironment.feng3d;
        }
        get mass() {
            return this.body.mass;
        }
        set mass(v) {
            this.body.mass = v;
        }
        init() {
            this.body = new CANNON.Body({ mass: this.mass });
            this.body.position = new CANNON.Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z);
            var colliders = this.gameObject.getComponents("Collider");
            colliders.forEach(element => {
                this.body.addShape(element.shape);
            });
        }
        /**
         * 每帧执行
         */
        update(interval) {
            var scene = this.getComponentsInParents("Scene")[0];
            if (scene) {
                this.transform.position = new feng3d.Vector3(this.body.position.x, this.body.position.y, this.body.position.z);
            }
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], Rigidbody.prototype, "mass", null);
    Rigidbody = __decorate([
        feng3d.AddComponentMenu("Physics/Rigidbody"),
        feng3d.RegisterComponent()
    ], Rigidbody);
    CANNON.Rigidbody = Rigidbody;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 碰撞体
     */
    let Collider = class Collider extends feng3d.Component {
        get shape() {
            return this._shape;
        }
    };
    Collider = __decorate([
        feng3d.RegisterComponent()
    ], Collider);
    CANNON.Collider = Collider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 长方体碰撞体
     */
    let BoxCollider = class BoxCollider extends CANNON.Collider {
        constructor() {
            super(...arguments);
            /**
             * 宽度
             */
            this.width = 1;
            /**
             * 高度
             */
            this.height = 1;
            /**
             * 深度
             */
            this.depth = 1;
        }
        init() {
            var halfExtents = new CANNON.Vector3(this.width / 2, this.height / 2, this.depth / 2);
            this._shape = new CANNON.Box(halfExtents);
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], BoxCollider.prototype, "width", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], BoxCollider.prototype, "height", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], BoxCollider.prototype, "depth", void 0);
    BoxCollider = __decorate([
        feng3d.AddComponentMenu("Physics/Box Collider"),
        feng3d.RegisterComponent()
    ], BoxCollider);
    CANNON.BoxCollider = BoxCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 球形碰撞体
     */
    let SphereCollider = class SphereCollider extends CANNON.Collider {
        constructor() {
            super(...arguments);
            this._radius = 0.5;
        }
        /**
         * 半径
         */
        get radius() {
            return this._radius;
        }
        set radius(v) {
            this._radius = v;
            if (this._shape)
                this._shape.radius = v;
        }
        init() {
            this._shape = new CANNON.Sphere(this._radius);
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], SphereCollider.prototype, "radius", null);
    SphereCollider = __decorate([
        feng3d.AddComponentMenu("Physics/Sphere Collider"),
        feng3d.RegisterComponent()
    ], SphereCollider);
    CANNON.SphereCollider = SphereCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 圆柱体碰撞体
     */
    let CylinderCollider = class CylinderCollider extends CANNON.Collider {
        constructor() {
            super(...arguments);
            /**
             * 顶部半径
             */
            this.topRadius = 0.5;
            /**
             * 底部半径
             */
            this.bottomRadius = 0.5;
            /**
             * 高度
             */
            this.height = 2;
            /**
             * 横向分割数
             */
            this.segmentsW = 16;
        }
        init() {
            this._shape = new CANNON.Cylinder(this.topRadius, this.bottomRadius, this.height, this.segmentsW);
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], CylinderCollider.prototype, "topRadius", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], CylinderCollider.prototype, "bottomRadius", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], CylinderCollider.prototype, "height", void 0);
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], CylinderCollider.prototype, "segmentsW", void 0);
    CylinderCollider = __decorate([
        feng3d.AddComponentMenu("Physics/Cylinder Collider"),
        feng3d.RegisterComponent()
    ], CylinderCollider);
    CANNON.CylinderCollider = CylinderCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 胶囊体碰撞体
     */
    let CapsuleCollider = class CapsuleCollider extends CANNON.Collider {
        constructor() {
            super(...arguments);
            this._radius = 0.5;
            this._height = 1;
            this._segmentsW = 16;
            this._segmentsH = 15;
            this._yUp = true;
        }
        /**
         * 胶囊体半径
         */
        get radius() {
            return this._radius;
        }
        set radius(v) {
            if (this._radius == v)
                return;
            this._radius = v;
            this.invalidateGeometry();
        }
        /**
         * 胶囊体高度
         */
        get height() {
            return this._height;
        }
        set height(v) {
            if (this._height == v)
                return;
            this._height = v;
            this.invalidateGeometry();
        }
        /**
         * 横向分割数
         */
        get segmentsW() {
            return this._segmentsW;
        }
        set segmentsW(v) {
            if (this._segmentsW == v)
                return;
            this._segmentsW = v;
            this.invalidateGeometry();
        }
        /**
         * 纵向分割数
         */
        get segmentsH() {
            return this._segmentsH;
        }
        set segmentsH(v) {
            if (this._segmentsH == v)
                return;
            this._segmentsH = v;
            this.invalidateGeometry();
        }
        /**
         * 正面朝向 true:Y+ false:Z+
         */
        get yUp() {
            return this._yUp;
        }
        set yUp(v) {
            if (this._yUp == v)
                return;
            this._yUp = v;
            this.invalidateGeometry();
        }
        init() {
            this.invalidateGeometry();
        }
        invalidateGeometry() {
            var g = new feng3d.CapsuleGeometry();
            g.radius = this._radius;
            g.height = this._height;
            g.segmentsW = this._segmentsW;
            g.segmentsH = this._segmentsH;
            g.yUp = this._yUp;
            g.updateGrometry();
            this._shape = new CANNON.Trimesh(g.positions, g.indices);
        }
    };
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], CapsuleCollider.prototype, "radius", null);
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], CapsuleCollider.prototype, "height", null);
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], CapsuleCollider.prototype, "segmentsW", null);
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], CapsuleCollider.prototype, "segmentsH", null);
    __decorate([
        feng3d.serialize,
        feng3d.oav()
    ], CapsuleCollider.prototype, "yUp", null);
    CapsuleCollider = __decorate([
        feng3d.RegisterComponent()
    ], CapsuleCollider);
    CANNON.CapsuleCollider = CapsuleCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 平面碰撞体
     */
    let PlaneCollider = class PlaneCollider extends CANNON.Collider {
        init() {
            this._shape = new CANNON.Plane();
        }
    };
    PlaneCollider = __decorate([
        feng3d.AddComponentMenu("Physics/Plane Collider"),
        feng3d.RegisterComponent()
    ], PlaneCollider);
    CANNON.PlaneCollider = PlaneCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 物理世界组件
     */
    let PhysicsWorld = class PhysicsWorld extends feng3d.Behaviour {
        constructor() {
            super(...arguments);
            this.runEnvironment = feng3d.RunEnvironment.feng3d;
            /**
             * 物理世界
             */
            this.world = new CANNON.World();
            /**
             * 重力加速度
             */
            this.gravity = new feng3d.Vector3(0, -9.82, 0);
            this._isInit = false;
        }
        init() {
            super.init();
        }
        initWorld() {
            if (this._isInit)
                return true;
            this._isInit = true;
            var bodys = this.getComponentsInChildren("Rigidbody").map(c => c.body);
            bodys.forEach(v => {
                this.world.addBody(v);
            });
            //
            this.on("addChild", this.onAddChild, this);
            this.on("removeChild", this.onRemoveChild, this);
            this.on("addComponent", this.onAddComponent, this);
            this.on("removeComponent", this.onRemovedComponent, this);
        }
        onAddComponent(e) {
            if (e.data.component instanceof CANNON.Rigidbody) {
                this.world.addBody(e.data.component.body);
            }
        }
        onRemovedComponent(e) {
            if (e.data.component instanceof CANNON.Rigidbody) {
                this.world.removeBody(e.data.component.body);
            }
        }
        onAddChild(e) {
            var bodyComponent = e.data.child.getComponent("Rigidbody");
            if (bodyComponent) {
                this.world.addBody(bodyComponent.body);
            }
        }
        onRemoveChild(e) {
            var bodyComponent = e.data.child.getComponent("Rigidbody");
            if (bodyComponent) {
                this.world.removeBody(bodyComponent.body);
            }
        }
        update(interval) {
            this.initWorld();
            this.world.gravity = new CANNON.Vector3(this.gravity.x, this.gravity.y, this.gravity.z);
            this.world.step(1.0 / 60.0, interval / 1000, 3);
        }
    };
    __decorate([
        feng3d.oav(),
        feng3d.serialize
    ], PhysicsWorld.prototype, "gravity", void 0);
    PhysicsWorld = __decorate([
        feng3d.AddComponentMenu("Physics/PhysicsWorld"),
        feng3d.RegisterComponent()
    ], PhysicsWorld);
    CANNON.PhysicsWorld = PhysicsWorld;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    let Cloth = class Cloth extends feng3d.Renderable {
        constructor() {
            super(...arguments);
            this.runEnvironment = feng3d.RunEnvironment.feng3d;
        }
        init() {
            super.init();
            var clothMass = 1; // 1 kg in total
            var clothSize = 1; // 1 meter
            var Nx = 12;
            var Ny = 12;
            var mass = clothMass / Nx * Ny;
            var restDistance = clothSize / Nx;
            var clothFunction = plane(restDistance * Nx, restDistance * Ny);
            function plane(width, height) {
                return function (u, v) {
                    var x = (u - 0.5) * width;
                    var y = (v + 0.5) * height;
                    var z = 0;
                    return new feng3d.Vector3(x, y, z);
                };
            }
            var clothGeometry = this.geometry = new feng3d.ParametricGeometry(clothFunction, Nx, Ny, true);
            var particles = [];
            // Create cannon particles
            for (var i = 0, il = Nx + 1; i !== il; i++) {
                particles.push([]);
                for (var j = 0, jl = Ny + 1; j !== jl; j++) {
                    var idx = j * (Nx + 1) + i;
                    var p = clothFunction(i / (Nx + 1), j / (Ny + 1));
                    var particle = new CANNON.Body({
                        mass: j == Ny ? 0 : mass
                    });
                    particle.addShape(new CANNON.Particle());
                    particle.linearDamping = 0.5;
                    particle.position.set(p.x, p.y - Ny * 0.9 * restDistance, p.z);
                    particles[i].push(particle);
                    particle.velocity.set(0, 0, -0.1 * (Ny - j));
                }
            }
            var constraints = [];
            function connect(i1, j1, i2, j2) {
                constraints.push(new CANNON.DistanceConstraint(particles[i1][j1], particles[i2][j2], restDistance));
            }
            for (var i = 0; i < Nx + 1; i++) {
                for (var j = 0; j < Ny + 1; j++) {
                    if (i < Nx)
                        connect(i, j, i + 1, j);
                    if (j < Ny)
                        connect(i, j, i, j + 1);
                }
            }
            this.particles = particles;
            this.constraints = constraints;
        }
        update() {
            super.update();
            var physicsWorld = this.getComponentsInParents("PhysicsWorld")[0];
            var world = physicsWorld.world;
            this.particles.forEach(p => {
                p.forEach(v => {
                    world.addBody(v);
                });
            });
            this.constraints.forEach(v => {
                world.addConstraint(v);
            });
        }
    };
    Cloth = __decorate([
        feng3d.RegisterComponent()
    ], Cloth);
    CANNON.Cloth = Cloth;
})(CANNON || (CANNON = {}));
var feng3d;
(function (feng3d) {
    feng3d.classUtils.addClassNameSpace("CANNON");
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    feng3d.functionwrap.extendFunction(feng3d.GameObject, "createPrimitive", (g, type) => {
        if (type == "Cube") {
            g.addComponent("BoxCollider");
            g.addComponent("Rigidbody");
        }
        else if (type == "Plane") {
            g.addComponent("PlaneCollider");
            g.addComponent("Rigidbody");
        }
        else if (type == "Cylinder") {
            g.addComponent("CylinderCollider");
            g.addComponent("Rigidbody");
        }
        else if (type == "Sphere") {
            g.addComponent("SphereCollider");
            g.addComponent("Rigidbody");
        }
        else if (type == "Capsule") {
            g.addComponent("CapsuleCollider");
            g.addComponent("Rigidbody");
        }
        else if (type == "Cloth") {
            g.addComponent("Cloth");
        }
        return g;
    });
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    // 默认在 Scene.init 添加物理世界模块
    feng3d.functionwrap.extendFunction(feng3d.View, "createNewScene", function (r) {
        r.gameObject.addComponent("PhysicsWorld");
        return r;
    });
})(feng3d || (feng3d = {}));
//# sourceMappingURL=cannon-plugin.js.map