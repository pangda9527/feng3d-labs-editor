var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var CANNON;
(function (CANNON) {
    CANNON.World.worldNormal = new CANNON.Vector3(0, 1, 0);
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 刚体
     */
    var Rigidbody = /** @class */ (function (_super) {
        __extends(Rigidbody, _super);
        function Rigidbody() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.body = new CANNON.Body();
            _this.runEnvironment = feng3d.RunEnvironment.feng3d;
            return _this;
        }
        Object.defineProperty(Rigidbody.prototype, "mass", {
            get: function () {
                return this.body.mass;
            },
            set: function (v) {
                this.body.mass = v;
            },
            enumerable: true,
            configurable: true
        });
        Rigidbody.prototype.init = function () {
            var _this = this;
            this.body = new CANNON.Body({ mass: this.mass });
            this.body.position = new CANNON.Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z);
            var colliders = this.gameObject.getComponents(CANNON.Collider);
            colliders.forEach(function (element) {
                _this.body.addShape(element.shape);
            });
        };
        /**
         * 每帧执行
         */
        Rigidbody.prototype.update = function (interval) {
            var scene = this.getComponentsInParents(feng3d.Scene)[0];
            if (scene) {
                this.transform.position = new feng3d.Vector3(this.body.position.x, this.body.position.y, this.body.position.z);
            }
        };
        __decorate([
            feng3d.oav(),
            feng3d.serialize
        ], Rigidbody.prototype, "mass", null);
        return Rigidbody;
    }(feng3d.Behaviour));
    CANNON.Rigidbody = Rigidbody;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 碰撞体
     */
    var Collider = /** @class */ (function (_super) {
        __extends(Collider, _super);
        function Collider() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Collider.prototype, "shape", {
            get: function () {
                return this._shape;
            },
            enumerable: true,
            configurable: true
        });
        return Collider;
    }(feng3d.Component));
    CANNON.Collider = Collider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 长方体碰撞体
     */
    var BoxCollider = /** @class */ (function (_super) {
        __extends(BoxCollider, _super);
        function BoxCollider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 宽度
             */
            _this.width = 1;
            /**
             * 高度
             */
            _this.height = 1;
            /**
             * 深度
             */
            _this.depth = 1;
            return _this;
        }
        BoxCollider.prototype.init = function () {
            var halfExtents = new CANNON.Vector3(this.width / 2, this.height / 2, this.depth / 2);
            this._shape = new CANNON.Box(halfExtents);
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
        return BoxCollider;
    }(CANNON.Collider));
    CANNON.BoxCollider = BoxCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 球形碰撞体
     */
    var SphereCollider = /** @class */ (function (_super) {
        __extends(SphereCollider, _super);
        function SphereCollider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._radius = 0.5;
            return _this;
        }
        Object.defineProperty(SphereCollider.prototype, "radius", {
            /**
             * 半径
             */
            get: function () {
                return this._radius;
            },
            set: function (v) {
                this._radius = v;
                if (this._shape)
                    this._shape.radius = v;
            },
            enumerable: true,
            configurable: true
        });
        SphereCollider.prototype.init = function () {
            this._shape = new CANNON.Sphere(this._radius);
        };
        __decorate([
            feng3d.oav(),
            feng3d.serialize
        ], SphereCollider.prototype, "radius", null);
        return SphereCollider;
    }(CANNON.Collider));
    CANNON.SphereCollider = SphereCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 圆柱体碰撞体
     */
    var CylinderCollider = /** @class */ (function (_super) {
        __extends(CylinderCollider, _super);
        function CylinderCollider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 顶部半径
             */
            _this.topRadius = 0.5;
            /**
             * 底部半径
             */
            _this.bottomRadius = 0.5;
            /**
             * 高度
             */
            _this.height = 2;
            /**
             * 横向分割数
             */
            _this.segmentsW = 16;
            return _this;
        }
        CylinderCollider.prototype.init = function () {
            this._shape = new CANNON.Cylinder(this.topRadius, this.bottomRadius, this.height, this.segmentsW);
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
        return CylinderCollider;
    }(CANNON.Collider));
    CANNON.CylinderCollider = CylinderCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 胶囊体碰撞体
     */
    var CapsuleCollider = /** @class */ (function (_super) {
        __extends(CapsuleCollider, _super);
        function CapsuleCollider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._radius = 0.5;
            _this._height = 1;
            _this._segmentsW = 16;
            _this._segmentsH = 15;
            _this._yUp = true;
            return _this;
        }
        Object.defineProperty(CapsuleCollider.prototype, "radius", {
            /**
             * 胶囊体半径
             */
            get: function () {
                return this._radius;
            },
            set: function (v) {
                if (this._radius == v)
                    return;
                this._radius = v;
                this.invalidateGeometry();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CapsuleCollider.prototype, "height", {
            /**
             * 胶囊体高度
             */
            get: function () {
                return this._height;
            },
            set: function (v) {
                if (this._height == v)
                    return;
                this._height = v;
                this.invalidateGeometry();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CapsuleCollider.prototype, "segmentsW", {
            /**
             * 横向分割数
             */
            get: function () {
                return this._segmentsW;
            },
            set: function (v) {
                if (this._segmentsW == v)
                    return;
                this._segmentsW = v;
                this.invalidateGeometry();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CapsuleCollider.prototype, "segmentsH", {
            /**
             * 纵向分割数
             */
            get: function () {
                return this._segmentsH;
            },
            set: function (v) {
                if (this._segmentsH == v)
                    return;
                this._segmentsH = v;
                this.invalidateGeometry();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CapsuleCollider.prototype, "yUp", {
            /**
             * 正面朝向 true:Y+ false:Z+
             */
            get: function () {
                return this._yUp;
            },
            set: function (v) {
                if (this._yUp == v)
                    return;
                this._yUp = v;
                this.invalidateGeometry();
            },
            enumerable: true,
            configurable: true
        });
        CapsuleCollider.prototype.init = function () {
            this.invalidateGeometry();
        };
        CapsuleCollider.prototype.invalidateGeometry = function () {
            var g = new feng3d.CapsuleGeometry();
            g.radius = this._radius;
            g.height = this._height;
            g.segmentsW = this._segmentsW;
            g.segmentsH = this._segmentsH;
            g.yUp = this._yUp;
            g.updateGrometry();
            this._shape = new CANNON.Trimesh(g.positions, g.indices);
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
        return CapsuleCollider;
    }(CANNON.Collider));
    CANNON.CapsuleCollider = CapsuleCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 平面碰撞体
     */
    var PlaneCollider = /** @class */ (function (_super) {
        __extends(PlaneCollider, _super);
        function PlaneCollider() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlaneCollider.prototype.init = function () {
            this._shape = new CANNON.Plane();
        };
        return PlaneCollider;
    }(CANNON.Collider));
    CANNON.PlaneCollider = PlaneCollider;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    /**
     * 物理世界组件
     */
    var PhysicsWorld = /** @class */ (function (_super) {
        __extends(PhysicsWorld, _super);
        function PhysicsWorld() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.runEnvironment = feng3d.RunEnvironment.feng3d;
            /**
             * 物理世界
             */
            _this.world = new CANNON.World();
            /**
             * 重力加速度
             */
            _this.gravity = new feng3d.Vector3(0, -9.82, 0);
            _this._isInit = false;
            return _this;
        }
        PhysicsWorld.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        PhysicsWorld.prototype.initWorld = function () {
            var _this = this;
            if (this._isInit)
                return true;
            this._isInit = true;
            var bodys = this.getComponentsInChildren(CANNON.Rigidbody).map(function (c) { return c.body; });
            bodys.forEach(function (v) {
                _this.world.addBody(v);
            });
            //
            this.on("addChild", this.onAddChild, this);
            this.on("removeChild", this.onRemoveChild, this);
            this.on("addComponent", this.onAddComponent, this);
            this.on("removeComponent", this.onRemovedComponent, this);
        };
        PhysicsWorld.prototype.onAddComponent = function (e) {
            if (e.data instanceof CANNON.Rigidbody) {
                this.world.addBody(e.data.body);
            }
        };
        PhysicsWorld.prototype.onRemovedComponent = function (e) {
            if (e.data instanceof CANNON.Rigidbody) {
                this.world.removeBody(e.data.body);
            }
        };
        PhysicsWorld.prototype.onAddChild = function (e) {
            var bodyComponent = e.data.getComponent(CANNON.Rigidbody);
            if (bodyComponent) {
                this.world.addBody(bodyComponent.body);
            }
        };
        PhysicsWorld.prototype.onRemoveChild = function (e) {
            var bodyComponent = e.data.getComponent(CANNON.Rigidbody);
            if (bodyComponent) {
                this.world.removeBody(bodyComponent.body);
            }
        };
        PhysicsWorld.prototype.update = function (interval) {
            this.initWorld();
            this.world.gravity = new CANNON.Vector3(this.gravity.x, this.gravity.y, this.gravity.z);
            this.world.step(1.0 / 60.0, interval / 1000, 3);
        };
        __decorate([
            feng3d.oav(),
            feng3d.serialize
        ], PhysicsWorld.prototype, "gravity", void 0);
        return PhysicsWorld;
    }(feng3d.Behaviour));
    CANNON.PhysicsWorld = PhysicsWorld;
})(CANNON || (CANNON = {}));
var CANNON;
(function (CANNON) {
    var Cloth = /** @class */ (function (_super) {
        __extends(Cloth, _super);
        function Cloth() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.runEnvironment = feng3d.RunEnvironment.feng3d;
            return _this;
        }
        Cloth.prototype.init = function () {
            _super.prototype.init.call(this);
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
        };
        Cloth.prototype.update = function () {
            _super.prototype.update.call(this);
            var physicsWorld = this.getComponentsInParents(CANNON.PhysicsWorld)[0];
            var world = physicsWorld.world;
            this.particles.forEach(function (p) {
                p.forEach(function (v) {
                    world.addBody(v);
                });
            });
            this.constraints.forEach(function (v) {
                world.addConstraint(v);
            });
        };
        return Cloth;
    }(feng3d.Model));
    CANNON.Cloth = Cloth;
})(CANNON || (CANNON = {}));
var feng3d;
(function (feng3d) {
    feng3d.classUtils.addClassNameSpace("CANNON");
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    feng3d.functionwrap.extendFunction(feng3d.GameObject, "createPrimitive", function (g, type) {
        if (type == "Cube") {
            g.addComponent(CANNON.BoxCollider);
            g.addComponent(CANNON.Rigidbody);
        }
        else if (type == "Plane") {
            g.addComponent(CANNON.PlaneCollider);
            g.addComponent(CANNON.Rigidbody);
        }
        else if (type == "Cylinder") {
            g.addComponent(CANNON.CylinderCollider);
            g.addComponent(CANNON.Rigidbody);
        }
        else if (type == "Sphere") {
            g.addComponent(CANNON.SphereCollider);
            g.addComponent(CANNON.Rigidbody);
        }
        else if (type == "Capsule") {
            g.addComponent(CANNON.CapsuleCollider);
            g.addComponent(CANNON.Rigidbody);
        }
        else if (type == "Cloth") {
            g.addComponent(CANNON.Cloth);
        }
        return g;
    });
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    // 默认在 Scene.init 添加物理世界模块
    feng3d.functionwrap.extendFunction(feng3d.View, "createNewScene", function (r) {
        r.gameObject.addComponent(CANNON.PhysicsWorld);
        return r;
    });
})(feng3d || (feng3d = {}));
//# sourceMappingURL=cannon-plugin.js.map